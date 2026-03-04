import { getDatabase, Collections } from '@/lib/mongodb';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://isharani.in';

  try {
    const db = await getDatabase();

    // Fetch all published blogs
    const blogs = await db
      .collection(Collections.BLOGS)
      .find({ published: true })
      .project({ _id: 1, slug: 1, updatedAt: 1 })
      .toArray();

    // Fetch all published quotes with author field
    const quotes = await db
      .collection(Collections.QUOTES)
      .find({ published: true })
      .project({ _id: 1, date: 1, author: 1 })
      .toArray();

    // Helper to convert MongoDB ObjectId to string
    const toIdString = (id: unknown): string => {
      if (typeof id === 'string') return id;
      if (id && typeof id === 'object') {
        const obj = id as { toString?: () => string };
        if (typeof obj.toString === 'function') return obj.toString();
      }
      return String(id);
    };

    // Helper to sanitize URL to prevent XML parsing errors
    const sanitizeUrl = (url: string): string => {
      try {
        return decodeURI(url);
      } catch {
        return url;
      }
    };

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}`,
        changeFrequency: 'weekly',
        priority: 1.0,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/blogs`,
        changeFrequency: 'daily',
        priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/quotes`,
        changeFrequency: 'daily',
        priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/my_journey`,
        changeFrequency: 'weekly',
        priority: 0.8,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/build`,
        changeFrequency: 'weekly',
        priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/wall`,
        changeFrequency: 'weekly',
        priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/vcard`,
        changeFrequency: 'weekly',
        priority: 0.6,
        lastModified: new Date(),
      },
    ];

    // Dynamic blog routes
    const blogRoutes: MetadataRoute.Sitemap = blogs
      .map((blog) => {
        try {
          const id = toIdString(blog._id);
          const slug =
            typeof blog.slug === 'string'
              ? blog.slug
              : typeof blog.slug === 'object' && blog.slug !== null
              ? String(blog.slug)
              : id;

          // Create safe URL
          const safeSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const urlPath = `${baseUrl}/blogs/${id}-${safeSlug}`;

          return {
            url: sanitizeUrl(urlPath),
            changeFrequency: 'daily' as const,
            priority: 0.8,
            lastModified: blog.updatedAt ? new Date(blog.updatedAt as string | Date) : new Date(),
          };
        } catch (err) {
          console.warn('Error processing blog for sitemap:', err);
          return null;
        }
      })
      .filter((item) => item !== null) as MetadataRoute.Sitemap;

    // Dynamic quote routes
    const quoteRoutes: MetadataRoute.Sitemap = quotes
      .map((quote) => {
        try {
          const id = toIdString(quote._id);
          const author = typeof quote.author === 'string' ? quote.author : 'quote';

          // Create safe URL
          const safeAuthor = author.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const urlPath = `${baseUrl}/quotes/${id}-${safeAuthor}`;

          return {
            url: sanitizeUrl(urlPath),
            changeFrequency: 'daily' as const,
            priority: 0.7,
            lastModified: quote.date ? new Date(quote.date as string | Date) : new Date(),
          };
        } catch (err) {
          console.warn('Error processing quote for sitemap:', err);
          return null;
        }
      })
      .filter((item) => item !== null) as MetadataRoute.Sitemap;

    return [...staticRoutes, ...blogRoutes, ...quoteRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static routes
    return [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://isharani.in',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://isharani.in'}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://isharani.in'}/quotes`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}

