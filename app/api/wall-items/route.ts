import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/wall-items - Public API for portfolio items (SSR)
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('wall_items');

    const items = await collection
      .find({ published: { $ne: false } })
      .sort({ createdAt: -1 })
      .toArray();

    if (!items || items.length === 0) {
      // Return default items if none exist
      return NextResponse.json({
        success: true,
        items: [
          {
            id: 1,
            type: "image",
            category: "Photography",
            src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800",
            thumb: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800",
            title: "Sample Portfolio Item",
            client: "Sample Client",
            desc: "Add your portfolio items from the admin panel"
          }
        ]
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
    // Return default items on error
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

