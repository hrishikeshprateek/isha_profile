import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

// GET /api/admin/wall-items - Get all portfolio items
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const db = await getDatabase();
    const collection = db.collection('wall_items');

    const items = await collection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      items: items.map((item, index) => ({
        id: item._id?.toString() || index.toString(),
        type: item.type,
        category: item.category,
        src: item.src,
        thumb: item.thumb,
        title: item.title,
        client: item.client,
        desc: item.desc,
        published: item.published !== false,
      }))
    });
  } catch (error) {
    console.error('Get wall items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/wall-items - Update all portfolio items
export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const data = await request.json();

    const db = await getDatabase();
    const collection = db.collection('wall_items');

    // Clear and rebuild
    await collection.deleteMany({});

    if (data.items && Array.isArray(data.items)) {
      const itemsToInsert = data.items.map((item: any, index: number) => ({
        type: item.type,
        category: item.category,
        src: item.src,
        thumb: item.thumb,
        title: item.title,
        client: item.client,
        desc: item.desc,
        published: item.published !== false,
        order: index,
        createdAt: new Date(),
      }));

      await collection.insertMany(itemsToInsert);
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio updated successfully'
    });
  } catch (error) {
    console.error('Update wall items error:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

