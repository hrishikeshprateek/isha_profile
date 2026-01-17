"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Quote,
    Copy,
    Heart,
    Search,
    Sparkles
} from "lucide-react";

// --- IMPORT YOUR COMPONENTS ---
import Footer from "@/components/Footer";
import Toolbar from "@/components/Toolbar";

// --- MOCK DATA ---
const QUOTES = [
    {
        id: 1,
        text: "Design is not just what it looks like and feels like. Design is how it works.",
        author: "Steve Jobs",
        category: "Design",
        lang: "en",
        liked: true
    },
    {
        id: 2,
        text: "वक्त सबको मिलता है जिंदगी बदलने के लिए, पर जिंदगी दोबारा नहीं मिलती वक्त बदलने के लिए।",
        author: "Unknown",
        category: "Life",
        lang: "hi",
        liked: false
    },
    {
        id: 3,
        text: "Creativity is intelligence having fun.",
        author: "Albert Einstein",
        category: "Creativity",
        lang: "en",
        liked: true
    },
    {
        id: 4,
        text: "मंजिलें उन्हीं को मिलती हैं, जिनके सपनों में जान होती है।",
        author: "Mirza Ghalib",
        category: "Motivation",
        lang: "hi",
        liked: true
    },
    {
        id: 5,
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
        category: "Art",
        lang: "en",
        liked: false
    },
    {
        id: 6,
        text: "सफर खूबसूरत है मंजिल से भी।",
        author: "Ae Dil Hai Mushkil",
        category: "Journey",
        lang: "hi",
        liked: true
    },
    {
        id: 7,
        text: "Make it simple, but significant.",
        author: "Don Draper",
        category: "Minimalism",
        lang: "en",
        liked: true
    },
    {
        id: 8,
        text: "कर्म ही पूजा है।",
        author: "Mahatma Gandhi",
        category: "Motivation",
        lang: "hi",
        liked: false
    }
];

const CATEGORIES = ["All", "Design", "Life", "Creativity", "Motivation", "Journey"];

export default function QuotesPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [quotes, setQuotes] = useState(QUOTES);

    const handleLike = (id: number) => {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, liked: !q.liked } : q));
    };

    const handleCopy = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredQuotes = quotes.filter(q => {
        const matchesCategory = activeCategory === "All" || q.category === activeCategory;
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col min-h-screen !bg-[#3B241A] !text-[#FAF0E6] font-sans selection:!bg-[#F2A7A7] selection:!text-[#3B241A]">

            {/* CSS TO HIDE SCROLLBAR */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>

            {/* 1. TOOLBAR */}
            <Toolbar
                title="Quotes"
                showBackButton={true}
                backHref="/"
                navItems={["Home", "Services", "Work", "About", "Contact"]}
            />

            {/* 2. BACKGROUND GLOW */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] !bg-[#F2A7A7]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] !bg-[#F2A7A7]/5 rounded-full blur-[120px]" />
            </div>

            {/* 3. MAIN CONTENT */}
            <main className="flex-grow pt-28 pb-20 px-6 relative z-10">
                <div className="container mx-auto">

                    {/* HEADER SECTION (Compact & Centered on Mobile) */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8 border-b !border-[#FAF0E6]/10 pb-6">

                        {/* Title Group */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col gap-3 items-center md:items-start text-center md:text-left"
                        >

                            {/* Main Title (Scaled Down) */}
                            <h1 className="text-4xl md:text-6xl font-serif font-bold !text-[#FAF0E6] leading-tight">
                                Words that <span className="!text-[#F2A7A7] italic">stuck.</span>
                            </h1>
                        </motion.div>

                        {/* Search Bar (Compact) */}
                        <div className="w-full md:w-auto relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 !bg-[#FAF0E6]/5 border !border-[#FAF0E6]/10 rounded-full py-2.5 pl-10 pr-6 focus:outline-none focus:!border-[#F2A7A7]/50 !text-[#FAF0E6] placeholder:!text-[#FAF0E6]/30 text-xs transition-all"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 !text-[#FAF0E6]/30" size={14} />
                        </div>
                    </div>

                    {/* CATEGORIES (No Scrollbar) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2 overflow-x-auto pb-6 no-scrollbar"
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                    px-5 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all border
                                    ${activeCategory === cat
                                    ? "!bg-[#FAF0E6] !text-[#3B241A] !border-[#FAF0E6]"
                                    : "!bg-transparent !text-[#FAF0E6]/60 !border-[#FAF0E6]/10 hover:!border-[#F2A7A7]/50 hover:!text-[#FAF0E6]"}
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    {/* QUOTES GRID (Compact) */}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredQuotes.map((quote) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    key={quote.id}
                                    className="break-inside-avoid relative group"
                                >
                                    {/* CARD - Reduced padding to p-6 and border-radius to 1.5rem */}
                                    <div className="relative !bg-[#FAF0E6]/5 backdrop-blur-md border !border-[#FAF0E6]/10 p-6 rounded-3xl hover:!bg-[#FAF0E6]/10 hover:!border-[#FAF0E6]/20 transition-all duration-300">

                                        {/* Quote Icon */}
                                        <Quote className="absolute top-5 left-5 w-6 h-6 !text-[#F2A7A7]/10 rotate-180" />

                                        {/* Content */}
                                        <div className="relative z-10 mb-6 pt-3">
                                            {/* Font Sizes Scaled Down */}
                                            <p className={`
                                                leading-[1.5] !text-[#FAF0E6] mb-4
                                                ${quote.lang === 'hi'
                                                ? 'text-lg font-medium font-sans tracking-wide'
                                                : 'text-xl font-serif font-bold tracking-tight'} 
                                            `}>
                                                &#34;{quote.text}&#34;
                                            </p>

                                            <div className="flex items-center gap-3">
                                                <div className="h-[1px] w-6 !bg-[#F2A7A7]" />
                                                <span className="!text-[#F2A7A7] text-[10px] font-bold uppercase tracking-widest">
                                                    {quote.author}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="flex justify-between items-center border-t !border-[#FAF0E6]/10 pt-4">
                                            <span className="text-[9px] font-bold uppercase tracking-widest !text-[#FAF0E6]/30">
                                                {quote.category}
                                            </span>

                                            <div className="flex gap-2">
                                                {/* Copy Button */}
                                                <button
                                                    onClick={() => handleCopy(quote.text, quote.id)}
                                                    className="p-1.5 rounded-full hover:!bg-[#FAF0E6]/10 !text-[#FAF0E6]/60 hover:!text-[#FAF0E6] transition-colors relative"
                                                >
                                                    {copiedId === quote.id ? (
                                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="!text-[#F2A7A7] text-[9px] font-bold">Copied</motion.span>
                                                    ) : (
                                                        <Copy size={16} />
                                                    )}
                                                </button>

                                                {/* Like Button */}
                                                <button
                                                    onClick={() => handleLike(quote.id)}
                                                    className={`p-1.5 rounded-full hover:!bg-[#FAF0E6]/10 transition-colors ${quote.liked ? "!text-[#F2A7A7]" : "!text-[#FAF0E6]/60 hover:!text-[#FAF0E6]"}`}
                                                >
                                                    <Heart size={16} fill={quote.liked ? "currentColor" : "none"} />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredQuotes.length === 0 && (
                        <div className="text-center py-20 opacity-50 !text-[#FAF0E6]">
                            <p>No quotes found.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 4. FOOTER */}
            <Footer />

        </div>
    );
}