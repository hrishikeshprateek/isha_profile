import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/wall-items - Public API for portfolio items
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('wall_items');

    const items = await collection
      .find({ published: { $ne: false } })
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    if (!items || items.length === 0) {
      return NextResponse.json({
        success: true,
        items: []
      });
    }

    return NextResponse.json({
      success: true,
      items: items.map((item, index) => ({
        id: index + 1,
        type: item.type,
        category: item.category,
        src: item.src,
        thumb: item.thumb,
        title: item.title,
        client: item.client,
        desc: item.desc,
      }))
    });
  } catch (error) {
    console.error('Get wall items error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch portfolio items',
        items: []
      },
      { status: 200 }
    );
  }
}

