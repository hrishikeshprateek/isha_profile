import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

const DEFAULT_LIMIT = 10;

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10);
  const search = searchParams.get('search')?.trim();
  const status = searchParams.get('status')?.trim();

  const filter: Record<string, any> = {};
  if (search) {
    filter.$or = [
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

    const db = await getDatabase();
    const col = db.collection('contacts');

    await col.updateOne({ _id: new (require('mongodb').ObjectId)(id) }, { $set: { status } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin enquiries PATCH error', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}

