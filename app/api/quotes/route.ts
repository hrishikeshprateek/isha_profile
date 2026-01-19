import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';

// GET /api/quotes - Public endpoint to fetch quotes
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.QUOTES);

    // Get query parameters for filtering
    const category = request.nextUrl.searchParams.get('category');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const random = request.nextUrl.searchParams.get('random') === 'true';

    const filter: Record<string, any> = {
      published: true // Only show published quotes
    };

    // Apply category filter if provided
    if (category && category !== 'All') {
      filter.category = category;
    }

    let query = collection.find(filter, {
      projection: {
        _id: 1,
        text: 1,
        author: 1,
        category: 1,
        date: 1
      }
    });

    // Apply sorting
    if (random) {
      // Get random quotes using aggregation
      const quotes = await collection
        .aggregate([
          { $match: filter },
          { $sample: { size: Math.min(limit, 50) } },
          {
            $project: {
              _id: 1,
              text: 1,
              author: 1,
              category: 1,
              date: 1
            }
          }
        ])
        .toArray();

      return NextResponse.json({
        success: true,
        quotes: quotes.map(quote => ({
          ...quote,
          id: quote._id?.toString()
        }))
      });
    } else {
      const quotes = await query
        .sort({ date: -1 })
        .limit(limit)
        .toArray();

      return NextResponse.json({
        success: true,
        quotes: quotes.map(quote => ({
          ...quote,
          id: quote._id?.toString()
        }))
      });
    }
  } catch (error) {
    console.error('Get quotes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

