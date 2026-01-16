import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth-middleware';
import { getDatabase, Collections } from '@/lib/mongodb';

/**
 * Protected admin blog API endpoints
 * All requests must include valid Firebase ID token with admin claim
 * Authorization: Bearer <firebase_id_token>
 */

interface DecodedToken {
  uid: string;
  email?: string;
  admin?: boolean;
  iat: number;
  exp: number;
}

// GET /api/admin/blogs - List all blogs
export const GET = withAdminAuth(async (request: NextRequest, user: DecodedToken) => {
  void request; // Mark as intentionally unused
  void user; // Mark as intentionally unused

  try {
    const db = await getDatabase();
    const blogsCollection = db.collection(Collections.BLOG_POSTS);

    const blogs = await blogsCollection.find({}).toArray();

    return NextResponse.json({
      success: true,
      blogs,
      total: blogs.length,
    });
  } catch (error: unknown) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
});

// POST /api/admin/blogs - Create a new blog
export const POST = withAdminAuth(async (request: NextRequest, user: DecodedToken) => {
  try {
    const body = await request.json();
    const { title, content, category, excerpt, featured, image } = body as Record<string, unknown>;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const blogsCollection = db.collection(Collections.BLOG_POSTS);

    const newBlog = {
      title,
      content,
      category: category || 'General',
      excerpt: excerpt || String(content).substring(0, 150),
      featured: featured || false,
      image: image || null,
      author: {
        uid: user.uid,
        email: user.email,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      published: true,
      views: 0,
      comments: [],
    };

    const result = await blogsCollection.insertOne(newBlog);

    return NextResponse.json(
      {
        success: true,
        message: 'Blog created successfully',
        blog: { _id: result.insertedId, ...newBlog },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
});

