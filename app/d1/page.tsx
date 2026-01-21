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

async function getHeroData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/hero`, {
      cache: 'no-store', // Always fetch fresh data for SSR
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

export default async function D1Page() {
  const heroData = await getHeroData();

  return (
    <main className="min-h-screen bg-[#FAF0E6]">
      <Navbar />
      <HeroSection heroData={heroData} />
      <AboutSection />
      <ServicesSection />
      <ExpertiseSection />
        <QuotesPreviewSection/>
      <FeaturedBlogs />

        <Testimonials/>
      <ContactSection />
      <Footer />
    </main>
  );
}



