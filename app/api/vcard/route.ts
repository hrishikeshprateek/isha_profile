import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';

// GET /api/vcard - Fetch vcard data
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.VCARD);

    const vcard = await collection.findOne({}, { projection: { _id: 0 } });

    if (!vcard) {
      return NextResponse.json(
        {
          success: true,
          data: null,
          message: 'No vcard data found'
        },
        {
          headers: {
            'Cache-Tag': 'vcard'
          }
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: vcard
      },
      {
        headers: {
          'Cache-Tag': 'vcard'
        }
      }
    );
  } catch (error) {
    console.error('Get vcard error:', error);
    return NextResponse.json({ error: 'Failed to fetch vcard' }, { status: 500 });
  }
}

// PUT /api/vcard - Update vcard data (admin only)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.profile || !data.profile.name) {
      return NextResponse.json({ error: 'Invalid vcard data' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.VCARD);

    // Update or insert
    await collection.updateOne(
      {},
      {
        $set: {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      },
      { upsert: true }
    );

    // Note: Cache will be invalidated on next request because timestamp updated
    console.log('✅ VCard updated successfully');

    return NextResponse.json({
      success: true,
      message: 'VCard updated successfully'
    });
  } catch (error) {
    console.error('Update vcard error:', error);
    return NextResponse.json({ error: 'Failed to update vcard' }, { status: 500 });
  }
}

