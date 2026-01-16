import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import ContactSection from "@/components/ContactSection";
import FeaturedBlogs from "@/components/sections/FeaturedBlogs";
import Footer from "@/components/Footer";

export default function D1Page() {
  return (
    <main className="min-h-screen bg-[#FAF0E6]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ExpertiseSection />
      <FeaturedBlogs />
      <ContactSection />
      <Footer />
    </main>
  );
}



