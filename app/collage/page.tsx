import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollageBuilder from "@/components/CollageBuilder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collage Maker | ISHA RANI",
  description: "Create beautiful collages with our advanced collage maker. Multiple grid options and customization features.",
  keywords: ["Collage Maker", "Photo Collage", "Image Grid", "Collage Creator"],
  openGraph: {
    type: "website",
    url: "https://www.isharani.in/collage",
    title: "Collage Maker | ISHA RANI",
    description: "Create beautiful collages with advanced customization options",
  },
};

export default function CollagePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 pb-20">
        <CollageBuilder />
      </div>
      <Footer />
    </main>
  );
}

