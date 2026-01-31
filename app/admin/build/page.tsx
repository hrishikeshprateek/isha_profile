"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Trash2,
    X,
    Mail,
    Briefcase,
    Loader2,
    Sparkles,
    Clock,
    Hash,
    ArrowUpRight,
    CircleDashed,
    CheckCircle2,
    Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface BuildSubmission {
    id?: string;
    _id?: string;
    category: string;
    vibe: string[];
    description: string;
    budget: string;
    deadline: string;
    name: string;
    email: string;
    submittedAt?: string;
    status?: string;
}

const TABS = ['all', 'new', 'in-progress', 'completed'];

export default function AdminBuildPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [submissions, setSubmissions] = useState<BuildSubmission[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // UI States
    const [activeTab, setActiveTab] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState<BuildSubmission | null>(null);
    const [dataLoading, setDataLoading] = useState(false);

    // --- API Functions ---
    async function fetchSubmissions() {
        try {
            setDataLoading(true);
            const res = await fetch('/api/build');
            const data = await res.json();
            if (res.ok && data.success) {
                setSubmissions(data.submissions || []);
            }
        } catch {
            setError('Could not fetch projects.');
        } finally {
            setDataLoading(false);
        }
    }

    async function handleDelete(id: string, e?: React.MouseEvent) {
        if(e) e.stopPropagation();
        if (!window.confirm('Scrap this project brief?')) return;
        try {
            const res = await fetch(`/api/build?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess('Project scrapped.');
                setSubmissions(prev => prev.filter(s => (s.id !== id && s._id !== id)));
                setTimeout(() => setSuccess(''), 2000);
                setSelectedSubmission(null);
            }
        } catch {
            setError('Failed to delete.');
        }
    }

    async function updateStatus(id: string, status: string) {
        try {
            const res = await fetch('/api/build', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(`Moved to ${status}`);
                setSubmissions(prev => prev.map(sub =>
                    (sub.id === id || sub._id === id) ? { ...sub, status } : sub
                ));
                setTimeout(() => setSuccess(''), 2000);
            }
        } catch {
            setError('Failed to update status');
        }
    }

    // --- Auth ---
    useEffect(() => {
        if (!auth) { router.push('/auth/login'); return; }
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser || !(await firebaseUser.getIdTokenResult()).claims.admin) {
                    router.push('/auth/login');
                    return;
                }
                localStorage.setItem('admin_token', (await firebaseUser.getIdTokenResult()).token);
                setIsAuthorized(true);
                setLoading(false);
                fetchSubmissions();
            } catch {
                router.push('/auth/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    // --- Filtering ---
    const filteredSubmissions = submissions.filter(sub => {
        if (activeTab === 'all') return true;
        const status = sub.status || 'new';
        return status === activeTab;
    });

    // --- Theme Helpers ---
    const getStatusColor = (status?: string) => {
        switch(status) {
            case 'completed': return 'bg-[#3B241A] text-[#FAF0E6] border-[#3B241A]'; // Solid Espresso
            case 'in-progress': return 'bg-[#F2A7A7] text-[#3B241A] border-[#F2A7A7]'; // Solid Pink
            default: return 'bg-white text-[#3B241A]/60 border-[#3B241A]/20'; // Ghost/Outline
        }
    };

    const getStatusStripColor = (status?: string) => {
        switch(status) {
            case 'completed': return 'bg-[#3B241A]';
            case 'in-progress': return 'bg-[#F2A7A7]';
            default: return 'bg-[#A68B7E]/50';
        }
    };

    if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A] font-serif animate-pulse">Loading Studio...</div>;
    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Main Container - Increased Top Padding for Mobile */}
            <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 pt-24 pb-12 md:py-20">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A68B7E] mb-2">Workspace</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B241A] leading-tight">
                            Project Board <span className="text-[#3B241A]/20 italic">{submissions.length}</span>
                        </h1>
                    </div>

                    {/* Creative Tab Switcher */}
                    <div className="flex bg-white/50 p-1 rounded-full border border-[#3B241A]/10 backdrop-blur-sm shadow-sm overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors z-10 whitespace-nowrap ${
                                    activeTab === tab ? 'text-[#FAF0E6]' : 'text-[#3B241A]/60 hover:text-[#3B241A]'
                                }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#3B241A] rounded-full -z-10 shadow-md"
                                    />
                                )}
                                {tab.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- STATUS ALERTS --- */}
                <AnimatePresence>
                    {(success || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`mb-8 p-3 text-center text-xs font-bold uppercase tracking-widest rounded-lg border ${success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                        >
                            {success || error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- MASONRY GRID --- */}
                {dataLoading ? (
                    <div className="h-64 flex items-center justify-center text-[#3B241A]/40 gap-2">
                        <Loader2 className="animate-spin" size={20}/> <span className="text-xs font-bold uppercase">Fetching...</span>
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-[#3B241A]/30">
                        <Sparkles size={48} className="opacity-20 mb-4"/>
                        <p className="font-serif italic text-xl">No projects in this stack.</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {filteredSubmissions.map((sub, index) => (
                                <motion.div
                                    layout
                                    key={sub.id || sub._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    onClick={() => setSelectedSubmission(sub)}
                                    // Card Design: "Index Card" Style
                                    className="group cursor-pointer relative bg-white rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-[#3B241A]/5 overflow-hidden flex flex-col justify-between min-h-[260px]"
                                >
                                    {/* Decorative Top Strip (Theme Colors Only) */}
                                    <div className={`h-1.5 w-full transition-colors duration-300 ${getStatusStripColor(sub.status)}`}/>

                                    <div className="p-6 flex-1 flex flex-col">
                                        {/* Header: Category & Date */}
                                        <div className="flex justify-between items-start mb-4">
                                    <span className="font-mono text-[10px] text-[#A68B7E]">
                                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'N/A'}
                                    </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2A7A7] border border-[#F2A7A7]/30 px-2 py-0.5 rounded">
                                        {sub.category}
                                    </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-serif text-2xl font-bold text-[#3B241A] leading-tight mb-3 group-hover:text-[#F2A7A7] transition-colors line-clamp-2">
                                            {sub.name}
                                        </h3>

                                        {/* Vibe Tags */}
                                        {sub.vibe && sub.vibe.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-5">
                                                {sub.vibe.slice(0, 3).map(v => (
                                                    <span key={v} className="text-[9px] font-medium text-[#3B241A]/60 bg-[#FAF0E6] px-2 py-1 rounded-md border border-[#3B241A]/5">
                                                {v}
                                            </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Excerpt */}
                                        <p className="text-sm text-[#3B241A]/70 line-clamp-3 font-medium leading-relaxed mt-auto">
                                            {sub.description}
                                        </p>
                                    </div>

                                    {/* Footer: Meta Data */}
                                    <div className="bg-[#FAF0E6]/30 p-4 border-t border-[#3B241A]/5 flex justify-between items-center text-xs font-mono text-[#3B241A]/60 group-hover:bg-[#FAF0E6] transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Mail size={12}/>
                                            <span className="truncate max-w-[120px]">{sub.email.split('@')[0]}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#3B241A] translate-x-2 group-hover:translate-x-0 duration-300">
                                            Details <ArrowUpRight size={12}/>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* --- PROJECT MANIFESTO (MODAL) --- */}
            <AnimatePresence>
                {selectedSubmission && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedSubmission(null)}
                            className="fixed inset-0 bg-[#3B241A]/40 backdrop-blur-sm z-50"
                        />

                        {/* Paper Sheet Modal */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 md:top-0 md:inset-0 md:m-auto max-w-2xl w-full h-[85vh] md:h-fit md:max-h-[85vh] bg-[#FAF0E6] md:rounded-2xl rounded-t-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-[#3B241A]/10"
                        >
                            {/* Toolbar */}
                            <div className="bg-white p-5 border-b border-[#3B241A]/5 flex justify-between items-center sticky top-0 z-10">
                                <div className="flex items-center gap-2">
                                    <Hash size={14} className="text-[#A68B7E]"/>
                                    <span className="text-xs font-mono text-[#A68B7E] uppercase">ID: {selectedSubmission.id?.slice(-6) || '---'}</span>
                                </div>
                                <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-[#3B241A]/5 rounded-full transition-colors text-[#3B241A]/40 hover:text-[#3B241A]">
                                    <X size={20}/>
                                </button>
                            </div>

                            {/* Content (Paper Texture) */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-[#FAF0E6]">

                                {/* Title Block */}
                                <div className="text-center space-y-3">
                            <span className="inline-block px-3 py-1 rounded-full border border-[#3B241A]/10 text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] bg-white">
                                {selectedSubmission.category}
                            </span>
                                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#3B241A] leading-none">{selectedSubmission.name}</h2>
                                    <p className="font-mono text-xs text-[#3B241A]/50">Submitted: {selectedSubmission.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleString() : ''}</p>
                                </div>

                                {/* Status Stamp Controller */}
                                <div className="flex justify-center">
                                    <div className="inline-flex bg-white p-1.5 rounded-full shadow-sm border border-[#3B241A]/5 gap-1">
                                        {['new', 'in-progress', 'completed'].map((st) => {
                                            // Custom icons for status
                                            const Icon = st === 'new' ? CircleDashed : st === 'in-progress' ? Clock : CheckCircle2;
                                            return (
                                                <button
                                                    key={st}
                                                    onClick={() => updateStatus(selectedSubmission.id || selectedSubmission._id || '', st)}
                                                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                                                        selectedSubmission.status === st
                                                            ? getStatusColor(st)
                                                            : 'text-[#3B241A]/40 hover:bg-[#3B241A]/5'
                                                    }`}
                                                >
                                                    <Icon size={12}/> {st.replace('-', ' ')}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="relative pl-6 md:pl-8 border-l-2 border-[#F2A7A7]/50">
                                    <p className="text-lg md:text-xl font-serif leading-relaxed text-[#3B241A]/90">
                                        {selectedSubmission.description}
                                    </p>
                                </div>

                                {/* Data Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-xl border border-[#3B241A]/5 shadow-sm">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] mb-2 flex items-center gap-1"><Briefcase size={12}/> Budget</p>
                                        <p className="text-lg font-bold text-[#3B241A]">{selectedSubmission.budget || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-[#3B241A]/5 shadow-sm">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] mb-2 flex items-center gap-1"><Clock size={12}/> Timeline</p>
                                        <p className="text-lg font-bold text-[#3B241A]">{selectedSubmission.deadline || 'Flexible'}</p>
                                    </div>
                                </div>

                                {/* Vibes */}
                                {selectedSubmission.vibe && (
                                    <div className="space-y-4">
                                        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#A68B7E] flex items-center justify-center gap-2">
                                            <span className="h-px w-8 bg-[#3B241A]/10"></span> <Sparkles size={12}/> Aesthetic <span className="h-px w-8 bg-[#3B241A]/10"></span>
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {selectedSubmission.vibe.map(v => (
                                                <span key={v} className="px-4 py-2 bg-white border border-[#3B241A]/10 rounded-lg text-xs font-bold text-[#3B241A] shadow-sm">
                                            {v}
                                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contact */}
                                <div className="bg-[#3B241A] text-[#FAF0E6] p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-xl gap-4">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="p-3 bg-[#FAF0E6]/10 rounded-xl shrink-0">
                                            <Mail size={20}/>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Client Email</span>
                                            <span className="text-sm font-bold truncate">{selectedSubmission.email}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={`mailto:${selectedSubmission.email}`}
                                        className="w-full md:w-auto text-center px-6 py-3 bg-[#FAF0E6] text-[#3B241A] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#F2A7A7] transition-colors"
                                    >
                                        Reply Now
                                    </a>
                                </div>

                            </div>

                            {/* Footer Actions */}
                            <div className="bg-white p-4 border-t border-[#3B241A]/5 flex justify-between items-center sticky bottom-0">
                                <button
                                    onClick={(e) => handleDelete(selectedSubmission.id || selectedSubmission._id || '', e as any)}
                                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors px-2"
                                >
                                    <Trash2 size={14}/> Scrap
                                </button>
                                <button onClick={() => setSelectedSubmission(null)} className="bg-[#FAF0E6] text-[#3B241A] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#3B241A]/10 transition-colors">
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}