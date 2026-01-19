import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';

// GET /api/wall - Public endpoint to fetch testimonials
export async function GET(_request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.TESTIMONIALS);

    const filter: Record<string, boolean> = {
      published: true
    };

    const items = await collection
      .find(filter, {
        projection: {
          _id: 1,
          name: 1,
          designation: 1,
          company: 1,
          testimonial: 1,
          image: 1,
          rating: 1,
          date: 1
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
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

