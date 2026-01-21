import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/hero - Public API for hero data (SSR)
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('hero');

    const heroData = await collection.findOne({});

    if (!heroData) {
      // Return default data
      return NextResponse.json({
        success: true,
        data: {
          title: "Isha Rani",
          subtitle: "Content Creator & Travel Vlogger",
          description: "Sharing stories, adventures, and creative insights from around the world.",
          ctaText: "Explore My Journey",
          ctaLink: "/my_journey",
          ctaSecondaryText: "Download CV",
          ctaSecondaryLink: "/contact",
          backgroundImage: "",
          profileImage: "",
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        title: heroData.title,
        subtitle: heroData.subtitle,
        description: heroData.description,
        ctaText: heroData.ctaText,
        ctaLink: heroData.ctaLink,
        ctaSecondaryText: heroData.ctaSecondaryText,
        ctaSecondaryLink: heroData.ctaSecondaryLink,
        backgroundImage: heroData.backgroundImage,
        profileImage: heroData.profileImage,
      }
    });
  } catch (error) {
    console.error('Get hero error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hero data',
        data: {
          title: "Isha Rani",
          subtitle: "Content Creator & Travel Vlogger",
          description: "Sharing stories, adventures, and creative insights from around the world.",
          ctaText: "Explore My Journey",
          ctaLink: "/my_journey",
          ctaSecondaryText: "Download CV",
          ctaSecondaryLink: "/contact",
          backgroundImage: "",
          profileImage: "",
        }
      },
      { status: 200 } // Still return 200 with fallback data
    );
  }
}

