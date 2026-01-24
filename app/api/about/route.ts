import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const doc = await db.collection('about').findOne({});
    return NextResponse.json({ success: true, data: doc || null });
  } catch (error) {
    console.error('About GET error', error);
    return NextResponse.json({ success: false, error: 'Failed to load about data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = await req.json();
    const db = await getDatabase();
    await db.collection('about').updateOne({}, { $set: { ...payload, updatedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('About PUT error', error);
    return NextResponse.json({ success: false, error: 'Failed to save about data' }, { status: 500 });
  }
}
