import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import ContactSection from "@/components/ContactSection";

export default function D1Page() {
  return (
    <main className="min-h-screen bg-[#FAF0E6]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ExpertiseSection />
      <ContactSection />

      {/* Footer */}
      <footer className="bg-[#3B241A] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold mb-4">Isha Rani</h3>
            <p className="text-white/70 mb-6">UI/UX Designer & Creative Professional</p>
            <div className="flex justify-center gap-6 mb-6">
              <a href="#" className="hover:text-[#F2A7A7] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#F2A7A7] transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-[#F2A7A7] transition-colors">Behance</a>
              <a href="#" className="hover:text-[#F2A7A7] transition-colors">Dribbble</a>
            </div>
            <p className="text-white/50 text-sm">
              © 2026 Isha Rani. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}



