import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const db = await getDatabase();
    const data = await db.collection('expertise').findOne({});

    if (!data) {
      return NextResponse.json({
        success: true,
        data: {
          title: 'My Creative Universe',
          subtitle: 'Drag the icons to explore the connections.',
          categories: []
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        title: data.title || 'My Creative Universe',
        subtitle: data.subtitle || 'Drag the icons to explore the connections.',
        categories: data.categories || []
      }
    });
  } catch (error) {
    console.error('Expertise GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch expertise data'
    }, { status: 500 });
  }
}

