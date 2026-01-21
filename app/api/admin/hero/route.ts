import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

// GET /api/admin/hero - Get hero section data
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const db = await getDatabase();
    const collection = db.collection('hero');

    const heroData = await collection.findOne({});

    if (!heroData) {
      // Return default data if none exists
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
        error: 'Failed to fetch hero data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/hero - Update hero section data
export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const data = await request.json();

    const db = await getDatabase();
    const collection = db.collection('hero');

    const updateData = {
      title: data.title || "Isha Rani",
      subtitle: data.subtitle || "",
      description: data.description || "",
      ctaText: data.ctaText || "Explore My Journey",
      ctaLink: data.ctaLink || "/my_journey",
      ctaSecondaryText: data.ctaSecondaryText || "Download CV",
      ctaSecondaryLink: data.ctaSecondaryLink || "/contact",
      backgroundImage: data.backgroundImage || "",
      profileImage: data.profileImage || "",
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
      message: 'Hero section updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Update hero error:', error);
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
}

