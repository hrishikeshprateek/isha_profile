import { Metadata } from "next";

/**
 * Enhanced SEO Metadata Configuration
 * Includes structured data, rich snippets, and Google-friendly information
 */

export const generateSEOMetadata = (): Metadata => {
  const domain = "https://isharani.in";
  const title = "Isha Rani | Content Creator & Travel Photographer from Patna";
  const description =
    "Isha Rani is an award-winning content creator, travel photographer, and storyteller from Patna, India. Explore travel guides, photography tips, creative content, and life stories from around the world.";

  return {
    title: {
      default: title,
      template: "%s | Isha Rani",
    },
    description,
    keywords: [
      "Isha Rani",
      "Content Creator",
      "Travel Photographer",
      "Patna Creator",
      "Travel Blogger",
      "Photography Expert",
      "Creative Storytelling",
      "Travel Guide",
      "Content Creation",
      "Travel Photography",
      "Photography Tips",
      "Travel Tips",
      "Digital Creator",
      "Lifestyle Influencer",
      "Instagram Influencer",
      "Video Creator",
      "YouTube Creator",
    ],
    creator: "Isha Rani",
    authors: [
      {
        name: "Isha Rani",
        url: domain,
      },
    ],
    icons: {
      icon: "/isha_a.png",
      shortcut: "/isha_a.png",
      apple: "/isha_a.png",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: domain,
      siteName: "Isha Rani",
      title,
      description,
      images: [
        {
          url: `${domain}/isha_a.png`,
          width: 1200,
          height: 630,
          alt: "Isha Rani - Content Creator & Travel Photographer from Patna",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@IshaRani",
      images: [`${domain}/isha_a.png`],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
      other: {
        "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
      },
    },
    alternates: {
      canonical: domain,
      languages: {
        "en-US": `${domain}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
};

