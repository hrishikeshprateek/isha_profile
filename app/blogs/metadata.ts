import { getDatabase, Collections } from '@/lib/mongodb';
import { MetadataRoute } from 'next';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog & Articles | ISHA RANI",
  description:
    "Explore insightful articles on travel, photography, content creation, and lifestyle. Tips, guides, and stories from ISHA RANI.",
  keywords: [
    "Blog",
    "Articles",
    "Travel Blog",
    "Photography Tips",
    "Content Creation",
    "Travel Guide",
    "Isha Rani",
  ],
  openGraph: {
    type: "website",
    url: "https://www.isharani.in/blogs",
    title: "Blog & Articles | ISHA RANI",
    description:
      "Explore insightful articles on travel, photography, content creation, and lifestyle.",
    images: [
      {
        url: "https://www.isharani.in/isha_a.png",
        width: 1200,
        height: 630,
        alt: "ISHA RANI Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Articles | ISHA RANI",
    description:
      "Explore insightful articles on travel, photography, content creation, and lifestyle.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateStaticParams() {
  // Pre-render blog list pages if needed
  return [];
}

