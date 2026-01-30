import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { ObjectId, Collection, Document } from 'mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

// Helper: slugify a string to kebab-case (a-z0-9 and hyphens)
function slugify(input: string | undefined): string {
  if (!input) return '';
  return input
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .trim()
    .replace(/[\s_-]+/g, '-') // collapse whitespace and underscores to -
    .replace(/^-+|-+$/g, ''); // trim leading/trailing -
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Generate a unique slug by checking existing slugs in the collection.
// If excludeId is provided, that document is ignored (useful for updates).
async function generateUniqueSlug(collection: Collection<Document>, base: string, excludeId?: ObjectId | string) {
  if (!base) base = String(Date.now());
  const escaped = escapeRegExp(base);
  // match base or base-123 pattern
  const regex = new RegExp(`^${escaped}(-\\d+)?$`);

  const query: Record<string, unknown> = { slug: { $regex: regex } };
  if (excludeId) {
    try {
      query._id = { $ne: typeof excludeId === 'string' ? new ObjectId(excludeId) : excludeId } as unknown;
    } catch {
      // ignore invalid id
    }
  }

  const docs = await collection.find(query as Document, { projection: { slug: 1 } }).toArray();
  const existing = new Set(docs.map((d: Document) => (d.slug as string) || ''));

  if (!existing.has(base)) return base;

  // find smallest available suffix
  for (let i = 1; i < 10000; i++) {
    const candidate = `${base}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }

  // fallback
  return `${base}-${Date.now()}`;
}

// GET /api/admin/blogs - List all blogs with filtering
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    // Get query parameters for filtering
    const id = request.nextUrl.searchParams.get('id');
    const category = request.nextUrl.searchParams.get('category');
    const search = request.nextUrl.searchParams.get('search');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    // If fetching a specific blog by ID
    if (id) {
      try {
        const blog = await collection.findOne(
          { _id: new ObjectId(id) },
          {
            projection: {
              _id: 1,
              title: 1,
              excerpt: 1,
              content: 1,
              category: 1,
              date: 1,
              image: 1,
              author: 1,
              readTime: 1,
              tags: 1,
              published: 1,
              slug: 1,
            }
          }
        );

        if (!blog) {
          return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          blogs: [{
            ...blog,
            id: blog._id?.toString(),
          }]
        });
      } catch {
        return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
      }
    }

    const filter: Record<string, unknown> = {};

    // Apply filters
    if (category && category !== 'All') {
      filter['category'] = category;
    }

    if (search) {
      filter['$or'] = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Add date range filtering
    if (startDate || endDate) {
      const dateFilter: Record<string, unknown> = {};
      if (startDate) {
        dateFilter['$gte'] = new Date(startDate).toISOString().split('T')[0];
      }
      if (endDate) {
        dateFilter['$lte'] = new Date(endDate).toISOString().split('T')[0];
      }
      filter['date'] = dateFilter;
    }

    const blogs = await collection
      .find(filter as Document, {
        projection: {
          _id: 1,
          title: 1,
          excerpt: 1,
          category: 1,
          date: 1,
          image: 1,
          author: 1,
          readTime: 1,
          tags: 1,
          published: 1
        }
      })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      blogs: blogs.map(blog => ({
        ...blog,
        id: blog._id?.toString()
      }))
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST /api/admin/blogs - Create new blog
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const data = await request.json();

    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    // generate SEO-friendly slug and ensure uniqueness
    const baseSlug = slugify(data.slug || data.title || String(Date.now()));
    const uniqueSlug = await generateUniqueSlug(collection, baseSlug);

    const newBlog = {
      title: data.title,
      excerpt: data.excerpt || '',
      content: data.content,
      category: data.category || 'General',
      author: data.author || 'Isha Rani',
      image: data.image || '',
      tags: data.tags || [],
      readTime: data.readTime || `${Math.ceil(data.content.split(' ').length / 200)} min read`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
      published: data.published !== false,
      slug: uniqueSlug,
    };

    const result = await collection.insertOne(newBlog);

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      id: result.insertedId.toString(),
      slug: uniqueSlug
    });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

// PUT /api/admin/blogs - Update blog
export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    // regenerate slug if title changed or slug provided
    const baseSlug = slugify(data.slug || data.title || '');
    const uniqueSlug = baseSlug ? await generateUniqueSlug(collection, baseSlug, data.id) : undefined;

    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    };

    if (uniqueSlug) updateData['slug'] = uniqueSlug;

    delete updateData['id'];
    delete updateData['_id'];

    const result = await collection.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      slug: uniqueSlug
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE /api/admin/blogs?id=xxx - Delete blog
export async function DELETE(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
