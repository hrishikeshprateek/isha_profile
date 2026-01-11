import { ArrowUpRight } from "lucide-react";

const PortfolioComingSoon = () => {
    return (
        <section className="relative min-h-screen w-full bg-[#0a0a0a] text-[#ffffff] overflow-hidden flex flex-col justify-between p-6 md:p-12">

            {/* 1. Texture Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                }}
            />

            {/* 2. Top Navigation / Status */}
            <div className="relative z-10 flex justify-between items-start">
                <div className="flex flex-col">
                    <h3 className="font-bold text-lg tracking-tight text-[#ffffff]">Isha Rani</h3>
                    <p className="text-[#ffffff]/40 text-sm">Portfolio 2026</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
                    </span>
                    <span className="text-xs font-mono text-[#ffffff]/60 uppercase tracking-widest">
                        Under Construction
                    </span>
                </div>
            </div>

            {/* 3. Main Center Content */}
            <div className="relative z-10 max-w-4xl mt-auto mb-auto">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.1] mb-8 text-[#ffffff]">
                    <span className="block text-[#ffffff]/30">New work is</span>
                    <span className="block">coming soon.</span>
                </h1>

                <p className="text-lg md:text-xl text-[#ffffff]/60 max-w-lg leading-relaxed font-light">
                    I am currently updating my portfolio to showcase my latest projects.
                    The site is down for a brief refresh.
                </p>
            </div>

            {/* 4. Bottom / Contact Area */}
            <div className="relative z-10 border-t border-[#ffffff]/10 pt-8 mt-12 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                    <div className="text-sm text-[#ffffff]/40 max-w-xs">
                        In the meantime, you can review my professional history or get in touch via LinkedIn.
                    </div>

                    <a
                        href="https://www.linkedin.com/in/isha-rani-85792927b"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-[#ffffff] text-[#000000] px-6 py-4 rounded-lg font-medium hover:bg-[#ffffff]/90 transition-all active:scale-95"
                    >
                        Connect on LinkedIn
                        <ArrowUpRight className="w-5 h-5 text-[#000000] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>

                </div>
            </div>

            {/* Subtle Background Gradient for Depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ffffff]/[0.03] rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

export default PortfolioComingSoon;