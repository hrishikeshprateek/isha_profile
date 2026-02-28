"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Quote,
    Copy,
    Search,
    Sparkles
} from "lucide-react";

// --- IMPORT YOUR COMPONENTS ---
import Footer from "@/components/Footer";
import Toolbar from "@/components/Toolbar";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";

// --- MOCK DATA (Fallback) ---
const FALLBACK_QUOTES: Quote[] = [
    {
        text: "Design is not just what it looks like and feels like. Design is how it works.",
        author: "Steve Jobs",
        id: "1",
        category: "Inspiration"
    },
    {
        id: "2",
        text: "Creativity is intelligence having fun.",
        author: "Albert Einstein",
        category: "Inspiration"
    },
    {
        id: "3",
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Motivation"
    },
    {
        id: "4",
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
        category: "Wisdom"
    },
    {
        id: "5",
        text: "Make it simple, but significant.",
        author: "Don Draper",
        category: "General"
    }
];

// API quote shape (safely typed)
type ApiQuote = {
    _id?: { toString(): string } | string;
    id?: string;
    text?: string;
    author?: string;
    category?: string;
    date?: string;
    published?: boolean;
};

export default function QuotesPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    // Pagination
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(12);
    const [total, setTotal] = useState<number>(0);
    // Sorting: 'desc' = newest first (default), 'asc' = oldest first
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    // Fetch quotes from API
    useEffect(() => {
        async function fetchQuotes() {
            try {
                const params = new URLSearchParams();
                params.set('limit', String(limit));
                params.set('page', String(page));
                // Include sort preference as a hint to the API (server may honor it)
                params.set('sort', sortOrder);
                if (activeCategory && activeCategory !== 'All') params.set('category', activeCategory);
                if (searchTerm) params.set('search', searchTerm);

                const res = await fetch(`/api/quotes?${params.toString()}`);
                const data = await res.json();

                if (res.ok && data.success && data.quotes) {
                    const fetchedQuotes = (data.quotes as ApiQuote[]).map((q) => {
                        // derive id safely without using `any`
                        let idVal: string | undefined = q.id;
                        if (q._id) {
                            if (typeof q._id === 'string') {
                                idVal = q._id;
                            } else {
                                const maybe = q._id as unknown;
                                if (maybe && typeof (maybe as { toString?: unknown }).toString === 'function') {
                                    idVal = (maybe as { toString: () => string }).toString();
                                }
                            }
                        }

                        return {
                            id: idVal,
                            text: q.text || '',
                            author: q.author || 'Unknown',
                            category: q.category || 'General',
                            date: q.date,
                            published: !!q.published
                        } as Quote;
                    });
                    // Ensure newest quotes appear first (sort by date desc). If date is missing, keep original order.
                    fetchedQuotes.sort((a, b) => {
                        const da = a.date ? Date.parse(a.date) : 0;
                        const db = b.date ? Date.parse(b.date) : 0;
                        return db - da;
                    });
                     setQuotes(fetchedQuotes);

                    // If categories are not set yet, derive from fetched data OR maintain existing
                    const categorySet = new Set(fetchedQuotes.map((q: Quote) => q.category));
                    const uniqueCategories: string[] = ['All', ...(Array.from(categorySet) as string[])];
                    setCategories(uniqueCategories);
                    setTotal(typeof data.total === 'number' ? data.total : fetchedQuotes.length);
                } else {
                    // Use fallback but ensure newest-first ordering for consistency
                    const sortedFallback = [...FALLBACK_QUOTES].sort((a, b) => {
                        const da = a.date ? Date.parse(a.date) : 0;
                        const db = b.date ? Date.parse(b.date) : 0;
                        return db - da;
                    });
                    setQuotes(sortedFallback);
                }
            } catch (error) {
                console.error('Failed to fetch quotes:', error);
                setQuotes(FALLBACK_QUOTES);
            } finally {
                setLoading(false);
            }
        }

        fetchQuotes();
    }, [page, limit, activeCategory, searchTerm, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const handleCopy = (text: string, id: string | undefined) => {
        if (!id) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filter quotes based on category and search
    const filteredQuotes = quotes.filter(q => {
        const matchesCategory = activeCategory === "All" || q.category === activeCategory;
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             q.author.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    // Apply client-side sorting based on date (newest-first by default). Falls back to original order when dates are missing.
    const sortedFilteredQuotes = [...filteredQuotes].sort((a, b) => {
        const da = a.date ? Date.parse(a.date) : 0;
        const db = b.date ? Date.parse(b.date) : 0;
        return sortOrder === 'desc' ? db - da : da - db;
    });

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen !bg-[#3B241A] !text-[#FAF0E6] font-sans items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles size={40} className="text-[#F2A7A7]" />
                </motion.div>
                <p className="mt-4 font-serif text-lg">Loading quotes...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen !bg-[#3B241A] !text-[#FAF0E6] font-sans selection:!bg-[#F2A7A7] selection:!text-[#3B241A]">

            {/* 1. TOOLBAR */}
            <Toolbar
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
                        {/* Sort toggle placed next to search for quick access */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#A68B7E] hidden md:inline">Sort:</span>
                            <div className="inline-flex rounded-full bg-white/5 p-0.5">
                                <button
                                    onClick={() => setSortOrder('desc')}
                                    aria-pressed={sortOrder === 'desc'}
                                    className={`px-3 py-1 text-xs rounded-full ${sortOrder === 'desc' ? '!bg-[#3B241A] !text-[#FAF0E6]' : 'text-[#FAF0E6]/70'}`}
                                >
                                    Newest
                                </button>
                                <button
                                    onClick={() => setSortOrder('asc')}
                                    aria-pressed={sortOrder === 'asc'}
                                    className={`px-3 py-1 text-xs rounded-full ${sortOrder === 'asc' ? '!bg-[#3B241A] !text-[#FAF0E6]' : 'text-[#FAF0E6]/70'}`}
                                >
                                    Oldest
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CATEGORIES (No Scrollbar) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2 overflow-x-auto pb-6 no-scrollbar"
                    >
                        {categories.map((cat) => (
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
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mt-8">
                        <AnimatePresence mode="popLayout">
                            {sortedFilteredQuotes.length > 0 ? (
                                sortedFilteredQuotes.map((quote) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={quote.id || quote._id}
                                        className="break-inside-avoid relative group"
                                    >
                                        <div className="relative !bg-[#FAF0E6]/5 backdrop-blur-md border !border-[#FAF0E6]/10 p-6 rounded-3xl hover:border-[#F2A7A7]/30 transition-all">

                                            {/* Quote Icon */}
                                            <Quote className="absolute top-5 left-5 w-6 h-6 !text-[#F2A7A7]/10 rotate-180" />

                                            {/* Quote Text */}
                                            <p className="leading-[1.5] !text-[#FAF0E6] mb-4 text-lg md:text-xl font-serif font-bold tracking-tight">
                                                “{quote.text}”
                                            </p>

                                            {/* Author */}
                                            <div className="flex items-center gap-3 mb-4 pb-4 border-b !border-[#FAF0E6]/10">
                                                <div className="h-[1px] w-6 !bg-[#F2A7A7]" />
                                                <span className="!text-[#F2A7A7] text-[10px] font-bold uppercase tracking-widest">
                                                    {quote.author}
                                                </span>
                                            </div>

                                            {/* Category & Actions */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-bold uppercase tracking-widest !text-[#FAF0E6]/30">
                                                    {quote.category}
                                                </span>

                                                {/* Copy Button */}
                                                <div className="flex items-center gap-2">
                                                    {/* View Link */}
                                                    {quote.id ? (
                                                        <Link href={`/quotes/${quote.id}-${encodeURIComponent((quote.author || 'quote').toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`} className="text-xs font-bold !text-[#F2A7A7] hover:!text-[#FAF0E6]">
                                                            View
                                                        </Link>
                                                    ) : null}

                                                    {/* Share Button (client) */}
                                                    {quote.id ? (
                                                        <ShareButton quoteId={quote.id} title={quote.author} text={quote.text} />
                                                    ) : (
                                                        <button
                                                            onClick={() => handleCopy(quote.text, quote.id || quote._id)}
                                                            className="p-1.5 rounded-full hover:!bg-[#FAF0E6]/10 transition-colors"
                                                        >
                                                            {copiedId === (quote.id || quote._id) ? (
                                                                <span className="!text-[#F2A7A7] text-[9px] font-bold">Copied</span>
                                                            ) : (
                                                                <Copy size={16} className="!text-[#F2A7A7]" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                 <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                                     <Quote size={48} className="opacity-20" />
                                     <p className="text-sm font-medium !text-[#FAF0E6]/50">No quotes found.</p>
                                     <button
                                         onClick={() => { setActiveCategory("All"); setSearchTerm(""); }}
                                         className="text-xs font-bold uppercase tracking-widest !text-[#F2A7A7] hover:!text-[#FAF0E6] transition-colors"
                                     >
                                         Reset Filters
                                     </button>
                                 </div>
                             )}
                         </AnimatePresence>
                     </div>

                     {/* Pagination Controls */}
                     <nav className="mt-8" role="navigation" aria-label="Quotes pagination">
                         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                             <div className="text-sm text-[#FAF0E6]/70 order-2 md:order-1">
                                 Showing <span className="font-bold">{Math.min((page-1)*limit + 1, total || quotes.length)}</span> - <span className="font-bold">{Math.min(page*limit, total || quotes.length)}</span> of <span className="font-bold">{total || quotes.length}</span>
                             </div>

                             <div className="flex items-center gap-2 order-1 md:order-2">
                                 {/* limit selector - hidden on small screens to save space */}
                                 <select
                                     value={limit}
                                     onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                                     className="px-3 py-1 rounded-full bg-[#FAF0E6]/5 text-xs hidden md:inline-flex"
                                     aria-label="Quotes per page"
                                 >
                                     {[6,12,24,48].map(n => <option key={n} value={n}>{n}</option>)}
                                 </select>

                                 {/* First - hidden on mobile */}
                                 <button
                                     onClick={() => setPage(1)}
                                     disabled={page === 1}
                                     className="px-3 py-1 rounded-full bg-white/10 hidden md:inline-flex"
                                     aria-label="First page"
                                 >
                                     First
                                 </button>

                                 {/* Prev - always visible, touch-friendly on mobile */}
                                 <button
                                     onClick={() => setPage(p => Math.max(1, p-1))}
                                     disabled={page === 1}
                                     className="flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-white/10 min-w-[44px] h-11"
                                     aria-label="Previous page"
                                 >
                                     Prev
                                 </button>

                                 {/* Compact page indicator */}
                                 <div className="px-3 py-1 rounded-full bg-white/5 text-xs">
                                     Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
                                 </div>

                                 {/* Next - always visible */}
                                 <button
                                     onClick={() => setPage(p => Math.min(totalPages, p+1))}
                                     disabled={page >= totalPages}
                                     className="flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-white/10 min-w-[44px] h-11"
                                     aria-label="Next page"
                                 >
                                     Next
                                 </button>

                                 {/* Last - hidden on mobile */}
                                 <button
                                     onClick={() => setPage(totalPages)}
                                     disabled={page >= totalPages}
                                     className="px-3 py-1 rounded-full bg-white/10 hidden md:inline-flex"
                                     aria-label="Last page"
                                 >
                                     Last
                                 </button>
                             </div>
                         </div>
                     </nav>

                 </div>
             </main>

             {/* 4. FOOTER */}
             <Footer />
         </div>
     );
 }
