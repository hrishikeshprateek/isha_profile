import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/quotes - List all quotes with filtering or fetch a specific quote
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.QUOTES);

    // Get query parameters for filtering
    const id = request.nextUrl.searchParams.get('id');
    const category = request.nextUrl.searchParams.get('category');
    const search = request.nextUrl.searchParams.get('search');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    // If fetching a specific quote by ID
    if (id) {
      try {
        const quote = await collection.findOne(
          { _id: new ObjectId(id) },
          {
            projection: {
              _id: 1,
              text: 1,
              author: 1,
              category: 1,
              date: 1,
              published: 1
            }
          }
        );

        if (!quote) {
          return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          quotes: [{
            ...quote,
            id: quote._id?.toString()
          }]
        });
      } catch (err) {
        return NextResponse.json({ error: 'Invalid quote ID' }, { status: 400 });
      }
    }

    // Otherwise, fetch all with filters
    const filter: Record<string, any> = {};

    // Apply filters
    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { text: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Add date range filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate).toISOString().split('T')[0];
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate).toISOString().split('T')[0];
      }
    }

    const quotes = await collection
      .find(filter, {
        projection: {
          _id: 1,
          text: 1,
          author: 1,
          category: 1,
          date: 1,
          published: 1
        }
      })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      quotes: quotes.map(quote => ({
        ...quote,
        id: quote._id?.toString()
      }))
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

// POST /api/admin/quotes - Create new quote
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.text || !data.author) {
      return NextResponse.json({ error: 'Quote text and author are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.QUOTES);

    const newQuote = {
      text: data.text,
      author: data.author,
      category: data.category || 'General',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
      published: data.published !== false
    };

    const result = await collection.insertOne(newQuote);

    return NextResponse.json({
      success: true,
      message: 'Quote created successfully',
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Create quote error:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}

// PUT /api/admin/quotes - Update quote
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.QUOTES);

    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    delete updateData.id;
    delete updateData._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Quote updated successfully'
    });
  } catch (error) {
    console.error('Update quote error:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

// DELETE /api/admin/quotes - Delete quote
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.QUOTES);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    console.error('Delete quote error:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}

