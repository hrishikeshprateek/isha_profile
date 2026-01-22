"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Heart, Coffee, ArrowRight, Play, Camera, Zap } from "lucide-react";
import Footer from "@/components/Footer";

interface Chapter {
    id: string;
    year: string;
    title: string;
    text: string;
    image: string;
    icon?: string;
}

interface JourneyData {
    title: string;
    subtitle: string;
    description: string;
    chapters: Chapter[];
}

// --- DEFAULT CHAPTER DATA (Fallback) ---
const DEFAULT_CHAPTERS: Chapter[] = [
    {
        id: "1",
        year: "The Beginning",
        title: "It started with a lens.",
        text: "I didn't start as a designer. I started as an observer. Picked up my first DSLR at 16 and realized that framing a shot is just like framing a user experience—it's all about what you choose to focus on.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800&h=1000",
        icon: "Camera",
    },
    {
        id: "2",
        year: "The Pivot",
        title: "From Pixel to Code.",
        text: "Photography taught me aesthetics, but I wanted interactivity. I dove into UI/UX and Frontend Dev. I realized that a beautiful image is art, but a beautiful interface is a solution.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=1000",
        icon: "Zap",
    },
    {
        id: "3",
        year: "The Now",
        title: "Building Digital Empires.",
        text: "Today, I merge strategy with storytelling. I don't just build websites; I build digital homes for brands. My goal is to make the web feel a little less like a machine and a little more human.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800&h=1000",
        icon: "Heart",
    }
];

