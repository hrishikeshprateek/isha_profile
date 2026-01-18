import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/blogs - List all blogs with filtering
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    // Get query parameters for filtering
    const category = request.nextUrl.searchParams.get('category');
    const search = request.nextUrl.searchParams.get('search');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    const filter: Record<string, any> = {};

    // Apply filters
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
  try {
    const data = await request.json();

    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

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
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    const result = await collection.insertOne(newBlog);

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

// PUT /api/admin/blogs - Update blog
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.BLOGS);

    const updateData = {
      ...data,
      updatedAt: new Date(),
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    delete updateData.id;
    delete updateData._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE /api/admin/blogs?id=xxx - Delete blog
export async function DELETE(request: NextRequest) {
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

