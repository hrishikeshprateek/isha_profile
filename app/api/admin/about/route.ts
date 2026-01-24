import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const db = await getDatabase();
    const doc = await db.collection('about').findOne({});
    return NextResponse.json({ success: true, data: doc || null });
  } catch (error) {
    console.error('Admin About GET error', error);
    return NextResponse.json({ success: false, error: 'Failed to load about data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const payload = await request.json();
    const db = await getDatabase();

    // Remove _id from payload to avoid modifying immutable field
    const { _id, ...updateData } = payload;

    await db.collection('about').updateOne({}, { $set: { ...updateData, updatedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin About PUT error', error);
    return NextResponse.json({ success: false, error: 'Failed to save about data' }, { status: 500 });
  }
}