export default function AboutPage() {
    const containerRef = useRef(null);
    const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Fetch journey data from API
    useEffect(() => {
        async function fetchJourneyData() {
            try {
                const response = await fetch('/api/my-journey');
                const data = await response.json();

                if (data.success && data.data) {
                    setJourneyData(data.data);
                } else {
                    // Fallback to defaults
                    setJourneyData({
                        title: 'My Journey',
                        subtitle: 'A story of growth, learning, and digital creation',
                        description: 'Discover how I evolved from a photographer to a digital creator',
                        chapters: DEFAULT_CHAPTERS,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch journey data:', error);
                // Fallback to defaults
                setJourneyData({
                    title: 'My Journey',
                    subtitle: 'A story of growth, learning, and digital creation',
                    description: 'Discover how I evolved from a photographer to a digital creator',
                    chapters: DEFAULT_CHAPTERS,
                });
            }
        }

        fetchJourneyData();
    }, []);

    const chapters = journeyData?.chapters || DEFAULT_CHAPTERS;

    return (
        <div ref={containerRef} className="bg-[#FAF0E6] min-h-screen relative overflow-hidden text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* 0. GLOBAL FILM GRAIN OVERLAY (Adds Texture) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* 1. HERO SECTION */}
            <section className="h-screen flex flex-col items-center justify-center relative px-6">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F2A7A7]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3B241A]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#3B241A]/10 bg-white/30 backdrop-blur-sm mb-6">
                        <Play size={12} className="text-[#F2A7A7] fill-current" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#3B241A]">The Story</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.9] mb-8 text-[#3B241A]">
                        Behind <br/> <span className="italic opacity-60">The Pixels</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#6E5045] max-w-lg mx-auto leading-relaxed">
                        {journeyData?.subtitle || 'Isha Rani. Designer. Creator. Storyteller. This is how I got here.'}
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] uppercase tracking-widest text-[#3B241A]/40">Scroll to read</span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-[#3B241A]/40 to-transparent"></div>
                </motion.div>
            </section>


            {/* 2. THE TIMELINE JOURNEY */}
            <section className="py-20 md:py-32 relative">
                <div className="container mx-auto px-6 max-w-6xl relative">

                    {/* --- THE TIMELINE TRACK (With Fade In/Out Mask) --- */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden md:block"
                         style={{
                             background: "linear-gradient(to bottom, transparent, rgba(59, 36, 26, 0.1) 10%, rgba(59, 36, 26, 0.1) 90%, transparent)"
                         }}
                    />

                    {/* Moving Progress Line (Pink) */}
                    <motion.div
                        style={{ scaleY: scrollYProgress }}
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#F2A7A7] to-[#F2A7A7] -translate-x-1/2 origin-top hidden md:block"
                    />

                    {/* CHAPTERS LOOP */}
                    <div className="space-y-32 md:space-y-48 pb-20">
                        {chapters.map((chapter, index) => (
                            <Chapter key={chapter.id} data={chapter} index={index} />
                        ))}
                    </div>

                    {/* END NODE (Closing the loop) */}
                    <div className="hidden md:flex absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full flex-col items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-[#F2A7A7]" />
                        <div className="h-12 w-[1px] bg-gradient-to-b from-[#F2A7A7] to-transparent" />
                    </div>

                </div>
            </section>


            {/* 3. PERSONALITY / "THE DNA" (Dark) */}
            <section className="py-24 bg-[#3B241A] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2A7A7]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F2A7A7]/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 !text-[#FAF0E6]">
                            My Creative <span className="!text-[#F2A7A7] italic">DNA</span>
                        </h2>
                        <p className="!text-[#FAF0E6]/80 text-lg leading-relaxed">
                            The core values that drive every project I touch.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Empathy First",
                                desc: "Design isn't about pixels; it's about people. I start every project by understanding the human on the other side of the screen.",
                                icon: Heart
                            },
                            {
                                title: "Story Driven",
                                desc: "Data informs, but stories connect. I weave narrative threads into brand identities to create lasting emotional impact.",
                                icon: Coffee
                            },
                            {
                                title: "Pixel Perfect",
                                desc: "God is in the details. From micro-interactions to typography kerning, I sweat the small stuff so you don't have to.",
                                icon: Star
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-[#FAF0E6]/5 border border-[#FAF0E6]/10 p-8 rounded-3xl hover:bg-[#FAF0E6]/10 transition-colors duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#FAF0E6]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="w-6 h-6 !text-[#F2A7A7]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-serif !text-[#FAF0E6]">{item.title}</h3>
                                <p className="!text-[#FAF0E6]/70 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. CTA SECTION (Refined Size) */}
            <section className="py-12 flex flex-col items-center justify-center text-center px-6 relative z-10">


                <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#3B241A] mb-6 leading-tight">
                    That&#39;s my story. <br/>
                    <span className="text-[#F2A7A7] italic">What&#39;s yours?</span>
                </h2>

                <p className="text-[#6E5045] mb-8 text-sm md:text-base max-w-sm mx-auto">
                    Ready to write the next chapter of your brand? Let&#39;s collaborate.
                </p>

                <Link
                    href="/build"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3B241A] text-[#FAF0E6] rounded-full text-sm font-bold hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                >
                    Start a Project
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Bottom Fade Out */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FAF0E6] to-transparent pointer-events-none -z-10" />
            </section>

            <Footer/>

        </div>
    );
}

// --- SUB-COMPONENT: INDIVIDUAL CHAPTER ---
function Chapter({ data, index }: { data: Chapter, index: number }) {
    const isEven = index % 2 === 0;
    const ref = useRef(null);

    // Icon mapping
    const iconMap: Record<string, React.ReactNode> = {
        Camera: <Camera size={24} className="text-[#3B241A]" />,
        Zap: <Zap size={24} className="text-[#3B241A]" />,
        Heart: <Heart size={24} className="text-[#3B241A]" />,
        Star: <Star size={24} className="text-[#3B241A]" />,
        Coffee: <Coffee size={24} className="text-[#3B241A]" />,
    };

    const getIcon = (iconName?: string) => {
        if (!iconName) return <Star size={24} className="text-[#3B241A]" />;
        return iconMap[iconName] || <Star size={24} className="text-[#3B241A]" />;
    };

    // Parallax Effect for Image
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Image moves slightly faster than text (Wind Up effect)
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity }}
            className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isEven ? "" : "md:flex-row-reverse"}`}
        >
            {/* TEXT SIDE */}
            <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"} text-center md:text-left`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F2A7A7] text-[#3B241A] mb-6 md:hidden`}>
                    {getIcon(data.icon)}
                </div>

                <span className="text-[#F2A7A7] font-bold text-sm tracking-widest uppercase mb-3 block">
                    {data.year}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#3B241A] mb-6 leading-[1.1]">
                    {data.title}
                </h2>
                <p className="text-[#6E5045] text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                    {data.text}
                </p>
            </div>

            {/* MIDDLE NODE (Desktop Only) */}
            <div className="relative z-10 hidden md:flex items-center justify-center">
                {/* Outer Glow Ring */}
                <div className="absolute w-20 h-20 bg-[#F2A7A7]/20 rounded-full blur-xl animate-pulse" />

                {/* The Node */}
                <div className="w-16 h-16 rounded-full bg-[#FAF0E6] border-4 border-[#3B241A] shadow-2xl flex items-center justify-center relative z-20">
                    {getIcon(data.icon) || <Star size={24} className="text-[#3B241A]" />}
                </div>
            </div>

            {/* IMAGE SIDE (With Parallax) */}
            <div className="flex-1 w-full">
                <motion.div
                    style={{ y }} // Applies the parallax movement
                    className={`relative aspect-[4/5] w-full max-w-md mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl ${isEven ? "rotate-3" : "-rotate-3"} border-4 border-white/50`}
                >
                    <Image
                        src={data.image}
                        alt={data.title}
                        fill
                        className="object-cover scale-110" // Slight scale for internal movement
                    />
                    {/* Glass Overlay for texture */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3B241A]/20 to-transparent mix-blend-overlay" />
                </motion.div>
            </div>

        </motion.div>
    );
}