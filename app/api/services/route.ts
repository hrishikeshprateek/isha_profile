import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const docs = await db.collection('services').find({}).sort({ id: 1 }).toArray();
    return NextResponse.json({ success: true, data: docs || [] });
  } catch (error) {
    console.error('Services GET error', error);
    return NextResponse.json({ success: false, error: 'Failed to load services' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    if (!Array.isArray(payload)) {
      return NextResponse.json({ success: false, error: 'Payload must be an array' }, { status: 400 });
    }
    const db = await getDatabase();
    const col = db.collection('services');
    // Replace all
    await col.deleteMany({});
    if (payload.length) {
      await col.insertMany(payload.map((s: unknown, idx: number) => ({ ...s as Record<string, unknown>, idx })));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Services PUT error', error);
    return NextResponse.json({ success: false, error: 'Failed to save services' }, { status: 500 });
  }
}
