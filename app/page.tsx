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
import { getDatabase } from '@/lib/mongodb';

// Local types for server-side shaping (named to avoid colliding with component-local types)
type PageHeroData = {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  backgroundImage?: string;
  profileImage?: string;
};

type RoleIcon = 'Video' | 'PenTool' | 'Monitor' | 'Camera';

type PageAboutData = {
  badge?: string;
  heading?: string;
  rolesIntro?: string;
  detailText?: string;
  tags?: string[];
  roles?: { label: string; icon: RoleIcon }[];
  profile?: { name?: string; title?: string; image?: string };
};

type PageServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: 'Type' | 'Palette' | 'Video' | 'Camera' | 'Layers';
  tags: string[];
};

// Server-side DB fetchers: use the database directly to avoid relying on internal HTTP calls
async function getHeroData(): Promise<PageHeroData | undefined> {
  try {
    const db = await getDatabase();
    const heroDataRes: unknown = await db.collection('hero').findOne({});
    if (heroDataRes == null) return undefined;
    const h = heroDataRes as Record<string, unknown>;
    return {
      title: typeof h.title === 'string' ? h.title : undefined,
      subtitle: typeof h.subtitle === 'string' ? h.subtitle : undefined,
      description: typeof h.description === 'string' ? h.description : undefined,
      ctaText: typeof h.ctaText === 'string' ? h.ctaText : undefined,
      ctaLink: typeof h.ctaLink === 'string' ? h.ctaLink : undefined,
      ctaSecondaryText: typeof h.ctaSecondaryText === 'string' ? h.ctaSecondaryText : undefined,
      ctaSecondaryLink: typeof h.ctaSecondaryLink === 'string' ? h.ctaSecondaryLink : undefined,
      backgroundImage: typeof h.backgroundImage === 'string' ? h.backgroundImage : undefined,
      profileImage: typeof h.profileImage === 'string' ? h.profileImage : undefined,
    };
  } catch (error) {
    console.error('getHeroData error:', error);
    return undefined;
  }
}

async function getAboutData(): Promise<Partial<PageAboutData> | undefined> {
  try {
    const db = await getDatabase();
    const docRes: unknown = await db.collection('about').findOne({});
    if (docRes == null) return undefined;
    const d = docRes as Record<string, unknown>;
    const roles = Array.isArray(d.roles) ? (d.roles as unknown[]) : undefined;
    return {
      badge: typeof d.badge === 'string' ? (d.badge as string) : undefined,
      heading: typeof d.heading === 'string' ? (d.heading as string) : undefined,
      rolesIntro: typeof d.rolesIntro === 'string' ? (d.rolesIntro as string) : undefined,
      detailText: typeof d.detailText === 'string' ? (d.detailText as string) : undefined,
      tags: Array.isArray(d.tags) ? (d.tags as string[]) : undefined,
      roles: roles
        ? roles.map((r) => {
            const rec = r as Record<string, unknown>;
            const iconVal = typeof rec.icon === 'string' ? rec.icon : 'Video';
            const icon: RoleIcon = ['Video', 'PenTool', 'Monitor', 'Camera'].includes(iconVal) ? (iconVal as RoleIcon) : 'Video';
            return { label: typeof rec.label === 'string' ? (rec.label as string) : '', icon };
          })
        : undefined,
      profile: (d.profile && typeof d.profile === 'object')
        ? { name: String((d.profile as Record<string, unknown>).name || ''), title: String((d.profile as Record<string, unknown>).title || ''), image: String((d.profile as Record<string, unknown>).image || '') }
        : undefined,
    } as Partial<PageAboutData>;
  } catch (error) {
    console.error('getAboutData error:', error);
    return undefined;
  }
}

async function getServicesData(): Promise<PageServiceItem[]> {
  try {
    const db = await getDatabase();
    const docsRes: unknown[] = await db.collection('services').find({}).toArray();
    const docs = Array.isArray(docsRes) ? docsRes : [];

    // small helper to safely stringify ids
    const toStringSafe = (v: unknown): string | undefined => {
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object' && typeof (v as { toString?: unknown }).toString === 'function') {
        try { return String((v as { toString: () => string }).toString()); } catch { return undefined; }
      }
      return undefined;
    };

    return docs.map((dRaw: unknown, idx: number) => {
      const d = dRaw as Record<string, unknown>;
      const iconCandidates = ['Type', 'Palette', 'Video', 'Camera', 'Layers'];
      const iconVal = typeof d.icon === 'string' ? d.icon : 'Type';
      const icon = (iconCandidates.includes(iconVal) ? iconVal : 'Type') as PageServiceItem['icon'];
      const tags = Array.isArray(d.tags) ? (d.tags as string[]) : (d.tags ? [String(d.tags)] : []);
      const rawId = d.id ?? d._id ?? undefined;
      const idStr = toStringSafe(rawId) ?? String(idx + 1);
      const title = typeof d.title === 'string' ? d.title : (typeof d.name === 'string' ? d.name : `Service ${idx + 1}`);
      const description = typeof d.description === 'string' ? d.description : (typeof d.summary === 'string' ? d.summary : '');
      return {
        id: idStr,
        title,
        description,
        icon,
        tags,
      } as PageServiceItem;
    });
  } catch (error) {
    console.error('getServicesData error:', error);
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
        {/* Cast to the component's expected shape at the JSX boundary. */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <AboutSection aboutData={aboutData as unknown as any} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ServicesSection servicesData={servicesData as unknown as any} />
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
