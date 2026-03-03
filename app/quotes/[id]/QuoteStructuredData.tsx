// app/quotes/[id]/QuoteStructuredData.tsx
'use client';

interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  date?: string;
}

export function QuoteStructuredData({ quote }: { quote: Quote | null }) {
  if (!quote) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${quote.author} Quote`,
    description: quote.text,
    text: quote.text,
    author: {
      '@type': 'Person',
      name: quote.author,
    },
    creator: {
      '@type': 'Person',
      name: 'ISHA RANI',
      url: 'https://www.isharani.in',
    },
    datePublished: quote.date ? new Date(quote.date).toISOString() : undefined,
    inLanguage: 'en-US',
    keywords: [quote.category || 'Wisdom', 'Quote', 'ISHA RANI'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

