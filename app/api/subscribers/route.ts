import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';

// POST /api/subscribers  -> create a subscriber
export async function POST(request: NextRequest) {
  try {
    const { email, source = 'footer' } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.SUBSCRIBERS);

    const existing = await collection.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    await collection.insertOne({
      email: email.toLowerCase(),
      source,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

// GET /api/subscribers  -> list subscribers (admin only)
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.SUBSCRIBERS);
    const subscribers = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, subscribers });
  } catch (error) {
    console.error('List subscribers error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

