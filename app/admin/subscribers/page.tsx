"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Download,
    RefreshCw,
    Mail,
    Search,
    Globe,
    Copy,
    Check,
    Users,
    ArrowLeft,
    Calendar,
    Hash,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Subscriber {
    email: string;
    source?: string;
    createdAt?: string;
}

export default function SubscribersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    // Pagination
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    // --- Auth Check ---
    useEffect(() => {
        if (!auth) { router.push('/auth/login'); return; }
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser) { router.push('/auth/login'); return; }
                const idTokenResult = await firebaseUser.getIdTokenResult();
                if (!idTokenResult.claims.admin) { router.push('/auth/login'); return; }
                localStorage.setItem('admin_token', idTokenResult.token);
                setIsAuthorized(true);
                setLoading(false);
                // don't fetch here - controlled by the pagination/search effect
            } catch {
                router.push('/auth/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    // --- Fetch Data ---
    async function fetchSubscribers() {
        try {
            setIsRefreshing(true);
            setError('');
            const url = new URL('/api/subscribers', window.location.origin);
            url.searchParams.append('page', String(page));
            url.searchParams.append('limit', String(pageSize));
            if (searchTerm) url.searchParams.append('q', searchTerm);
            const res = await fetch(url.toString(), {
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSubscribers(data.subscribers || []);
                // prefer explicit total from API, fallback to length
                setTotal(typeof data.total === 'number' ? data.total : (data.subscribers?.length ?? 0));
            } else {
                setError(data.error || 'Failed to load list');
            }
        } catch {
            setError('Failed to load subscribers');
        } finally {
            setIsRefreshing(false);
        }
    }

    // Fetch when page/pageSize/searchTerm changes (debounced) and only when authorized
    useEffect(() => {
        if (!isAuthorized) return;
        const t = setTimeout(() => {
            fetchSubscribers();
        }, 250);
        return () => clearTimeout(t);
    }, [page, pageSize, searchTerm, isAuthorized]);

    // Reset to first page when searchTerm changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    // --- Actions ---
    function downloadCSV() {
        const header = 'email,source,createdAt\n';
        const rows = subscribers
            .map((s) => `${s.email},${s.source || 'direct'},${s.createdAt || ''}`)
            .join('\n');
        const csv = header + rows;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const handleCopy = (email: string) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    // --- Filtering ---
    const filteredSubscribers = useMemo(() => {
        // when server-side search is used we still keep client-side filter as a safeguard
        return subscribers.filter(s => s.email.toLowerCase().includes(searchTerm));
    }, [subscribers, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A] font-serif animate-pulse">Loading Studio...</div>;
    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* --- HEADER --- */}
            <div className="sticky top-0 z-30 bg-[#FAF0E6]/95 backdrop-blur-md border-b border-[#3B241A]/5 px-6 py-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-[#3B241A]/5 rounded-lg transition-colors text-[#3B241A]/60 hover:text-[#3B241A]">
                            <ArrowLeft size={18}/>
                        </button>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Community</p>
                            <h1 className="text-xl font-serif font-bold text-[#3B241A]">Guest List</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B241A]/5 border border-[#3B241A]/10 text-xs font-bold text-[#3B241A]/60">
                            <Users size={12}/> {subscribers.length}
                        </div>

                        <div className="flex-1 md:flex-none flex items-center gap-2 justify-end">
                            <button
                                onClick={fetchSubscribers}
                                className={`p-2.5 rounded-full bg-white border border-[#3B241A]/10 text-[#3B241A] hover:bg-[#FAF0E6] transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                                title="Refresh List"
                            >
                                <RefreshCw size={16}/>
                            </button>
                            <button
                                onClick={downloadCSV}
                                disabled={subscribers.length === 0}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-lg disabled:opacity-50"
                            >
                                <Download size={14}/> <span className="hidden sm:inline">Export CSV</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="relative z-10 px-4 md:px-8 pt-8 pb-20 max-w-6xl mx-auto">

                {/* Search Bar */}
                <div className="mb-8 relative max-w-md mx-auto md:mx-0">
                    <input
                        type="text"
                        placeholder="Search email address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#3B241A]/10 focus:outline-none focus:border-[#F2A7A7] focus:ring-4 focus:ring-[#F2A7A7]/10 transition-all text-sm font-medium placeholder:text-[#3B241A]/30 shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B241A]/30" size={18} />
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 text-center">{error}</div>}

                {/* --- LIST VIEW --- */}
                {filteredSubscribers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#3B241A]/40">
                        <div className="w-16 h-16 rounded-full bg-[#3B241A]/5 flex items-center justify-center">
                            <Users size={24} className="opacity-50"/>
                        </div>
                        <p className="font-serif italic text-lg">{searchTerm ? 'No matches found.' : 'The list is empty.'}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-[#3B241A]/5 shadow-sm overflow-hidden">

                        {/* Desktop Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#3B241A]/5 bg-[#FAF0E6]/30 text-[10px] font-bold uppercase tracking-widest text-[#A68B7E]">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-5">Subscriber Info</div>
                            <div className="col-span-2">Source</div>
                            <div className="col-span-2">Date Joined</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        <div className="divide-y divide-[#3B241A]/5">
                            <AnimatePresence mode='popLayout'>
                                {filteredSubscribers.map((s, index) => (
                                    <motion.div
                                        layout
                                        key={s.email}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="group flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 p-5 md:px-6 md:py-4 items-start md:items-center hover:bg-[#FAF0E6]/40 transition-colors"
                                    >
                                        {/* Index (Desktop Only) */}
                                        <div className="hidden md:block col-span-1 text-center font-mono text-xs text-[#3B241A]/30">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>

                                        {/* Email Info */}
                                        <div className="w-full md:w-auto md:col-span-5 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#3B241A] font-serif font-bold text-xs border border-[#3B241A]/5 shrink-0">
                                                {s.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-[#3B241A] text-sm truncate" title={s.email}>{s.email}</h3>
                                                {/* Mobile Date/Source shown here */}
                                                <div className="flex md:hidden items-center gap-2 mt-1 text-[10px] text-[#A68B7E]">
                                                    <span className="flex items-center gap-1"><Calendar size={10}/> {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-[#3B241A]/20"/>
                                                    <span>{s.source || 'Website'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Source (Desktop) */}
                                        <div className="hidden md:block col-span-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF0E6] border border-[#3B241A]/5 text-[10px] font-bold uppercase tracking-wider text-[#3B241A]/60">
                                        <Globe size={10}/> {s.source || 'Direct'}
                                    </span>
                                        </div>

                                        {/* Date (Desktop) */}
                                        <div className="hidden md:block col-span-2 text-xs font-mono text-[#A68B7E]">
                                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'}) : '-'}
                                        </div>

                                        {/* Actions */}
                                        <div className="w-full md:w-auto md:col-span-2 flex items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#3B241A]/5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleCopy(s.email)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#3B241A]/10 text-xs font-bold text-[#3B241A] hover:bg-[#FAF0E6] transition-colors shadow-sm"
                                            >
                                                {copiedEmail === s.email ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}
                                                <span className="md:hidden">Copy</span>
                                            </button>
                                            <a
                                                href={`mailto:${s.email}`}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#3B241A] text-[#FAF0E6] text-xs font-bold hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-sm"
                                            >
                                                <Mail size={12}/> <span className="md:hidden">Email</span>
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="mt-6 max-w-6xl mx-auto px-4 md:px-0 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="text-sm text-[#6E5045]">Showing <span className="font-bold">{Math.min((page-1)*pageSize + 1, total || (filteredSubscribers.length ? 1 : 0))}</span> - <span className="font-bold">{Math.min(page*pageSize, total || filteredSubscribers.length)}</span> of <span className="font-bold">{total || filteredSubscribers.length}</span></div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <label className="text-xs text-[#A68B7E]">Per page</label>
                            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-3 py-1 rounded-full border border-[#3B241A]/10 bg-white text-sm">
                                {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-1 bg-white border border-[#3B241A]/10 rounded-full p-1">
                            <button onClick={() => setPage(1)} disabled={page === 1} className="p-2 rounded-full hover:bg-[#FAF0E6] disabled:opacity-50"><ChevronLeft size={16} /></button>
                            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 rounded-full hover:bg-[#FAF0E6] disabled:opacity-50">Prev</button>
                            <div className="px-3 text-sm font-mono">{page}</div>
                            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages} className="p-2 rounded-full hover:bg-[#FAF0E6] disabled:opacity-50">Next</button>
                            <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} className="p-2 rounded-full hover:bg-[#FAF0E6] disabled:opacity-50"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
             </div>
         </div>
     );
 }
