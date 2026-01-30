import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { Collection, Document, ObjectId } from 'mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

function slugify(input: string | undefined): string {
  if (!input) return '';
  return input
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function generateUniqueSlug(collection: Collection<Document>, base: string, excludeId?: ObjectId | string) {
  if (!base) base = String(Date.now());
  const escaped = escapeRegExp(base);
  const regex = new RegExp(`^${escaped}(-\\d+)?$`);

  const query: Record<string, unknown> = { slug: { $regex: regex } };
  if (excludeId) {
    try {
      query._id = { $ne: typeof excludeId === 'string' ? new ObjectId(excludeId) : excludeId } as unknown;
    } catch {
      // ignore
    }
  }

  const docs = await collection.find(query as Document, { projection: { slug: 1 } }).toArray();
  const existing = new Set(docs.map((d: Document) => (d.slug as string) || ''));

  if (!existing.has(base)) return base;
  for (let i = 1; i < 10000; i++) {
    const candidate = `${base}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    // find docs without slug or empty slug
    const missing = await collection.find({ $or: [{ slug: { $exists: false } }, { slug: '' }] }).toArray();
    const updates: { id: string; slug: string }[] = [];

    for (const doc of missing) {
      const base = slugify((doc.title as string) || String(doc._id));
      const unique = await generateUniqueSlug(collection, base, doc._id);
      await collection.updateOne({ _id: doc._id }, { $set: { slug: unique } });
      updates.push({ id: String(doc._id), slug: unique });
    }

    return NextResponse.json({ success: true, updated: updates.length, details: updates });
  } catch (err) {
    console.error('Backfill slugs error', err);
    return NextResponse.json({ success: false, error: 'Failed to backfill slugs' }, { status: 500 });
  }
}

