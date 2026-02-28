import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import ContactSection from "@/components/ContactSection";
import FeaturedBlogs from "@/components/sections/FeaturedBlogs";
import Footer from "@/components/Footer";
import Testimonials from "@/components/sections/Testimonials";
import QuotesPreviewSection from "@/components/sections/QuotesPreviewSection";

// Get the base URL for API calls - works in both dev and production
function getBaseUrl(): string {
  // In production on Vercel, VERCEL_URL is automatically set
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback to NEXT_PUBLIC_APP_URL for development or custom deployments
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Final fallback
  return 'http://localhost:3000';
}

async function getHeroData() {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/hero`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch hero data:', error);
    return null;
  }
}

async function getAboutData() {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/about`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch about data:', error);
    return null;
  }
}

async function getServicesData() {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/services`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch services data:', error);
    return [];
  }
}

export default async function Home() {
  const [heroData, aboutData, servicesData] = await Promise.all([getHeroData(), getAboutData(), getServicesData()]);

  return (
    <div className="bg-[#FAF0E6]">
      <Navbar />
      <main>
        <HeroSection heroData={heroData} />
        <AboutSection aboutData={aboutData} />
        <ServicesSection servicesData={servicesData} />
        <ExpertiseSection />
        <FeaturedBlogs />
        <Testimonials />
        <QuotesPreviewSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
