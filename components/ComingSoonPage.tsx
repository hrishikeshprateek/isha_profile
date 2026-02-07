"use client";

import { ArrowUpRight, Camera, PenTool, Globe2, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PortfolioComingSoon = () => {
    return (
        <section className="relative min-h-screen w-full bg-[#FAF0E6] text-[#3B241A] overflow-hidden flex flex-col font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* --- Ambient Background Layer --- */}
            <div className="absolute inset-0 z-0">
                {/* Grain Texture for "Paper" feel */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20 mix-blend-multiply"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* Drifting Gradients */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-[#F2A7A7]/30 to-transparent rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-[#9999FF]/20 to-transparent rounded-full blur-[100px]"
                />
            </div>

            {/* --- Header / Nav --- */}
            <nav className="relative z-30 w-full p-6 md:p-10 flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col"
                >
                    <span className="font-serif font-bold text-2xl tracking-tighter text-[#3B241A]">Isha Rani<span className="text-[#F2A7A7]">.</span></span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#A68B7E] font-medium mt-1">Portfolio</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-[#3B241A]/5 shadow-sm"
                >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15C39A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#15C39A]"></span>
          </span>
                    <span className="text-xs font-bold text-[#3B241A]/80 uppercase tracking-wider">Work in Progress</span>
                </motion.div>
            </nav>

            {/* --- Main Content --- */}
            <main className="relative z-20 flex-grow flex flex-col justify-center items-center px-4 md:px-0">

                <div className="max-w-6xl w-full mx-auto text-center space-y-8">

                    {/* Main Typography */}
                    <div className="relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-6xl md:text-8xl lg:text-[9rem] font-serif font-medium leading-[0.9] tracking-tight text-[#3B241A]"
                        >
                            Curating <br />
                            <span className="italic font-light text-[#A68B7E] opacity-80">Visual</span> Stories
                        </motion.h1>

                        {/* Decorative Sparkle */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 180 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="absolute -top-8 right-[10%] md:right-[20%] text-[#F2A7A7]"
                        >
                            <Sparkles strokeWidth={1} size={64} />
                        </motion.div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="text-lg md:text-xl text-[#6E5045] max-w-xl mx-auto font-light leading-relaxed"
                    >
                        I’m weaving together a digital space to showcase my journey in content creation, writing, and travel. Stay close.
                    </motion.p>

                    {/* Glass Cards Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="flex flex-wrap justify-center gap-4 mt-12"
                    >
                        {[
                            { icon: Camera, label: "Photography", color: "hover:text-[#F2A7A7] hover:border-[#F2A7A7]" },
                            { icon: PenTool, label: "Writing", color: "hover:text-[#9999FF] hover:border-[#9999FF]" },
                            { icon: Globe2, label: "Travel", color: "hover:text-[#15C39A] hover:border-[#15C39A]" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`group flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-[#3B241A]/5 shadow-sm transition-all duration-300 cursor-default ${item.color}`}
                            >
                                <item.icon size={20} className="transition-colors duration-300" strokeWidth={1.5} />
                                <span className="text-sm font-medium uppercase tracking-wide">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>

                </div>
            </main>

            {/* --- Footer / Contact Dock --- */}
            <footer className="relative z-30 pb-10 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#3B241A] text-[#FAF0E6] p-2 pl-8 rounded-full shadow-2xl shadow-[#3B241A]/20">

                        <p className="text-sm font-medium tracking-wide opacity-90 hidden md:block">
                            Open for collaborations
                        </p>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <a
                                href="https://www.linkedin.com/in/isha-rani-85792927b"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#FAF0E6] text-[#3B241A] px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#F2A7A7] transition-colors duration-300"
                            >
                                LinkedIn <ArrowUpRight size={16} />
                            </a>

                            <a
                                href="mailto:me@isharani.in"
                                className="flex items-center justify-center p-3 bg-[#ffffff]/10 text-[#FAF0E6] rounded-full hover:bg-[#ffffff]/20 transition-colors duration-300 border border-[#FAF0E6]/10"
                                aria-label="Email Me"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-[10px] text-[#A68B7E] uppercase tracking-[0.3em]">
                            Coming Soon • 2024
                        </p>
                    </div>
                </motion.div>
            </footer>

        </section>
    );
};

export default PortfolioComingSoon;