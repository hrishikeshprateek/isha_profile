"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    PenTool,
    Code,
    Image as ImageIcon,
    User as UserIcon,
    Coffee,
    MessageSquare,
    LogOut,
    LayoutDashboard,
    ExternalLink,
    Sparkles,
    Search
} from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // --- 1. AUTH LOGIC (Preserved) ---
    useEffect(() => {
        if (!auth) {
            setLoading(false);
            router.push('/admin/login');
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser) {
                    setIsAuthorized(false);
                    setLoading(false);
                    router.push('/admin/login');
                    return;
                }

                const idTokenResult = await firebaseUser.getIdTokenResult();

                if (!idTokenResult.claims.admin) {
                    setIsAuthorized(false);
                    setLoading(false);
                    router.push('/admin/login');
                    return;
                }

                localStorage.setItem('admin_token', idTokenResult.token);
                setUser(firebaseUser);
                setIsAuthorized(true);
                setLoading(false);
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAuthorized(false);
                setLoading(false);
                router.push('/admin/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    async function handleLogout() {
        try {
            if (auth) await signOut(auth);
            localStorage.removeItem('admin_token');
            try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (err) { console.warn(err); }
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/admin/login');
        }
    }

    // --- 2. LOADING STATE (Themed) ---
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Sparkles className="text-[#3B241A] animate-spin" size={32} />
                    <p className="text-[#3B241A] font-serif text-lg tracking-widest">LOADING STUDIO...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) return null;

    // --- 3. DASHBOARD CONFIGURATION ---
    const menuItems = [
        { title: "Journal & Blogs", desc: "Write stories & tutorials", icon: <PenTool size={24} />, href: "/admin/blogs", color: "bg-[#F2A7A7]" },
        { title: "Code & Projects", desc: "Manage GitHub showcases", icon: <Code size={24} />, href: "/admin/projects", color: "bg-[#A68B7E]" },
        { title: "Gallery Media", desc: "Upload photos & assets", icon: <ImageIcon size={24} />, href: "/admin/media", color: "bg-[#DC7C7C]" },
        { title: "About & Bio", desc: "Update personal details", icon: <UserIcon size={24} />, href: "/admin/about", color: "bg-[#3B241A]" },
        { title: "Weekends", desc: "Curate event highlights", icon: <Coffee size={24} />, href: "/admin/weekends", color: "bg-[#D4A373]" },
        { title: "Enquiries", desc: "View incoming messages", icon: <MessageSquare size={24} />, href: "/admin/enquiries", color: "bg-[#BC6C25]" },
    ];

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* BACKGROUND TEXTURE */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* --- SIDEBAR (THE SPINE) --- */}
            <aside className="hidden md:flex flex-col w-64 bg-[#3B241A] text-[#FAF0E6] relative z-20 shadow-2xl">
                <div className="p-8 border-b border-[#FAF0E6]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FAF0E6] text-[#3B241A] flex items-center justify-center">
                            <span className="font-serif font-bold text-xl">I</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-sm tracking-widest uppercase">Isha Rani</h2>
                            <p className="text-[10px] opacity-50 uppercase tracking-wider">Content Studio</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-[#FAF0E6]/10 rounded-xl text-[#F2A7A7] font-medium transition-colors">
                        <LayoutDashboard size={18} />
                        <span>Overview</span>
                    </Link>
                    <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-[#FAF0E6]/60 hover:text-[#FAF0E6] hover:bg-[#FAF0E6]/5 rounded-xl transition-colors group">
                        <ExternalLink size={18} />
                        <span>View Live Site</span>
                        <ArrowRightIcon className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                </nav>

                <div className="p-6 border-t border-[#FAF0E6]/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-[#FAF0E6]/60 hover:text-[#F2A7A7] transition-colors text-sm w-full">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT (THE PAGE) --- */}
            <main className="flex-1 relative z-10 overflow-y-auto h-screen">

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-6 border-b border-[#3B241A]/10 bg-[#FAF0E6]">
                    <span className="font-serif font-bold text-[#3B241A]">Admin Studio</span>
                    <button onClick={handleLogout}><LogOut size={20} className="text-[#3B241A]" /></button>
                </div>

                <div className="max-w-6xl mx-auto p-6 md:p-12">

                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#3B241A]/5 border border-[#3B241A]/10">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/60">System Online</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B241A] mb-2">
                                Good Evening, <span className="text-[#F2A7A7] italic">Creator.</span>
                            </h1>
                            <p className="text-[#A68B7E]">Here is what's happening in your digital garden today.</p>
                        </div>

                        {/* Search Mockup */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search contents..."
                                className="bg-white border border-[#3B241A]/10 rounded-full py-3 pl-10 pr-6 w-full md:w-64 text-sm focus:outline-none focus:border-[#F2A7A7] transition-all"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3B241A]/30" size={16} />
                        </div>
                    </header>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: "Total Posts", value: "12", sub: "+1 this week" },
                            { label: "Enquiries", value: "5", sub: "2 unread" },
                            { label: "Projects", value: "8", sub: "All deployed" },
                            { label: "Gallery", value: "24", sub: "Images active" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-[#3B241A]/5 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] mb-1">{stat.label}</p>
                                <p className="text-3xl font-serif font-bold text-[#3B241A]">{stat.value}</p>
                                <p className="text-xs text-[#F2A7A7] mt-1 font-medium">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* MAIN GRID: Content Modules */}
                    <h3 className="text-lg font-bold text-[#3B241A] mb-6 border-b border-[#3B241A]/10 pb-2">Manage Content</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item, index) => (
                            <Link href={item.href} key={index}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="group bg-white p-6 rounded-3xl border border-[#3B241A]/5 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full"
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`} />

                                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                                        {item.icon}
                                    </div>

                                    <h3 className="text-xl font-bold text-[#3B241A] mb-1 group-hover:text-[#F2A7A7] transition-colors">{item.title}</h3>
                                    <p className="text-sm text-[#A68B7E] leading-relaxed">{item.desc}</p>

                                    <div className="mt-6 flex items-center text-[#3B241A]/40 text-xs font-bold uppercase tracking-widest group-hover:text-[#3B241A] transition-colors">
                                        <span>Manage</span>
                                        <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* RECENT ENQUIRIES PREVIEW */}
                    <div className="mt-12 bg-white rounded-3xl p-8 border border-[#3B241A]/5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-[#3B241A]">Recent Enquiries</h3>
                            <Link href="/admin/enquiries" className="text-xs font-bold uppercase tracking-widest text-[#F2A7A7] hover:text-[#3B241A] transition-colors">View All</Link>
                        </div>

                        <div className="space-y-4">
                            {/* Mock Data Item */}
                            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#FAF0E6]/50 transition-colors border border-transparent hover:border-[#3B241A]/5 cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-[#3B241A]/10 flex items-center justify-center text-[#3B241A] font-bold">R</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[#3B241A] text-sm">Rahul Verma</h4>
                                    <p className="text-xs text-[#A68B7E] truncate">Hey, I wanted to discuss a freelance project regarding...</p>
                                </div>
                                <span className="text-[10px] font-bold text-[#3B241A]/30 group-hover:text-[#F2A7A7]">2h ago</span>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#FAF0E6]/50 transition-colors border border-transparent hover:border-[#3B241A]/5 cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-[#F2A7A7]/20 flex items-center justify-center text-[#DC7C7C] font-bold">S</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[#3B241A] text-sm">Sarah Jenkins</h4>
                                    <p className="text-xs text-[#A68B7E] truncate">Loved your recent blog post about Next.js!</p>
                                </div>
                                <span className="text-[10px] font-bold text-[#3B241A]/30 group-hover:text-[#F2A7A7]">1d ago</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

// Helper Icon Component
function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}