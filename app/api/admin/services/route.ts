import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;
  try {
    const db = await getDatabase();
    const docs = await db.collection('services').find({}).sort({ id: 1 }).toArray();
    return NextResponse.json({ success: true, data: docs || [] });
  } catch (error) {
    console.error('Admin Services GET error', error);
    return NextResponse.json({ success: false, error: 'Failed to load services' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;
  try {
    const payload = await request.json();
    if (!Array.isArray(payload)) {
      return NextResponse.json({ success: false, error: 'Payload must be an array' }, { status: 400 });
    }
    const db = await getDatabase();
    const col = db.collection('services');
    await col.deleteMany({});
    if (payload.length) {
      await col.insertMany(payload.map((s, idx) => ({ ...s, idx })));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Services PUT error', error);
    return NextResponse.json({ success: false, error: 'Failed to save services' }, { status: 500 });
  }
}

