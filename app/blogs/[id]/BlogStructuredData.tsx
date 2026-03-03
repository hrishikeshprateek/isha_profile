// app/blogs/[id]/BlogStructuredData.tsx
'use client';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  content: string;
  tags: string[];
}

export function BlogStructuredData({ post }: { post: BlogPost | null }) {
  if (!post) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://www.isharani.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ISHA RANI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.isharani.in/isha_a.png',
      },
    },
    keywords: [post.category, ...post.tags, 'ISHA RANI'],
    articleSection: post.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

