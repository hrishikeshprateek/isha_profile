import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body || {};
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    // rate limit: 20 shares per hour per IP
    const ip = getClientIp(request);
    const rl = checkRateLimit('share', ip, 20, 3600);
    if (!rl.allowed) {
      const retryAfter = Math.ceil((rl.reset - Date.now()) / 1000);
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { shares: 1 } },
      { returnDocument: 'after' }
    );

    const updated = result && (result.value as any | null);
    if (!updated) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const shares = updated.shares || 0;
    return NextResponse.json({ success: true, shares });
  } catch (error) {
    console.error('Share API error', error);
    return NextResponse.json({ error: 'Failed to update shares' }, { status: 500 });
  }
}
