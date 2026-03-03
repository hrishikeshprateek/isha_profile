// app/blogs/[id]/metadata.ts
// Enhanced metadata for individual blog posts
// Note: This is a simplified version that doesn't fetch from DB during build
// The client-side page will handle the actual blog rendering

import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const blogId = (resolvedParams.id || '').split('-')[0];
  const slug = (resolvedParams.id || '').split('-').slice(1).join('-');

  // Generate SEO-friendly metadata without DB call during build
  const url = `https://www.isharani.in/blogs/${blogId}`;
  const title = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Blog Post';

  return {
    title: `${title} | ISHA RANI Blog`,
    description: `Read this insightful article about ${title} by ISHA RANI. Explore travel stories, photography tips, and creative insights.`,
    keywords: [
      title,
      'Isha Rani',
      'Blog',
      'Article',
      'Travel',
      'Photography',
      'Content Creation',
    ],
    authors: [{ name: 'ISHA RANI' }],
    creator: 'ISHA RANI',
    openGraph: {
      type: 'article',
      url,
      title: `${title} | ISHA RANI`,
      description: `Read this insightful article about ${title} by ISHA RANI.`,
      images: [
        {
          url: 'https://www.isharani.in/isha_a.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      authors: ['ISHA RANI'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ISHA RANI`,
      description: `Read this insightful article about ${title} by ISHA RANI.`,
      images: ['https://www.isharani.in/isha_a.png'],
      creator: '@IshaRani',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

