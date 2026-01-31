import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { ObjectId } from 'mongodb';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  let limit = parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10);
  if (Number.isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
  limit = Math.min(limit, MAX_LIMIT);
  const search = searchParams.get('search')?.trim();
  const status = searchParams.get('status')?.trim();

  const filter: { [key: string]: unknown } = {};
  if (search) {
    // Use bracket notation to avoid TypeScript index errors
    filter['$or'] = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) {
    filter.status = status;
  }

  try {
    const db = await getDatabase();
    const col = db.collection('contacts');

    const total = await col.countDocuments(filter);
    const enquiries = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, enquiries, total, page, limit });
  } catch (error) {
    console.error('Admin enquiries GET error', error);
    return NextResponse.json({ success: false, error: 'Failed to load enquiries' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { id, status } = body || {};
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }

    const db = await getDatabase();
    const col = db.collection('contacts');

    const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Admin enquiries PATCH error', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}
