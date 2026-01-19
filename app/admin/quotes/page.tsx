"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Plus,
    Trash2,
    Eye,
    Edit2,
    Quote,
    Tag,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    X,
    ListFilter,
    CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface Quote {
    id?: string;
    _id?: string;
    text: string;
    author: string;
    category: string;
    date?: string;
    published?: boolean;
}

// --- CONSTANTS ---
const ITEMS_PER_PAGE = 12;
const CATEGORIES = ['All', 'Inspiration', 'Wisdom', 'Motivation', 'Life', 'Travel', 'General'];

export default function AdminQuotesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [quoteLoading, setQuoteLoading] = useState(false);

    // --- FILTER STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(quotes.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedQuotes = quotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- DATA FETCHING ---
    async function fetchQuotes() {
        try {
            setQuoteLoading(true);
            setError('');

            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory !== 'All') params.append('category', selectedCategory);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const queryString = params.toString();
            const url = `/api/admin/quotes${queryString ? `?${queryString}` : ''}`;

            const res = await fetch(url);
            const data = await res.json();
            if (res.ok && data.success) {
                setQuotes(data.quotes || []);
                setCurrentPage(1);
            }
        } catch {
            setError('Failed to load quotes');
        } finally {
            setQuoteLoading(false);
        }
    }

    function resetFilters() {
        setSearchQuery('');
        setSelectedCategory('All');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
        setShowFilters(false);
    }

    // --- AUTH CHECK ---
    useEffect(() => {
        if (!auth) { router.push('/admin/login'); return; }
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser || !(await firebaseUser.getIdTokenResult()).claims.admin) {
                    router.push('/admin/login');
                    return;
                }
                localStorage.setItem('admin_token', (await firebaseUser.getIdTokenResult()).token);
                setIsAuthorized(true);
                setLoading(false);
                fetchQuotes();
            } catch {
                router.push('/admin/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    // --- FETCH ON FILTER CHANGE ---
    useEffect(() => {
        if (isAuthorized) {
            const timer = setTimeout(() => {
                fetchQuotes();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, selectedCategory, startDate, endDate]);

    // --- ACTIONS ---
    async function handleDelete(id: string) {
        if (!window.confirm('Delete this quote? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/quotes?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess('Quote deleted successfully.');
                fetchQuotes();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to delete.');
            }
        } catch {
            setError('Error deleting quote.');
        }
    }

    if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A] font-serif animate-pulse">Loading Archive...</div>;
    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] p-4 pt-24 md:p-10">

            {/* BACKGROUND TEXTURE */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* HEADER */}
                <div className="flex flex-row items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Collection</p>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Quotes Archive</h1>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/admin/quotes/create')}
                            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-lg"
                        >
                            <Plus size={16}/> <span className="hidden md:inline">Add Quote</span><span className="md:hidden">New</span>
                        </motion.button>
                    </div>
                </div>

                {/* --- FUSED COMMAND BAR --- */}
                <div className="mb-4 relative z-30">
                    <div className="bg-white rounded-2xl border border-[#3B241A]/10 p-2 flex flex-col md:flex-row items-stretch md:items-center shadow-sm relative z-20">

                        {/* Search Input */}
                        <div className="flex-1 flex items-center px-3 gap-3">
                            <Search size={18} className="text-[#A68B7E]" />
                            <input
                                type="text"
                                placeholder="Search by text or author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-[#3B241A] placeholder-[#A68B7E] h-10"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-[#A68B7E] hover:text-[#3B241A]">
                                    <X size={14}/>
                                </button>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-[#3B241A]/10 mx-2"></div>
                        <div className="md:hidden h-px w-full bg-[#3B241A]/5 my-2"></div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 px-2 relative">
                            {/* Category (Desktop) */}
                            <div className="relative group hidden md:block">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FAF0E6] cursor-pointer transition-colors">
                                    <ListFilter size={16} className="text-[#3B241A]/60"/>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="bg-transparent outline-none text-sm text-[#3B241A] font-medium cursor-pointer appearance-none pr-6"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
                                </div>
                            </div>

                            {/* Date Filter Button (Trigger) */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                                    showFilters || startDate || endDate
                                        ? 'bg-[#3B241A] text-[#FAF0E6]'
                                        : 'bg-[#FAF0E6] text-[#3B241A] hover:bg-[#3B241A]/10'
                                }`}
                            >
                                <Filter size={14}/>
                                <span className="hidden md:inline">Dates</span>
                            </button>
                        </div>
                    </div>

                    {/* --- FILTER POPUP (Absolute Positioned) --- */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-3 w-full md:w-80 p-5 bg-white rounded-2xl shadow-2xl border border-[#3B241A]/10 z-50 origin-top-right"
                            >
                                {/* Popup Header */}
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#3B241A]/5">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">Date Filter</span>
                                    <button onClick={() => setShowFilters(false)} className="text-[#3B241A]/40 hover:text-[#3B241A]"><X size={14}/></button>
                                </div>

                                <div className="space-y-4">
                                    {/* Mobile Only Category Select */}
                                    <div className="md:hidden space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/60">Category</label>
                                        <div className="relative">
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full bg-[#FAF0E6] border-none rounded-xl px-3 py-2 text-sm text-[#3B241A] outline-none appearance-none"
                                            >
                                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px]">▼</div>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/60 flex items-center gap-1"><CalendarDays size={12}/> From</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-[#FAF0E6] border-none rounded-xl px-3 py-2 text-sm text-[#3B241A] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/60 flex items-center gap-1"><CalendarDays size={12}/> To</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-[#FAF0E6] border-none rounded-xl px-3 py-2 text-sm text-[#3B241A] outline-none"
                                        />
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="pt-2 flex justify-between items-center">
                                        <button
                                            onClick={resetFilters}
                                            className="text-xs font-bold text-[#F2A7A7] hover:text-[#3B241A] transition-colors"
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="bg-[#3B241A] text-[#FAF0E6] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wide border border-red-100">{error}</div>}
                {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-green-100">{success}</div>}

                {/* QUOTES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {quoteLoading ? (
                        <div className="col-span-full p-12 flex flex-col items-center justify-center gap-4 min-h-96">
                            <div className="relative w-16 h-16">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full border-4 border-[#FAF0E6] border-t-[#F2A7A7] border-r-[#F2A7A7]"
                                />
                            </div>
                            <p className="text-sm font-medium text-[#A68B7E]">Loading quotes...</p>
                        </div>
                    ) : paginatedQuotes.length === 0 ? (
                        <div className="col-span-full p-12 text-center flex flex-col items-center justify-center gap-4 text-[#3B241A]/40 min-h-96">
                            <Quote size={48} className="opacity-20"/>
                            <p className="text-sm font-medium">No quotes found.</p>
                            <button onClick={resetFilters} className="text-xs font-bold uppercase tracking-widest text-[#F2A7A7] hover:text-[#3B241A]">Reset Filters</button>
                        </div>
                    ) : (
                        paginatedQuotes.map((quote) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={quote.id || quote._id}
                                className="group bg-white rounded-2xl border border-[#3B241A]/10 p-6 shadow-sm hover:shadow-md transition-all hover:border-[#F2A7A7]/50"
                            >
                                {/* Quote Text */}
                                <div className="mb-4 flex gap-3">
                                    <Quote size={20} className="text-[#F2A7A7] flex-shrink-0 mt-1" />
                                    <blockquote className="flex-1">
                                        <p className="text-base md:text-lg font-serif italic text-[#3B241A] leading-relaxed">
                                            {quote.text}
                                        </p>
                                    </blockquote>
                                </div>

                                {/* Author & Category */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#3B241A]/5">
                                    <div className="flex-1">
                                        <p className="text-xs text-[#A68B7E] font-medium">— {quote.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF0E6] border border-[#3B241A]/5 text-[10px] font-bold uppercase tracking-wider text-[#3B241A]/60">
                                                <Tag size={10} /> {quote.category || 'General'}
                                            </span>
                                            {quote.date && (
                                                <span className="text-[10px] text-[#A68B7E] font-medium">
                                                    {quote.date}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => router.push(`/admin/quotes/edit/${quote.id || quote._id}`)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        <Edit2 size={14}/> <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(quote.id || quote._id || '')}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={14}/> <span>Delete</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* PAGINATION */}
                {!quoteLoading && quotes.length > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 mt-8 bg-white rounded-2xl border border-[#3B241A]/5">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">
                            Showing {quotes.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, quotes.length)} of {quotes.length}
                            {(searchQuery || selectedCategory !== 'All' || startDate || endDate) && ' (filtered)'} | Page {currentPage} of {totalPages}
                        </p>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={14} /> <span className="hidden md:inline">Prev</span>
                                </motion.button>
                                <div className="flex items-center gap-1 px-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <motion.button
                                            key={page}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                                                currentPage === page
                                                    ? 'bg-[#3B241A] text-[#FAF0E6] shadow-md'
                                                    : 'bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] hover:bg-white'
                                            }`}
                                        >
                                            {page}
                                        </motion.button>
                                    ))}
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span className="hidden md:inline">Next</span> <ChevronRight size={14} />
                                </motion.button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

