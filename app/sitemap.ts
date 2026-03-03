import { getDatabase, Collections } from '@/lib/mongodb';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.isharani.in';

  try {
    const db = await getDatabase();

    // Fetch all published blogs
    const blogs = await db
      .collection(Collections.BLOGS)
      .find({ published: true })
      .project({ _id: 1, slug: 1, updatedAt: 1 })
      .toArray();

    // Fetch all published quotes
    const quotes = await db
      .collection(Collections.QUOTES)
      .find({ published: true })
      .project({ _id: 1, date: 1 })
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

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
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
        changeFrequency: 'monthly',
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
        changeFrequency: 'monthly',
        priority: 0.6,
        lastModified: new Date(),
      },
    ];

    // Dynamic blog routes
    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => {
      const id = toIdString(blog._id);
      const slug =
        typeof blog.slug === 'string'
          ? blog.slug
          : typeof blog.slug === 'object' && blog.slug !== null
            ? String(blog.slug)
            : id;

      return {
        url: `${baseUrl}/blogs/${id}-${encodeURIComponent(slug.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`,
        changeFrequency: 'monthly',
        priority: 0.8,
        lastModified: blog.updatedAt ? new Date(blog.updatedAt as string | Date) : new Date(),
      };
    });

    // Dynamic quote routes
    const quoteRoutes: MetadataRoute.Sitemap = quotes.map((quote) => {
      const id = toIdString(quote._id);
      const author =
        typeof (quote as unknown as Record<string, unknown>).author === 'string'
          ? (quote as unknown as Record<string, unknown>).author
          : 'Quote';

      return {
        url: `${baseUrl}/quotes/${id}-${encodeURIComponent(String(author).toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`,
        changeFrequency: 'monthly',
        priority: 0.7,
        lastModified: quote.date ? new Date(quote.date as string | Date) : new Date(),
      };
    });

    return [...staticRoutes, ...blogRoutes, ...quoteRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static routes
    return [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.isharani.in',
        changeFrequency: 'weekly',
        priority: 1.0,
        lastModified: new Date(),
      },
    ];
  }
}

