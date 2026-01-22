"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Plus,
    Trash2,
    Edit2,
    Star,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    Sparkles,
    Quote
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- TYPES ---
interface Testimonial {
    id?: string;
    _id?: string;
    name: string;
    designation: string;
    company: string;
    testimonial: string;
    image?: string;
    rating: number;
    date?: string;
    published?: boolean;
}

// --- CONSTANTS ---
const ITEMS_PER_PAGE = 10;

export default function AdminTestimonialsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemLoading, setItemLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = testimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- DATA FETCHING ---
    const fetchTestimonials = useCallback(async () => {
        try {
            setItemLoading(true);
            setError('');

            const token = localStorage.getItem('admin_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);

            const queryString = params.toString();
            const url = `/api/admin/wall${queryString ? `?${queryString}` : ''}`;

            const res = await fetch(url, { headers });
            const data = await res.json();
            if (res.ok && data.success) {
                setTestimonials(data.items || data.testimonials || []);
                setCurrentPage(1);
            } else {
                setError(data.error || 'Failed to load testimonials');
            }
        } catch (err) {
            console.error('Fetch testimonials error:', err);
            setError('Failed to load testimonials');
        } finally {
            setItemLoading(false);
        }
    }, [searchQuery]);

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
                fetchTestimonials();
            } catch {
                router.push('/admin/login');
            }
        });
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // --- FETCH ON SEARCH CHANGE ---
    useEffect(() => {
        if (isAuthorized) {
            const timer = setTimeout(() => {
                fetchTestimonials();
            }, 500);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, isAuthorized]);

    // --- ACTIONS ---
    async function handleDelete(id: string) {
        if (!window.confirm('Delete this testimonial? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`/api/admin/wall?id=${id}`, {
                method: 'DELETE',
                headers
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess('Testimonial deleted successfully.');
                fetchTestimonials();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to delete.');
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError('Error deleting testimonial.');
        }
    }

    if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A] font-serif animate-pulse">Loading Testimonials...</div>;
    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] p-3 sm:p-4 md:p-6 lg:p-10 pt-20 sm:pt-24 md:pt-24">

            {/* BACKGROUND TEXTURE */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="w-full max-w-6xl mx-auto relative z-10">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 mb-6 md:mb-8">
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#A68B7E] font-bold">Community</p>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold leading-tight mt-1">Testimonials</h1>
                        <p className="text-xs sm:text-sm text-[#3B241A]/60 mt-1">Manage client reviews and feedback</p>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/admin/testimonials/create')}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs sm:text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-lg whitespace-nowrap flex-shrink-0"
                    >
                        <Plus size={14} className="sm:w-4 sm:h-4"/>
                        <span className="hidden sm:inline">Add New</span>
                        <span className="sm:hidden">New</span>
                    </motion.button>
                </div>

                {/* --- SEARCH BAR --- */}
                <div className="mb-4 md:mb-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-[#3B241A]/10 p-2 flex items-center shadow-sm">
                        <div className="flex-1 flex items-center px-2 sm:px-3 gap-2 sm:gap-3 min-w-0">
                            <Search size={16} className="sm:w-5 sm:h-5 text-[#A68B7E] flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search testimonials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[#3B241A] placeholder-[#A68B7E] min-w-0"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-[#A68B7E] hover:text-[#3B241A] flex-shrink-0 p-1"
                                >
                                    <X size={14} className="sm:w-4 sm:h-4"/>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {error && <div className="mb-4 md:mb-6 p-3 sm:p-4 bg-red-50 text-red-600 rounded-lg sm:rounded-xl text-xs font-bold uppercase tracking-wide border border-red-100">{error}</div>}
                {success && <div className="mb-4 md:mb-6 p-3 sm:p-4 bg-green-50 text-green-700 rounded-lg sm:rounded-xl text-xs font-bold uppercase tracking-wide border border-green-100">{success}</div>}

                {/* TESTIMONIALS LIST */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 md:mb-8">
                    {itemLoading ? (
                        <div className="p-8 sm:p-12 flex flex-col items-center justify-center gap-4 min-h-64 sm:min-h-96 bg-white rounded-lg sm:rounded-2xl">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="relative w-12 sm:w-16 h-12 sm:h-16"
                            >
                                <Sparkles size={32} className="sm:w-10 sm:h-10 text-[#F2A7A7]" />
                            </motion.div>
                            <p className="text-xs sm:text-sm font-medium text-[#A68B7E]">Loading testimonials...</p>
                        </div>
                    ) : paginatedItems.length === 0 ? (
                        <div className="p-6 sm:p-12 text-center flex flex-col items-center justify-center gap-3 sm:gap-4 text-[#3B241A]/40 min-h-64 sm:min-h-96 bg-white rounded-lg sm:rounded-2xl">
                            <Quote size={40} className="sm:w-12 sm:h-12 opacity-20"/>
                            <p className="text-xs sm:text-sm font-medium">No testimonials found.</p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-xs font-bold uppercase tracking-widest text-[#F2A7A7] hover:text-[#3B241A]"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        paginatedItems.map((item) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={item.id || item._id}
                                className="bg-white rounded-lg sm:rounded-2xl border border-[#3B241A]/10 shadow-sm hover:shadow-md overflow-hidden transition-all p-3 sm:p-4 md:p-6"
                            >
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
                                    {/* Avatar */}
                                    <div className="shrink-0 flex-shrink-0">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#3B241A]/5 border-2 border-[#F2A7A7]/30 flex-shrink-0">
                                            {item.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-[#3B241A]/40 font-serif text-xl sm:text-2xl font-bold">
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-[#3B241A] text-base sm:text-lg truncate">{item.name}</h3>
                                            <p className="text-xs sm:text-sm text-[#A68B7E] truncate">{item.designation} at {item.company}</p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={`sm:w-4 sm:h-4 ${i < item.rating ? 'fill-[#F2A7A7] text-[#F2A7A7]' : 'text-[#3B241A]/10'}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Testimonial Text */}
                                        <blockquote className="text-xs sm:text-sm text-[#3B241A]/80 italic border-l-4 border-[#F2A7A7]/30 pl-2 sm:pl-4 line-clamp-2 sm:line-clamp-none">
                                            &ldquo;{item.testimonial}&rdquo;
                                        </blockquote>

                                        {/* Meta & Actions */}
                                        <div className="space-y-2 pt-2">
                                            <div className="flex items-center gap-2 text-xs text-[#A68B7E] flex-wrap">
                                                {item.date && <span className="text-[10px] sm:text-xs">Added: {new Date(item.date).toLocaleDateString()}</span>}
                                                <span className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-md whitespace-nowrap ${item.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {item.published ? 'Published' : 'Draft'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                                                <button
                                                    onClick={() => router.push(`/admin/testimonials/edit/${item.id || item._id}`)}
                                                    className="flex items-center justify-center gap-1 px-3 py-1.5 sm:py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold hover:bg-blue-100 transition-colors"
                                                >
                                                    <Edit2 size={12} className="sm:w-4 sm:h-4"/> <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id || item._id || '')}
                                                    className="flex items-center justify-center gap-1 px-3 py-1.5 sm:py-2 rounded-lg bg-red-50 text-red-600 text-[10px] sm:text-xs font-bold hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={12} className="sm:w-4 sm:h-4"/> <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* PAGINATION */}
                {!itemLoading && testimonials.length > 0 && (
                    <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white rounded-lg sm:rounded-2xl border border-[#3B241A]/5">
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#A68B7E] text-center md:text-left">
                            Showing {testimonials.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, testimonials.length)} of {testimonials.length}
                            {searchQuery && ' (filtered)'} | Page {currentPage} of {totalPages}
                        </p>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center md:justify-end gap-1 sm:gap-2 overflow-x-auto">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    <ChevronLeft size={12} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Prev</span>
                                </motion.button>

                                <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 max-w-xs sm:max-w-none overflow-x-auto">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                                        <motion.button
                                            key={page}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold transition-colors flex-shrink-0 ${
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
                                    className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    <span className="hidden sm:inline">Next</span> <ChevronRight size={12} className="sm:w-4 sm:h-4" />
                                </motion.button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

