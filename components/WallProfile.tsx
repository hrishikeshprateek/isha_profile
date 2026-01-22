"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Layers
} from "lucide-react";

// --- INTERFACE ---
interface PortfolioItem {
    id: number;
    type: "video" | "image";
    category: string;
    src: string;
    thumb: string;
    title: string;
    client: string;
    desc: string;
}

// --- DEFAULT MOCK DATA (Fallback) ---
const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = [
    {
        id: 1,
        type: "video",
        category: "Reels",
        src: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
        thumb: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
        title: "Neon Campaigns",
        client: "Urban Outfitters",
        desc: "A high-energy reel designed to stop the scroll. Increased CTR by 45%."
    },
    {
        id: 2,
        type: "image",
        category: "Photography",
        src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800",
        thumb: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800",
        title: "Summer Editorial",
        client: "Vogue India",
        desc: "Capturing the essence of Indian summer through a vintage lens."
    },
    {
        id: 3,
        type: "image",
        category: "Branding",
        src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
        thumb: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
        title: "Minimalist Packaging",
        client: "Pure Skin",
        desc: "Rebranding a skincare line to appeal to Gen Z."
    },
    {
        id: 4,
        type: "video",
        category: "Reels",
        src: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-1233-large.mp4",
        thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
        title: "Fashion Week BTS",
        client: "Lakme",
        desc: "Behind the scenes coverage that felt intimate and raw."
    },
    {
        id: 5,
        type: "image",
        category: "Photography",
        src: "https://images.unsplash.com/photo-1529139574466-a302d27f6054?auto=format&fit=crop&q=80&w=800",
        thumb: "https://images.unsplash.com/photo-1529139574466-a302d27f6054?auto=format&fit=crop&q=80&w=800",
        title: "Urban Portraits",
        client: "Personal Project",
        desc: "Exploring light and shadow in Mumbai streets."
    },
    {
        id: 6,
        type: "image",
        category: "Branding",
        src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
        thumb: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
        title: "Tech Startup UI",
        client: "Nexus",
        desc: "Clean, accessible UI design for a fintech app."
    }
];

