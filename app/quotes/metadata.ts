import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inspirational Quotes | ISHA RANI',
  description:
    'Explore a collection of inspirational and thought-provoking quotes on life, travel, creativity, and wisdom. Curated by ISHA RANI.',
  keywords: [
    'Quotes',
    'Inspirational Quotes',
    'Wisdom',
    'Motivational Quotes',
    'Travel Quotes',
    'Creative Quotes',
    'Life Quotes',
    'ISHA RANI',
  ],
  openGraph: {
    type: 'website',
    url: 'https://www.isharani.in/quotes',
    title: 'Inspirational Quotes | ISHA RANI',
    description:
      'Explore a collection of inspirational and thought-provoking quotes on life, travel, creativity, and wisdom.',
    images: [
      {
        url: 'https://www.isharani.in/isha_a.png',
        width: 1200,
        height: 630,
        alt: 'ISHA RANI Quotes Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inspirational Quotes | ISHA RANI',
    description:
      'Explore a collection of inspirational and thought-provoking quotes on life, travel, creativity, and wisdom.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

