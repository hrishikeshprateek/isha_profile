import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return auth.response;
    }

    const db = await getDatabase();
    const data = await db.collection('expertise').findOne({});

    if (!data) {
      return NextResponse.json({ success: false, error: 'No expertise data found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        title: data.title || 'My Creative Universe',
        subtitle: data.subtitle || 'Drag the icons to explore the connections.',
        categories: data.categories || []
      }
    });
  } catch (error) {
    console.error('Admin Expertise GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch expertise data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return auth.response;
    }

    const payload = await request.json();
    const db = await getDatabase();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = payload;

    await db.collection('expertise').updateOne(
      {},
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Expertise PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save expertise data' }, { status: 500 });
  }
}