export default function WorkPage() {
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO_ITEMS);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Fetch portfolio items from database
    useEffect(() => {
        async function fetchPortfolioItems() {
            try {
                const response = await fetch('/api/wall-items');
                const data = await response.json();

                if (data.success && Array.isArray(data.items) && data.items.length > 0) {
                    setPortfolioItems(data.items);
                }
            } catch (error) {
                console.error('Failed to fetch portfolio items:', error);
                // Use default items as fallback
            } finally {
                setLoading(false);
            }
        }

        fetchPortfolioItems();
    }, []);

    // Get unique categories from items
    const categories = ["All", ...Array.from(new Set(portfolioItems.map(item => item.category)))];

    // Filter Logic
    const filteredItems = activeFilter === "All"
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeFilter);

    // Find active item index for the "Story Viewer"
    const selectedIndex = filteredItems.findIndex(item => item.id === selectedId);
    const activeItem = filteredItems[selectedIndex];

    // Navigation Handlers
    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex < filteredItems.length - 1) {
            setSelectedId(filteredItems[selectedIndex + 1].id);
        } else {
            setSelectedId(null); // Close on finish
        }
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex > 0) {
            setSelectedId(filteredItems[selectedIndex - 1].id);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* 1. HEADER & FILTERS */}
            <div className="pt-32 pb-12 px-6 container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">
                            Selected <span className="text-[#F2A7A7] italic">Works</span>
                        </h1>
                        <p className="text-[#6E5045] max-w-md">
                            A collection of visual stories, digital experiences, and brand identities crafted with purpose.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border
                        ${activeFilter === f
                                    ? "bg-[#3B241A] text-[#FAF0E6] border-[#3B241A]"
                                    : "bg-white/50 border-[#3B241A]/10 text-[#3B241A] hover:bg-white hover:border-[#F2A7A7]"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. THE MASONRY GRID (The Feed) */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={item.id}
                                onClick={() => setSelectedId(item.id)}
                                className="break-inside-avoid relative group rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                {/* Image/Thumb */}
                                <div className="relative aspect-[4/5] w-full">
                                    <Image
                                        src={item.type === 'video' ? item.thumb : item.src}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Video Indicator */}
                                    {item.type === 'video' && (
                                        <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                                            <Play size={14} fill="currentColor" />
                                        </div>
                                    )}

                                    {/* Hover Overlay (Desktop) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#3B241A]/90 via-[#3B241A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <span className="text-[#F2A7A7] text-xs font-bold uppercase tracking-widest mb-2">{item.category}</span>
                                        <h3 className="text-[#FAF0E6] text-2xl font-serif font-bold leading-none mb-1">{item.title}</h3>
                                        <div className="flex items-center gap-2 text-[#FAF0E6]/60 text-xs mt-3">
                                            <span>View Story</span>
                                            <Maximize2 size={12} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* 3. THE "STORY VIEWER" (WhatsApp/Instagram Style Overlay) */}
            <AnimatePresence>
                {selectedId && activeItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#1A0F08]/95 backdrop-blur-xl flex items-center justify-center"
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setSelectedId(null)}
                            className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* MAIN CONTENT CONTAINER */}
                        <div className="relative w-full max-w-md md:max-w-4xl h-full md:h-[85vh] flex flex-col md:flex-row bg-[#23150F] md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">

                            {/* A. MEDIA SIDE (The "Story") */}
                            <div className="relative w-full md:w-1/2 h-full bg-black flex items-center justify-center">

                                {/* Progress Bars (Like WhatsApp/Insta) */}
                                <div className="absolute top-4 left-4 right-4 z-20 flex gap-1 h-1">
                                    {filteredItems.map((item) => (
                                        <div key={item.id} className="h-full flex-1 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-[#F2A7A7] transition-all duration-300 ${
                                                    item.id === activeItem.id ? "w-full" :
                                                        filteredItems.indexOf(item) < selectedIndex ? "w-full" : "w-0"
                                                }`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* The Media */}
                                {activeItem.type === 'video' ? (
                                    <video
                                        src={activeItem.src}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={activeItem.src}
                                            alt={activeItem.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {/* Tap Navigation Zones (Invisible) */}
                                <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrev} />
                                <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNext} />

                                {/* Mobile Overlay Text */}
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent md:hidden">
                                    <h2 className="text-white font-serif font-bold text-2xl">{activeItem.title}</h2>
                                    <p className="text-white/70 text-sm mt-1">{activeItem.client}</p>
                                </div>
                            </div>

                            {/* B. DETAILS SIDE (Desktop Context - The "Content Rich" Part) */}
                            <div className="hidden md:flex w-1/2 p-10 flex-col justify-between bg-[#23150F]">
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-[#F2A7A7] flex items-center justify-center text-[#3B241A]">
                                            {activeItem.type === 'video' ? <Play size={14} fill="currentColor"/> : <Layers size={14}/>}
                                        </div>
                                        <span className="text-[#F2A7A7] font-bold uppercase tracking-widest text-xs">
                                    {activeItem.category}
                                </span>
                                    </div>

                                    <h2 className="text-4xl font-serif font-bold !text-[#FAF0E6] mb-2 leading-tight">
                                        {activeItem.title}
                                    </h2>
                                    <p className="text-[#FAF0E6]/50 text-sm mb-8 font-mono">
                                        Client: {activeItem.client}
                                    </p>

                                    <div className="w-full h-[1px] bg-white/10 mb-8" />

                                    <h3 className="!text-[#FAF0E6] font-bold text-sm uppercase tracking-wider mb-4">The Story</h3>
                                    <p className="text-[#A68B7E] leading-relaxed text-lg">
                                        {activeItem.desc}
                                    </p>
                                </div>

                                {/* Navigation Buttons (Desktop) */}
                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={handlePrev}
                                        disabled={selectedIndex === 0}
                                        className="flex-1 py-4 rounded-xl border border-white/10 text-[#FAF0E6] hover:bg-white/5 disabled:opacity-30 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft size={20} /> Prev
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 py-4 rounded-xl bg-[#F2A7A7] text-[#3B241A] font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        {selectedIndex === filteredItems.length - 1 ? "Finish" : "Next"} <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}