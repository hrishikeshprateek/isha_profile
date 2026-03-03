import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Comprehensive SEO metadata for the entire website
export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "ISHA RANI | Content Creator, Travel & Photography Expert",
    template: "%s | ISHA RANI",
  },
  description:
    "Isha Rani — Award-winning Content Creator, Travel Photographer & Storyteller. Explore travel guides, photography tips, creative insights and life stories from around the world.",

  // Keywords for indexing
  keywords: [
    "Isha Rani",
    "Content Creator",
    "Travel Blogger",
    "Photography",
    "Travel Guide",
    "Creative Storytelling",
    "Travel Photography",
    "Content Creation",
    "Travel Tips",
    "Photography Tips",
    "Lifestyle Blog",
  ],

  // Author metadata
  creator: "ISHA RANI",
  authors: [
    {
      name: "ISHA RANI",
      url: "https://www.isharani.in",
    },
  ],

  // Favicon and icons
  icons: {
    icon: "/isha_a.png",
    shortcut: "/isha_a.png",
    apple: "/isha_a.png",
    other: [
      {
        rel: "icon",
        url: "/isha_a.png",
      },
    ],
  },

  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.isharani.in",
    siteName: "ISHA RANI",
    title: "ISHA RANI | Content Creator, Travel & Photography Expert",
    description:
      "Award-winning Content Creator, Travel Photographer & Storyteller. Explore travel guides, photography tips, and creative insights.",
    images: [
      {
        url: "https://www.isharani.in/isha_a.png",
        width: 1200,
        height: 630,
        alt: "ISHA RANI - Content Creator & Travel Photographer",
        type: "image/png",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "ISHA RANI | Content Creator, Travel & Photography Expert",
    description:
      "Award-winning Content Creator, Travel Photographer & Storyteller. Explore travel guides and photography tips.",
    creator: "@IshaRani",
    images: ["https://www.isharani.in/isha_a.png"],
  },

  // Verification and SEO
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Alternate language versions (for international SEO)
  alternates: {
    canonical: "https://www.isharani.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* JSON-LD Structured Data for Person/Author */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "ISHA RANI",
              url: "https://www.isharani.in",
              image: "https://www.isharani.in/isha_a.png",
              description:
                "Award-winning Content Creator, Travel Photographer & Storyteller",
              sameAs: [
                "https://twitter.com/IshaRani",
                "https://instagram.com/isharani",
                "https://linkedin.com/in/isharani",
              ],
              jobTitle: ["Content Creator", "Travel Photographer", "Storyteller"],
              knownFor: ["Content Creation", "Travel Photography", "Creative Writing"],
            }),
          }}
        />

        {/* JSON-LD Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Website",
              name: "ISHA RANI",
              url: "https://www.isharani.in",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.isharani.in/blogs?search={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            }),
          }}
        />

        {/* JSON-LD Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ISHA RANI",
              url: "https://www.isharani.in",
              logo: "https://www.isharani.in/isha_a.png",
              description: "Content Creator, Travel Photographer & Storyteller",
              sameAs: [
                "https://twitter.com/IshaRani",
                "https://instagram.com/isharani",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
