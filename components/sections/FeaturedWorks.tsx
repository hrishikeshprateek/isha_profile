'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// Interface
interface PortfolioItem {
    id: string;
    type: "video" | "image";
    category: string;
    src: string;
    thumb: string;
    title: string;
    client: string;
    desc: string;
}

const FeaturedWorks = () => {
    const [works, setWorks] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState<number>(2);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const response = await fetch('/api/wall-items');
                const data = await response.json();

                if (data.success && Array.isArray(data.items) && data.items.length > 0) {
                    // Taking first 5 items to populate the carousel beautifully
                    const formattedWorks = data.items.slice(0, 5).map((item: Record<string, unknown>, index: number) => ({
                        id: String(item.id || index),
                        type: item.type === 'video' ? 'video' : 'image',
                        category: String(item.category || 'Work'),
                        src: String(item.src || ''),
                        thumb: String(item.thumb || item.src || ''),
                        title: String(item.title || 'Untitled'),
                        client: String(item.client || 'Client'),
                        desc: String(item.desc || ''),
                    }));

                    setWorks(formattedWorks);
                    // Start exactly in the middle based on fetched data
                    setCenter(Math.floor(formattedWorks.length / 2));
                }
            } catch (error) {
                console.error('Failed to fetch works:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorks();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || works.length === 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, mouseX / rect.width));

        // Calculate target index based on mouse position
        const targetIndex = Math.floor(progress * works.length);
        const safeIndex = Math.min(targetIndex, works.length - 1); // Prevent out-of-bounds

        if (safeIndex !== center) {
            setCenter(safeIndex);
        }
    };

    if (loading || works.length === 0) {
        return null; // Can replace with a subtle loading skeleton if needed
    }

    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center bg-[#F2E4D8] text-[#3B241A] overflow-hidden py-12 md:py-12 font-sans">

            {/* Subtle Background Glows matching your theme */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F2A7A7]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#DC7C7C]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 h-full flex flex-col relative z-10">

                {/* Section Header (Updated to match other sections) */}
                <div className="mb-12 pointer-events-none flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 mb-3 opacity-70">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#DC7C7C] font-serif">
                                Featured Archive
                            </span>
                            <div className="w-8 h-px bg-[#DC7C7C]/40" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-[#3B241A] leading-tight mb-4">
                            Explore <span className="text-[#DC7C7C] italic font-light">Collection</span>
                        </h3>
                        <p className="text-[#A68B7E] text-base leading-relaxed max-w-xl">
                            A curated selection of projects, creative collaborations, and visual stories that define my craft.
                        </p>
                    </div>

                    <Link
                        href="/wall"
                        className="hidden md:inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/60 backdrop-blur-sm border border-[#DC7C7C]/20 text-[#3B241A] font-semibold rounded-full hover:bg-white hover:border-[#DC7C7C]/40 transition-all duration-300 shadow-sm hover:shadow-md pointer-events-auto whitespace-nowrap"
                    >
                        View Full Archive
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Interaction Zone - Carousel */}
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    className="relative flex items-center justify-center h-[500px] md:h-[600px] w-full z-10 cursor-ew-resize"
                >
                    {works.map((item, i) => {
                        const offset = i - center;
                        const isActive = offset === 0;

                        // Physics
                        const scale = 1 - Math.abs(offset) * 0.1;
                        const opacity = 1 - Math.abs(offset) * 0.2;
                        const xOffset = offset * 55;
                        const zIndex = 50 - Math.abs(offset);

                        return (
                            <motion.div
                                key={item.id}
                                className="absolute"
                                animate={{
                                    x: `${xOffset}%`,
                                    scale: scale,
                                    opacity: Math.max(opacity, 0),
                                    zIndex: zIndex,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                    mass: 0.8
                                }}
                            >
                                <div
                                    className={`
                                        relative 
                                        w-[300px] h-[450px] md:w-[400px] md:h-[600px] 
                                        bg-[#3B241A] overflow-hidden rounded-[2rem]
                                        transition-all duration-500 ease-out
                                        ${isActive ? 'shadow-[0_40px_80px_-20px_rgba(59,36,26,0.4)]' : 'shadow-xl grayscale-[80%]'}
                                    `}
                                >
                                    {/* Image */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                                        style={{
                                            backgroundImage: `url(${item.thumb})`,
                                            transform: isActive ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                    />

                                    {/* Gradient Overlay for Text Visibility */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-[#3B241A]/95 via-[#3B241A]/30 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`} />

                                    {/* Type Icon (Video/Image) */}
                                    <motion.div
                                        animate={{ opacity: isActive ? 1 : 0 }}
                                        className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/20"
                                    >
                                        {item.type === 'video' ? <Play size={20} fill="currentColor" /> : <ImageIcon size={20} />}
                                    </motion.div>

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                y: isActive ? 0 : 20,
                                                opacity: isActive ? 1 : 0
                                            }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <span className="inline-block py-1.5 px-3 border border-[#FAF0E6]/30 rounded-full text-[10px] font-bold tracking-widest uppercase text-[#FAF0E6]/90 mb-4 bg-black/20 backdrop-blur-sm">
                                                {item.category || item.client}
                                            </span>

                                            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#FAF0E6] leading-tight mb-2 line-clamp-2">
                                                {item.title}
                                            </h3>

                                            {item.desc && (
                                                <p className="text-[#FAF0E6]/70 text-sm line-clamp-2 mb-4 mt-2">
                                                    {item.desc}
                                                </p>
                                            )}

                                            <Link
                                                href="/wall"
                                                className="group inline-flex items-center text-xs font-bold tracking-widest text-[#F2A7A7] mt-4 uppercase"
                                            >
                                                View Project
                                                <span className="ml-3 bg-[#F2A7A7] text-[#3B241A] rounded-full p-1.5 transition-transform group-hover:translate-x-2">
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </span>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile Link Button */}
                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/wall"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/60 backdrop-blur-sm border border-[#DC7C7C]/20 text-[#3B241A] font-semibold hover:bg-white hover:border-[#DC7C7C]/40 transition-all duration-300 shadow-sm w-full pointer-events-auto"
                    >
                        View Full Archive
                        <ArrowRight size={18} />
                    </Link>
                </div>


            </div>
        </section>
    );
};

export default FeaturedWorks;