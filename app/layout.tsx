import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { generateSEOMetadata } from "@/lib/seo-config";
import StructuredData from "@/components/StructuredData";

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

// Use the centralized SEO configuration
export const metadata = generateSEOMetadata();

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
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
