"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Mail,
    Clock,
    MessageSquare,
    CheckCircle2,
    CircleDashed,
    Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

interface Enquiry {
    _id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    createdAt?: string;
}

export default function AdminEnquiriesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(9); // Grid 3x3
    const [total, setTotal] = useState(0);
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

    // --- Auth Check ---
    useEffect(() => {
        if (!auth) { router.push('/admin/login'); return; }
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) { router.push('/admin/login'); return; }
            const tokenResult = await firebaseUser.getIdTokenResult();
            if (!tokenResult.claims.admin) { router.push('/admin/login'); return; }
            localStorage.setItem('admin_token', tokenResult.token);
            fetchEnquiries(1, search);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // --- API Functions ---
    async function fetchEnquiries(nextPage = 1, nextSearch = '') {
        try {
            setError('');
            const params = new URLSearchParams({ page: `${nextPage}`, limit: `${limit}` });
            if (nextSearch.trim()) params.set('search', nextSearch.trim());
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`/api/admin/enquiries?${params.toString()}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to load');
            setEnquiries(data.enquiries || []);
            setTotal(data.total || 0);
            setPage(data.page || nextPage);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to load enquiries';
            setError(msg);
        }
    }

    async function updateStatus(id: string, status: string) {
        try {
            setStatusUpdating(id);
            const token = localStorage.getItem('admin_token');
            const res = await fetch('/api/admin/enquiries', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ id, status }),
            });
            const data = await res.json();
            if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to update');
            // Optimistic update locally to avoid full refetch flicker
            setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to update status';
            setError(msg);
        } finally {
            setStatusUpdating(null);
        }
    }

    // --- Theme Helpers ---
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'resolved': return 'bg-[#3B241A] text-[#FAF0E6] border-[#3B241A]';
            case 'in-progress': return 'bg-[#F2A7A7] text-[#3B241A] border-[#F2A7A7]';
            default: return 'bg-white text-[#3B241A]/60 border-[#3B241A]/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* --- HEADER --- */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-[#FAF0E6]/95 backdrop-blur-md border-b border-[#3B241A]/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Inbox</p>
                        <h1 className="text-xl font-serif font-bold text-[#3B241A] flex items-center gap-2">
                            Messages <span className="text-[#3B241A]/20 font-sans italic text-lg">{total}</span>
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group w-full md:w-80">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchEnquiries(1, e.currentTarget.value)}
                            placeholder="Search sender or message..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#3B241A]/10 rounded-xl text-sm font-medium focus:outline-none focus:border-[#F2A7A7] focus:ring-1 focus:ring-[#F2A7A7] transition-all placeholder:text-[#3B241A]/30"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B241A]/30 group-focus-within:text-[#F2A7A7] transition-colors" size={16} />
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="relative z-10 pt-36 px-4 md:px-8 pb-20 max-w-7xl mx-auto">

                {error && <div className="mb-8 text-center bg-red-50 text-red-600 py-2 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#3B241A]/40">
                        <Loader2 size={32} className="animate-spin"/>
                        <p className="text-xs font-bold uppercase tracking-widest">Checking Mailbox...</p>
                    </div>
                ) : enquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-[#3B241A]/30">
                        <Inbox size={48} className="opacity-20"/>
                        <p className="font-serif italic text-xl">Inbox is empty.</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {enquiries.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group bg-white rounded-2xl border border-[#3B241A]/5 hover:border-[#3B241A]/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                                >
                                    {/* Top Decorative Line */}
                                    <div className={`h-1 w-full ${item.status === 'resolved' ? 'bg-[#3B241A]' : item.status === 'in-progress' ? 'bg-[#F2A7A7]' : 'bg-[#A68B7E]/30'}`}/>

                                    <div className="p-6 flex-1 flex flex-col">
                                        {/* Header: Name & Date */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#FAF0E6] flex items-center justify-center text-lg font-serif font-bold text-[#3B241A] border border-[#3B241A]/10">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#3B241A] text-lg leading-tight">{item.name}</h3>
                                                    <p className="text-[10px] text-[#A68B7E] font-bold uppercase tracking-wider">{item.createdAt ? dayjs(item.createdAt).format('MMM D') : 'Unknown'}</p>
                                                </div>
                                            </div>

                                            {/* Status Control */}
                                            <div className="relative">
                                                <select
                                                    disabled={statusUpdating === item._id}
                                                    value={item.status || 'open'}
                                                    onChange={(e) => updateStatus(item._id, e.target.value)}
                                                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3B241A]/20 ${getStatusColor(item.status)}`}
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="in-progress">Pending</option>
                                                    <option value="resolved">Done</option>
                                                </select>
                                                {statusUpdating === item._id ? (
                                                    <Loader2 size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-[#3B241A]/50"/>
                                                ) : (
                                                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[8px]">▼</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Message Body */}
                                        <div className="relative bg-[#FAF0E6]/30 p-4 rounded-xl border border-[#3B241A]/5 mb-4 flex-1">
                                            <MessageSquare size={40} className="absolute -top-2 -right-2 text-[#3B241A]/5 -rotate-12"/>
                                            <p className="text-sm text-[#3B241A]/80 font-serif leading-relaxed whitespace-pre-wrap">
                                                {item.message}
                                            </p>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-2 text-xs text-[#3B241A]/50 font-medium truncate max-w-[60%]">
                                                <Mail size={12}/>
                                                <span className="truncate">{item.email}</span>
                                            </div>
                                            <a
                                                href={`mailto:${item.email}`}
                                                className="px-4 py-2 bg-[#3B241A] text-[#FAF0E6] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-md"
                                            >
                                                Reply
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* --- PAGINATION --- */}
                {total > 0 && (
                    <div className="flex justify-center mt-12 gap-2">
                        <button
                            onClick={() => page > 1 && fetchEnquiries(page - 1, search)}
                            disabled={page <= 1}
                            className="w-10 h-10 rounded-xl bg-white border border-[#3B241A]/10 text-[#3B241A] flex items-center justify-center hover:bg-[#FAF0E6] disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft size={16}/>
                        </button>
                        <div className="px-4 h-10 rounded-xl bg-[#3B241A]/5 border border-[#3B241A]/10 flex items-center justify-center text-xs font-bold text-[#3B241A]">
                            Page {page} of {totalPages}
                        </div>
                        <button
                            onClick={() => page < totalPages && fetchEnquiries(page + 1, search)}
                            disabled={page >= totalPages}
                            className="w-10 h-10 rounded-xl bg-white border border-[#3B241A]/10 text-[#3B241A] flex items-center justify-center hover:bg-[#FAF0E6] disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16}/>
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}