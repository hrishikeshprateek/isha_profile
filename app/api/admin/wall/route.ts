import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

// GET /api/admin/wall - List all testimonials or fetch single by id
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.TESTIMONIALS);

    const id = request.nextUrl.searchParams.get('id');

    // If fetching a specific testimonial by ID
    if (id) {
      try {
        const item = await collection.findOne(
          { _id: new ObjectId(id) },
          {
            projection: {
              _id: 1,
              name: 1,
              designation: 1,
              company: 1,
              testimonial: 1,
              image: 1,
              rating: 1,
              date: 1,
              published: 1
            }
          }
        );

        if (!item) {
          return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          items: [{
            ...item,
            id: item._id?.toString()
          }]
        });
      } catch {
        return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
      }
    }

    // Otherwise, fetch all
    const items = await collection
      .find({}, {
        projection: {
          _id: 1,
          name: 1,
          designation: 1,
          company: 1,
          testimonial: 1,
          image: 1,
          rating: 1,
          date: 1,
          published: 1
        }
      })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      items: items.map(item => ({
        ...item,
        id: item._id?.toString()
      }))
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch testimonials',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/wall - Create new testimonial
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const data = await request.json();

    if (!data.name || !data.testimonial) {
      return NextResponse.json({ error: 'Name and testimonial text are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.TESTIMONIALS);

    const newItem = {
      name: data.name,
      designation: data.designation || '',
      company: data.company || '',
      testimonial: data.testimonial,
      image: data.image || '',
      rating: data.rating || 5,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
      published: data.published !== false
    };

    const result = await collection.insertOne(newItem);

    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

// PUT /api/admin/wall - Update testimonial
export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.TESTIMONIALS);

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
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE /api/admin/wall - Delete testimonial
export async function DELETE(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.TESTIMONIALS);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
