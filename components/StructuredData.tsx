'use client';

import { useEffect } from 'react';

/**
 * Schema.org Structured Data for Google Rich Snippets
 * Helps Google understand who Isha Rani is and what she does
 */

export default function StructuredData() {
  useEffect(() => {
    // Person Schema - Who is Isha Rani
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Isha Rani",
      url: "https://isharani.in",
      image: "https://isharani.in/isha_a.png",
      description: "Award-winning content creator and travel photographer from Patna, India",
      birthPlace: {
        "@type": "Place",
        name: "Patna, India",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Patna",
          addressRegion: "Bihar",
          addressCountry: "IN"
        }
      },
      jobTitle: [
        "Content Creator",
        "Travel Photographer",
        "Digital Creator",
        "Video Creator"
      ],
      knowsAbout: [
        "Travel Photography",
        "Content Creation",
        "Digital Marketing",
        "Creative Storytelling",
        "Video Production",
        "Photography",
        "Travel Blogging"
      ],
      sameAs: [
        "https://www.instagram.com/moreofisha._",
        "https://www.youtube.com/channel/IshaRani",
        "https://www.linkedin.com/in/isharani",
        "https://twitter.com/IshaRani"
      ],
      email: "me@isharani.in",
      telephone: "+91-9876543210"
    };

    // Organization Schema - Portfolio Website
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Isha Rani",
      url: "https://isharani.in",
      logo: "https://isharani.in/isha_a.png",
      description: "Digital portfolio and creative hub of Isha Rani, content creator and travel photographer",
      foundingDate: "2019",
      founders: [{
        "@type": "Person",
        name: "Isha Rani"
      }],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Patna",
        addressRegion: "Bihar",
        addressCountry: "IN",
        postalCode: "800001"
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        email: "me@isharani.in"
      },
      sameAs: [
        "https://www.instagram.com/moreofisha._",
        "https://www.youtube.com/channel/IshaRani"
      ]
    };

    // Creative Work Schema - Portfolio
    const creativeWorkSchema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Isha Rani's Portfolio",
      creator: {
        "@type": "Person",
        name: "Isha Rani"
      },
      description: "Digital portfolio featuring travel photography, content creation, and creative work",
      url: "https://isharani.in",
      image: "https://isharani.in/isha_a.png"
    };

    // LocalBusiness Schema - For local SEO
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Isha Rani - Content Creator",
      image: "https://isharani.in/isha_a.png",
      description: "Award-winning content creator and travel photographer based in Patna",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Patna",
        addressLocality: "Patna",
        addressRegion: "Bihar",
        postalCode: "800001",
        addressCountry: "IN"
      },
      url: "https://isharani.in",
      telephone: "+91-9876543210",
      email: "me@isharani.in",
      priceRange: "Inquire",
      areaServed: [
        {
          "@type": "City",
          name: "Patna"
        },
        {
          "@type": "Country",
          name: "India"
        },
        {
          "@type": "Country",
          name: "Worldwide"
        }
      ],
      sameAs: [
        "https://www.instagram.com/moreofisha._",
        "https://www.youtube.com/channel/IshaRani"
      ]
    };

    // FAQPage Schema - For FAQ snippets
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Isha Rani?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Isha Rani is an award-winning content creator, travel photographer, and digital storyteller from Patna, India. She creates engaging content about travel, photography, creative design, and lifestyle."
          }
        },
        {
          "@type": "Question",
          name: "Where is Isha Rani from?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Isha Rani is from Patna, Bihar, India. She is a local content creator who has gained recognition for her creative work in photography and content creation."
          }
        },
        {
          "@type": "Question",
          name: "What does Isha Rani do?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Isha Rani is a content creator specializing in travel photography, creative storytelling, video production, and digital marketing. She shares her work across multiple platforms including Instagram, YouTube, and her blog."
          }
        },
        {
          "@type": "Question",
          name: "How can I contact Isha Rani?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can contact Isha Rani through her portfolio website at isharani.in, via email at me@isharani.in, or through her Instagram profile @moreofisha._"
          }
        },
        {
          "@type": "Question",
          name: "What are Isha Rani's services?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Isha Rani offers services including content creation, travel photography, video production, creative consultation, social media management, and digital storytelling."
          }
        },
        {
          "@type": "Question",
          name: "Where can I follow Isha Rani?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can follow Isha Rani on Instagram (@moreofisha._), YouTube, LinkedIn, and Twitter. Visit her website isharani.in for all social media links and portfolio."
          }
        }
      ]
    };

    // Add scripts to head
    const scripts = [personSchema, organizationSchema, creativeWorkSchema, localBusinessSchema, faqSchema];

    scripts.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
        if (script.innerHTML.includes('Isha Rani') || script.innerHTML.includes('isharani.in')) {
          script.remove();
        }
      });
    };
  }, []);

  return null;
}

