import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

// GET /api/admin/instagram - Get Instagram section data (PUBLIC - no auth required)
export async function GET(request: NextRequest) {

  try {
    const db = await getDatabase();
    const collection = db.collection('instagram');

    const instagramData = await collection.findOne({});

    if (!instagramData) {
      // Return default data if none exists
      return NextResponse.json({
        success: true,
        data: {
          profileUrl: 'https://www.instagram.com/moreofisha._/',
          profileHandle: 'moreofisha._',
          posts: [
            {
              id: 'post1',
              url: 'https://www.instagram.com/p/DRpYFwQDyXb/',
            },
            {
              id: 'post2',
              url: 'https://www.instagram.com/p/DUBGMakE2s5/',
            },
          ],
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        profileUrl: instagramData.profileUrl || 'https://www.instagram.com/moreofisha._/',
        profileHandle: instagramData.profileHandle || 'moreofisha._',
        posts: instagramData.posts || [],
      }
    });
  } catch (error) {
    console.error('Get Instagram error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Instagram data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/instagram - Update Instagram section data
export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const data = await request.json();

    const db = await getDatabase();
    const collection = db.collection('instagram');

    const updateData = {
      profileUrl: data.profileUrl || 'https://www.instagram.com/moreofisha._/',
      profileHandle: data.profileHandle || 'moreofisha._',
      posts: data.posts || [],
      updatedAt: new Date(),
    };

    // Upsert: update if exists, insert if not
    await collection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Instagram section updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Update Instagram error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update Instagram data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

