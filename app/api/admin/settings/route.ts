import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

// GET /api/admin/settings - list all settings (admin only)
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const db = await getDatabase();
    const collection = db.collection('settings');
    const all = await collection.find({}).toArray();
    return NextResponse.json({ success: true, settings: all });
  } catch (error) {
    console.error('Admin settings GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings - update a setting (admin only)
export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { key, value } = body;
    if (!key) return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });

    const db = await getDatabase();
    const collection = db.collection('settings');

    await collection.updateOne(
      { key },
      { $set: { key, value, updatedAt: new Date(), updatedBy: auth.uid } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin settings PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update setting' }, { status: 500 });
  }
}
