import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/media - List all media or fetch single by id
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('media');

    const id = request.nextUrl.searchParams.get('id');

    // If fetching a specific media by ID
    if (id) {
      try {
        const item = await collection.findOne(
          { _id: new ObjectId(id) },
          {
            projection: {
              _id: 1,
              url: 1,
              type: 1,
              name: 1,
              uploadedAt: 1,
              folder: 1,
              size: 1,
            }
          }
        );

        if (!item) {
          return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          items: [{
            ...item,
            id: item._id?.toString()
          }]
        });
      } catch {
        return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 });
      }
    }

    // Otherwise, fetch all media
    const items = await collection
      .find({}, {
        projection: {
          _id: 1,
          url: 1,
          type: 1,
          name: 1,
          uploadedAt: 1,
          folder: 1,
          size: 1,
        }
      })
      .sort({ uploadedAt: -1 })
      .limit(1000)
      .toArray();

    return NextResponse.json({
      success: true,
      items: items.map(item => ({
        ...item,
        id: item._id?.toString()
      }))
    });
  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch media',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/media - Add new media to library
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.url || !data.type) {
      return NextResponse.json(
        { error: 'URL and type are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('media');

    const newMedia = {
      url: data.url,
      type: data.type,
      name: data.name || `Upload - ${new Date().toLocaleString()}`,
      uploadedAt: new Date(),
      folder: data.folder || 'media',
      size: data.size || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newMedia);

    return NextResponse.json({
      success: true,
      message: 'Media added to library',
      id: result.insertedId.toString(),
      media: {
        ...newMedia,
        id: result.insertedId.toString()
      }
    });
  } catch (error) {
    console.error('Add media error:', error);
    return NextResponse.json(
      { error: 'Failed to add media to library' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/media - Delete media from library
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('media');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}

