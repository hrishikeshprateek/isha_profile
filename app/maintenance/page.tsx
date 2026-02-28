import { getDatabase } from '@/lib/mongodb';
import { Metadata } from 'next';
import { Mail, MessageCircle } from 'lucide-react'; // Using lucide-react icons

async function getMaintenanceMessage(): Promise<string> {
    try {
        const db = await getDatabase();
        const settings = await db.collection('settings').findOne({ key: 'maintenance_mode' });
        return settings?.message || "Our creative space is currently being polished. We'll be back shortly.";
    } catch {
        return "Our creative space is currently being polished.";
    }
}

export const metadata: Metadata = {
    title: 'Polishing the Space | Maintenance',
    description: 'Currently undergoing scheduled maintenance.',
};

export default async function MaintenancePage() {
    const message = await getMaintenanceMessage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F2A7A7] to-[#DC7C7C] flex items-center justify-center px-6 relative overflow-hidden">
            {/* VIBRANT AMBIENT GLOWS - Increased opacity for visibility */}
            <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] bg-[#DC7C7C]/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] bg-[#A68B7E]/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-xl text-center">

                {/* BRAND MARK - Higher contrast gold/pink tones */}
                <div className="flex justify-center mb-12">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border border-[#FAF0E6]/20 flex items-center justify-center relative shadow-[0_0_30px_rgba(242,167,167,0.1)]">
                            <div className="absolute inset-0 rounded-full bg-[#F2A7A7]/10 animate-pulse opacity-40" />
                            <div className="w-14 h-14 rounded-full border border-[#F2A7A7]/60 flex items-center justify-center bg-[#1A0F0A] z-10 shadow-inner">
                                <div className="w-2 h-2 rounded-full bg-[#F2A7A7] shadow-[0_0_10px_#F2A7A7]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* HEADLINE - Brightened Porcelain color */}
                <div className="space-y-4 mb-8">
           <span className="text-[11px] uppercase tracking-[0.5em] text-[#3B241A] font-extrabold drop-shadow-sm">
            Status: Refining
          </span>
                    <h1 className="text-5xl md:text-7xl font-serif italic text-[#3B241A] leading-tight drop-shadow-md">
                        Polishing the <br/>
                        <span className="not-italic font-bold tracking-tighter">Creative Space</span>
                    </h1>
                </div>

                {/* MESSAGE - Warm mocha tone */}
                <div className="max-w-md mx-auto mb-12">
                    <p className="text-[#3B241A]/90 text-xl leading-relaxed font-light italic">
                        &ldquo;{message}&rdquo;
                    </p>
                </div>

                {/* SOCIAL MEDIA CONNECT - Classy minimalist style */}
                <div className="flex items-center justify-center gap-8 mb-16">
                    {[
                        { icon: <MessageCircle size={20} />, href: "https://www.instagram.com", label: "Instagram" },
                        { icon: <MessageCircle size={20} />, href: "https://www.linkedin.com/in/isha-rani-85792927b/", label: "LinkedIn" },
                        { icon: <Mail size={20} />, href: "mailto:me@isharani.in", label: "Email" },
                    ].map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            className="text-[#3B241A]/80 hover:text-[#F2A7A7] transition-all duration-300 transform hover:scale-110"
                            aria-label={social.label}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                {/* PROGRESS INDICATOR - Refined bar */}
                <div className="flex flex-col items-center gap-5">
                    <div className="w-40 h-[1px] bg-[#FAF0E6]/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F2A7A7] to-transparent w-1/2 animate-shimmer" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#3B241A]/40 font-bold">
                            EST. 2026 • Patna, India
                        </p>
                        <p className="text-[9px] text-[#3B241A]/60 italic">
                            Thank you for your patience
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}