// app/api/instagram/route.ts
import { NextResponse } from 'next/server';

interface InstagramMedia {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
}

interface InstagramResponse {
  data: InstagramMedia[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
  };
}

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('INSTAGRAM_ACCESS_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Instagram token not configured' },
        { status: 500 }
      );
    }

    // Fetch latest 8 Instagram posts
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&limit=8&access_token=${accessToken}`,
      {
        method: 'GET',
        // Cache for 1 hour in production
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error('Instagram API Error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch Instagram data' },
        { status: response.status }
      );
    }

    const data: InstagramResponse = await response.json();

    // Transform the data: for videos, use thumbnail_url as the display image
    const transformedMedia = data.data.map((media) => ({
      id: media.id,
      caption: media.caption || '',
      media_type: media.media_type,
      // For videos, use thumbnail; for images, use media_url
      image_url:
        media.media_type === 'VIDEO'
          ? media.thumbnail_url || media.media_url || ''
          : media.media_url || '',
      permalink: media.permalink,
    }));

    return NextResponse.json({
      success: true,
      data: transformedMedia,
      count: transformedMedia.length,
    });
  } catch (error) {
    console.error('Instagram API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

