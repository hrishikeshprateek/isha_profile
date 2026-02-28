import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const db = await getDatabase();
    const col = db.collection('footer_links');
    const doc = await col.findOne({});
    return NextResponse.json({ success: true, links: doc?.links || [] });
  } catch (err) {
    console.error('Footer GET error', err);
    return NextResponse.json({ success: false, error: 'Failed to load footer links' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const links = Array.isArray(body.links) ? body.links : [];

    // Basic validation: each link should have label and href
    const cleanLinks = links.map((l: unknown) => {
      const item = l as { label?: unknown; href?: unknown; order?: unknown; external?: unknown };
      return {
        label: typeof item.label === 'string' ? item.label : '',
        href: typeof item.href === 'string' ? item.href : '',
        order: typeof item.order === 'number' ? item.order : 0,
        external: !!item.external,
      };
    });

    const db = await getDatabase();
    const col = db.collection('footer_links');
    await col.updateOne({}, { $set: { links: cleanLinks, updatedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Footer PUT error', err);
    return NextResponse.json({ success: false, error: 'Failed to save footer links' }, { status: 500 });
  }
}
