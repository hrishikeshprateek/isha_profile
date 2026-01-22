import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

// GET /api/admin/my-journey - Get my journey data
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const db = await getDatabase();
    const collection = db.collection('my_journey');

    const journeyData = await collection.findOne({});

    if (!journeyData) {
      // Return default data if none exists
      return NextResponse.json({
        success: true,
        data: {
          title: 'My Journey',
          subtitle: 'A story of growth, learning, and digital creation',
          description: 'Discover how I evolved from a photographer to a digital creator',
          chapters: [
            {
              id: '1',
              year: 'The Beginning',
              title: 'It started with a lens',
              text: 'I didn\'t start as a designer. I started as an observer.',
              image: '',
              icon: 'Camera'
            },
            {
              id: '2',
              year: 'The Pivot',
              title: 'From Pixel to Code',
              text: 'Photography taught me aesthetics, but I wanted interactivity.',
              image: '',
              icon: 'Zap'
            },
            {
              id: '3',
              year: 'The Now',
              title: 'Building Digital Empires',
              text: 'Today, I merge strategy with storytelling.',
              image: '',
              icon: 'Heart'
            }
          ]
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: journeyData
    });
  } catch (error) {
    console.error('Get my journey error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch my journey data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/my-journey - Update my journey data
export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const data = await request.json();

    const db = await getDatabase();
    const collection = db.collection('my_journey');

    const updateData = {
      title: data.title || 'My Journey',
      subtitle: data.subtitle || '',
      description: data.description || '',
      chapters: data.chapters || [],
      updatedAt: new Date(),
    };

    // Upsert: update if exists, insert if not
    await collection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'My journey updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Update my journey error:', error);
    return NextResponse.json(
      { error: 'Failed to update my journey' },
      { status: 500 }
    );
  }
}

