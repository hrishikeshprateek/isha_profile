"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    LogOut,
    Plus,
    Trash2,
    Eye,
    Edit2,
    Image as ImageIcon,
    Calendar,
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
interface Blog {
    id?: string;
    _id?: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    image: string;
    tags: string[];
    readTime?: string;
    date?: string;
    published?: boolean;
}

// --- CONSTANTS ---
const ITEMS_PER_PAGE = 10;
const CATEGORIES = ['All', 'Travel', 'Content Creation', 'Food & Culture', 'Photography', 'Design', 'General'];

export default function AdminBlogsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [blogLoading, setBlogLoading] = useState(false);

    // --- FILTER STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showFilters, setShowFilters] = useState(false); // Controls Popup

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- DATA FETCHING ---
    async function fetchBlogs() {
        try {
            setBlogLoading(true);
            setError('');

            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory !== 'All') params.append('category', selectedCategory);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const queryString = params.toString();
            const url = `/api/admin/blogs${queryString ? `?${queryString}` : ''}`;

            // Get auth token
            const token = localStorage.getItem('admin_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(url, { headers });
            const data = await res.json();
            if (res.ok && data.success) {
                setBlogs(data.blogs || []);
                setCurrentPage(1);
            } else {
                setError(data.error || 'Failed to load blogs');
            }
        } catch (err) {
            console.error('Fetch blogs error:', err);
            setError('Failed to load blogs');
        } finally {
            setBlogLoading(false);
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
                fetchBlogs();
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
                fetchBlogs();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, selectedCategory, startDate, endDate]);

    // --- ACTIONS ---
    async function handleDelete(id: string) {
        if (!window.confirm('Delete this story? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`/api/admin/blogs?id=${id}`, {
                method: 'DELETE',
                headers
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess('Story deleted successfully.');
                fetchBlogs();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to delete.');
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError('Error deleting story.');
        }
    }

    async function handleLogout() {
        if (auth) await auth.signOut();
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
    }

    if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A] font-serif animate-pulse">Loading Studio...</div>;
    if (!isAuthorized) return null;

    return (
        // ADDED: p-4 and pt-24 (top padding) to prevent clipping on mobile
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] p-4 pt-24 md:p-10">

            {/* BACKGROUND TEXTURE */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* HEADER */}
                <div className="flex flex-row items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Content</p>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Journal Entries</h1>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/admin/blogs/create')}
                            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-lg"
                        >
                            <Plus size={16}/> <span className="hidden md:inline">Write New</span><span className="md:hidden">New</span>
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
                                placeholder="Search by title..."
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

                {/* BLOG LISTING */}
                <div className="bg-white rounded-3xl border border-[#3B241A]/5 shadow-sm overflow-hidden relative z-10">

                    {/* Desktop Headers */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#3B241A]/5 bg-[#FAF0E6]/30 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A68B7E]">
                        <span className="col-span-2">Cover</span>
                        <span className="col-span-4">Title</span>
                        <span className="col-span-2">Category</span>
                        <span className="col-span-2">Published</span>
                        <span className="col-span-2 text-right">Actions</span>
                    </div>

                    <div className="divide-y divide-[#3B241A]/5">
                        {blogLoading ? (
                            <div className="p-12 flex flex-col items-center justify-center gap-4 min-h-96">
                                <div className="relative w-16 h-16">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-0 rounded-full border-4 border-[#FAF0E6] border-t-[#F2A7A7] border-r-[#F2A7A7]"
                                    />
                                </div>
                                <p className="text-sm font-medium text-[#A68B7E]">Loading your stories...</p>
                            </div>
                        ) : paginatedBlogs.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center gap-4 text-[#3B241A]/40">
                                <ImageIcon size={48} className="opacity-20"/>
                                <p className="text-sm font-medium">No stories found.</p>
                                <button onClick={resetFilters} className="text-xs font-bold uppercase tracking-widest text-[#F2A7A7] hover:text-[#3B241A]">Reset Filters</button>
                            </div>
                        ) : (
                            paginatedBlogs.map((blog) => (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={blog.id || blog._id}
                                    className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-5 md:px-6 md:py-4 hover:bg-[#FAF0E6]/20 transition-colors"
                                >
                                    <div className="md:col-span-2">
                                        <div className="relative w-full h-48 md:h-12 rounded-xl md:rounded-lg overflow-hidden bg-[#3B241A]/5">
                                            {blog.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-[#3B241A]/20">
                                                    <ImageIcon size={20}/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-4 flex flex-col justify-center">
                                        <h3 className="font-bold text-[#3B241A] text-lg md:text-sm leading-tight line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-xs text-[#A68B7E] md:hidden mt-1 line-clamp-1">{blog.excerpt}</p>
                                    </div>
                                    <div className="md:col-span-2 flex items-center">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF0E6] border border-[#3B241A]/5 text-[10px] font-bold uppercase tracking-wider text-[#3B241A]/60">
                                            <Tag size={10} /> {blog.category || 'Uncategorized'}
                                        </span>
                                    </div>
                                    <div className="md:col-span-2 flex items-center text-xs text-[#A68B7E] font-medium">
                                        <Calendar size={12} className="mr-2 opacity-50"/>
                                        {blog.date || 'Draft'}
                                    </div>
                                    <div className="md:col-span-2 flex items-center md:justify-end gap-2 mt-2 md:mt-0 border-t md:border-t-0 border-[#3B241A]/5 pt-4 md:pt-0">
                                        <button
                                            onClick={() => router.push(`/blogs/${blog.id || blog._id}`)}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#FAF0E6] text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] transition-colors"
                                        >
                                            <Eye size={14}/> <span className="md:hidden">View</span>
                                        </button>
                                        <button
                                            onClick={() => router.push(`/admin/blogs/edit/${blog.id || blog._id}`)}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit2 size={14}/> <span className="md:hidden">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id || blog._id || '')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 size={14}/> <span className="md:hidden">Delete</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {!blogLoading && blogs.length > 0 && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#3B241A]/5 bg-[#FAF0E6]/20">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">
                                Showing {blogs.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, blogs.length)} of {blogs.length}
                                {(searchQuery || selectedCategory !== 'All' || startDate || endDate) && ' (filtered)'} | Page {currentPage} of {totalPages}
                            </p>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                                        : 'bg-white border border-[#3B241A]/10 text-[#3B241A] hover:bg-[#FAF0E6]'
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
                                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="hidden md:inline">Next</span> <ChevronRight size={14} />
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}