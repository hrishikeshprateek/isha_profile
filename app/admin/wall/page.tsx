"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Plus,
    Trash2,
    Edit2,
    Play,
    Image as ImageIcon,
    Tag,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    X,
    ListFilter,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface WallItem {
    id?: string;
    _id?: string;
    type: string;
    category: string;
    src: string;
    thumb: string;
    title: string;
    client: string;
    desc: string;
    date?: string;
    published?: boolean;
}

// --- CONSTANTS ---
const ITEMS_PER_PAGE = 12;
const CATEGORIES = ['All', 'Reels', 'Photography', 'Branding', 'Video', 'Other'];

export default function AdminWallPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [items, setItems] = useState<WallItem[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemLoading, setItemLoading] = useState(false);

    // --- FILTER STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- DATA FETCHING ---
    async function fetchItems() {
        try {
            setItemLoading(true);
            setError('');

            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory !== 'All') params.append('category', selectedCategory);

            const queryString = params.toString();
            const url = `/api/admin/wall${queryString ? `?${queryString}` : ''}`;

            const res = await fetch(url);
            const data = await res.json();
            if (res.ok && data.success) {
                setItems(data.items || []);
                setCurrentPage(1);
            }
        } catch {
            setError('Failed to load wall items');
        } finally {
            setItemLoading(false);
        }
    }

    function resetFilters() {
        setSearchQuery('');
        setSelectedCategory('All');
        setCurrentPage(1);
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
                fetchItems();
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
                fetchItems();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, selectedCategory]);

    // --- ACTIONS ---
    async function handleDelete(id: string) {
        if (!window.confirm('Delete this item? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/wall?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess('Item deleted successfully.');
                fetchItems();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to delete.');
            }
        } catch {
            setError('Error deleting item.');
        }
    }

    if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A] font-serif animate-pulse">Loading Gallery...</div>;
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
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Portfolio</p>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Gallery Wall</h1>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/admin/wall/create')}
                            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-lg"
                        >
                            <Plus size={16}/> <span className="hidden md:inline">Add Item</span><span className="md:hidden">New</span>
                        </motion.button>
                    </div>
                </div>

                {/* --- SEARCH & FILTER BAR --- */}
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

                        {/* Category Filter */}
                        <div className="relative group px-2">
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
                    </div>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wide border border-red-100">{error}</div>}
                {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-green-100">{success}</div>}

                {/* GALLERY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-8">
                    {itemLoading ? (
                        <div className="col-span-full p-12 flex flex-col items-center justify-center gap-4 min-h-96">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="relative w-16 h-16"
                            >
                                <Sparkles size={40} className="text-[#F2A7A7]" />
                            </motion.div>
                            <p className="text-sm font-medium text-[#A68B7E]">Loading gallery items...</p>
                        </div>
                    ) : paginatedItems.length === 0 ? (
                        <div className="col-span-full p-12 text-center flex flex-col items-center justify-center gap-4 text-[#3B241A]/40 min-h-96">
                            <ImageIcon size={48} className="opacity-20"/>
                            <p className="text-sm font-medium">No items found.</p>
                            <button onClick={resetFilters} className="text-xs font-bold uppercase tracking-widest text-[#F2A7A7] hover:text-[#3B241A]">Reset Filters</button>
                        </div>
                    ) : (
                        paginatedItems.map((item) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={item.id || item._id}
                                className="group bg-white rounded-2xl border border-[#3B241A]/10 shadow-sm hover:shadow-md overflow-hidden transition-all"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full h-48 bg-[#3B241A]/5 overflow-hidden">
                                    {item.thumb ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-[#3B241A]/20">
                                            <ImageIcon size={48}/>
                                        </div>
                                    )}

                                    {/* Type Badge */}
                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                            <Play size={48} className="text-white fill-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-[#3B241A] text-sm line-clamp-1">{item.title}</h3>
                                        <p className="text-xs text-[#A68B7E] mt-1">{item.client}</p>
                                    </div>

                                    <p className="text-xs text-[#3B241A]/60 line-clamp-2">{item.desc}</p>

                                    <div className="flex items-center gap-2 pt-2 border-t border-[#3B241A]/5">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#FAF0E6] border border-[#3B241A]/5 text-[10px] font-bold uppercase tracking-wider text-[#3B241A]/60">
                                            <Tag size={10} /> {item.category}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-2">
                                        <button
                                            onClick={() => router.push(`/admin/wall/edit/${item.id || item._id}`)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit2 size={14}/> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id || item._id || '')}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 size={14}/> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* PAGINATION */}
                {!itemLoading && items.length > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-white rounded-2xl border border-[#3B241A]/5">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">
                            Showing {items.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, items.length)} of {items.length}
                            {(searchQuery || selectedCategory !== 'All') && ' (filtered)'} | Page {currentPage} of {totalPages}
                        </p>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={14} /> Prev
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
                                    Next <ChevronRight size={14} />
                                </motion.button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

