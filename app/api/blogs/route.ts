import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/blogs - Fetch all published blogs
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    // Support fetching a single blog by id or slug for public detail view
    const idParam = request.nextUrl.searchParams.get('id');
    if (idParam) {
      // try by ObjectId first
      try {
        const blog = await collection.findOne(
          { _id: new ObjectId(idParam), published: true },
          {
            projection: {
              _id: 1,
              title: 1,
              excerpt: 1,
              content: 1,
              category: 1,
              date: 1,
              readTime: 1,
              image: 1,
              author: 1,
              tags: 1,
              slug: 1,
              published: 1
            }
          }
        );

        if (blog) {
          return NextResponse.json({ success: true, blog: { ...blog, id: blog._id?.toString() } });
        }
      } catch (err) {
        // not a valid ObjectId or failed lookup — fallthrough to slug lookup
      }

      // attempt to find by slug
      try {
        const blog = await collection.findOne(
          { slug: idParam, published: true },
          {
            projection: {
              _id: 1,
              title: 1,
              excerpt: 1,
              content: 1,
              category: 1,
              date: 1,
              readTime: 1,
              image: 1,
              author: 1,
              tags: 1,
              slug: 1,
              published: 1
            }
          }
        );

        if (blog) {
          return NextResponse.json({ success: true, blog: { ...blog, id: blog._id?.toString() } });
        }

        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      } catch (err) {
        console.error('Error fetching blog by slug:', err);
        return NextResponse.json({ error: 'Invalid blog identifier' }, { status: 400 });
      }
    }

    // Get query parameters for filtering
    const category = request.nextUrl.searchParams.get('category');
    const search = request.nextUrl.searchParams.get('search');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    const filter: Record<string, any> = { published: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Add date range filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate).toISOString().split('T')[0];
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate).toISOString().split('T')[0];
      }
    }

    const blogs = await collection
      .find(filter, {
        projection: {
          _id: 1,
          title: 1,
          excerpt: 1,
          category: 1,
          date: 1,
          readTime: 1,
          image: 1,
          author: 1,
          tags: 1,
          slug: 1
        }
      })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        blogs: (blogs || []).map(blog => ({
          ...blog,
          id: blog._id?.toString() ?? String(blog.id ?? ''),
        }))
      },
      {
        headers: {
          'Cache-Tag': 'blogs'
        }
      }
    );
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
