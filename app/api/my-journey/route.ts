import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/my-journey - Public API for my journey data (SSR)
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('my_journey');

    const journeyData = await collection.findOne({});

    if (!journeyData) {
      // Return default data
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
        success: false,
        error: 'Failed to fetch my journey data',
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
      },
      { status: 200 } // Still return 200 with fallback data
    );
  }
}

