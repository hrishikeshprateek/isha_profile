import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const db = await getDatabase();
    const col = db.collection('navigation');
    const doc = await col.findOne({});
    return NextResponse.json({ success: true, items: doc?.items || [] });
  } catch (err) {
    console.error('Navigation GET error', err);
    return NextResponse.json({ success: false, error: 'Failed to load navigation' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const db = await getDatabase();
    const col = db.collection('navigation');
    await col.updateOne({}, { $set: { items, updatedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Navigation PUT error', err);
    return NextResponse.json({ success: false, error: 'Failed to save navigation' }, { status: 500 });
  }
}
