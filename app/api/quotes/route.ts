import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';

// GET /api/quotes - Public endpoint to fetch quotes
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.QUOTES);

    // Get query parameters for filtering
    const category = request.nextUrl.searchParams.get('category');
    const limitParam = parseInt(request.nextUrl.searchParams.get('limit') || '50', 10);
    const pageParam = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const random = request.nextUrl.searchParams.get('random') === 'true';
    const search = request.nextUrl.searchParams.get('search')?.trim();

    const DEFAULT_LIMIT = 50;
    const MAX_LIMIT = 200;
    let limit = Number.isNaN(limitParam) ? DEFAULT_LIMIT : Math.min(Math.max(1, limitParam), MAX_LIMIT);
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const filter: { [key: string]: unknown } = { published: true };

    // Apply category filter if provided
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Apply search filter
    if (search) {
      filter['$or'] = [
        { text: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    if (random) {
      // When random is requested, return a sampled set (respect limit)
      const sampleSize = Math.min(limit, 100);
      const quotes = await collection
        .aggregate([
          { $match: filter },
          { $sample: { size: sampleSize } },
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
        quotes: quotes.map(quote => ({ ...quote, id: quote._id?.toString() })),
        total: quotes.length,
        page: 1,
        limit: sampleSize
      });
    }

    // Otherwise, perform a paginated find
    const total = await collection.countDocuments(filter);
    const quotes = await collection
      .find(filter, {
        projection: {
          _id: 1,
          text: 1,
          author: 1,
          category: 1,
          date: 1
        }
      })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      quotes: quotes.map(quote => ({ ...quote, id: quote._id?.toString() })),
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
