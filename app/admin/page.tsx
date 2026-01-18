"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightSearch from '@/components/SpotlightSearch';
import {
    PenTool, Code, Image as ImageIcon, User as UserIcon, MessageSquare, LogOut,
    ExternalLink, Sparkles, Search, Settings, Users, Activity, Quote, Layout,
    ArrowUpRight, Clock, Smartphone, Globe, MousePointer2, Timer, TrendingUp,
    BarChart3
} from 'lucide-react';

// --- ENHANCED ANALYTICS DATA ---
const ANALYTICS_DATA = {
    traffic: {
        total: "12,405",
        label: "Total Page Views",
        growth: "+18.2%",
        points: [20, 45, 30, 60, 55, 85, 90, 70, 95, 100],
        // 4-Point Grid for Detailed View
        metrics: [
            { label: "Bounce Rate", value: "42%", icon: <Activity size={14}/>, trend: "-2%" },
            { label: "Avg. Session", value: "2m 14s", icon: <Timer size={14}/>, trend: "+12s" },
            { label: "New Users", value: "68%", icon: <Users size={14}/>, trend: "+5%" },
            { label: "Returning", value: "32%", icon: <TrendingUp size={14}/>, trend: "+1%" },
        ]
    },
    audience: {
        total: "8,200",
        label: "Unique Visitors",
        growth: "+5.4%",
        points: [30, 35, 45, 40, 50, 55, 45, 60, 65, 70],
        metrics: [
            { label: "Mobile Traffic", value: "65%", icon: <Smartphone size={14}/>, trend: "+8%" },
            { label: "Desktop", value: "35%", icon: <MonitorIcon size={14}/>, trend: "-2%" },
            { label: "Top Region", value: "India", icon: <Globe size={14}/>, trend: "—" },
            { label: "Engagement", value: "High", icon: <Activity size={14}/>, trend: "—" },
        ]
    },
    content: {
        total: "450",
        label: "Blog Reads",
        growth: "+22%",
        points: [10, 20, 15, 30, 45, 40, 60, 55, 80, 85],
        metrics: [
            { label: "Read Ratio", value: "78%", icon: <BookOpenIcon size={14}/>, trend: "+4%" },
            { label: "Avg Scroll", value: "85%", icon: <MousePointer2 size={14}/>, trend: "+10%" },
            { label: "Shares", value: "124", icon: <ShareIcon size={14}/>, trend: "+12" },
            { label: "CTR", value: "4.5%", icon: <MousePointer2 size={14}/>, trend: "+0.5%" },
        ]
    }
};

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Analytics State
    const [activeTab, setActiveTab] = useState<'traffic' | 'audience' | 'content'>('traffic');

    // Spotlight Search State
    const [searchOpen, setSearchOpen] = useState(false);

    // --- KEYBOARD SHORTCUT FOR SEARCH ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K or Ctrl+K to open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- 1. AUTH LOGIC ---
    useEffect(() => {
        if (!auth) {
            setTimeout(() => setLoading(false), 0);
            router.push('/auth/login');
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser || !(await firebaseUser.getIdTokenResult()).claims.admin) {
                router.push('/auth/login');
                return;
            }
            localStorage.setItem('admin_token', (await firebaseUser.getIdTokenResult()).token);
            setIsAuthorized(true);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    async function handleLogout() {
        if (auth) await signOut(auth);
        localStorage.removeItem('admin_token');
        router.push('/auth/login');
    }

    // --- 2. MENU DATA ---
    const menuItems = [
        { title: "Journal", desc: "Manage blog posts", icon: <PenTool size={20} />, href: "/admin/blogs", color: "bg-[#F2A7A7]", category: "Content" },
        { title: "Quotes", desc: "Inspirational archive", icon: <Quote size={20} />, href: "/admin/quotes", color: "bg-[#DC7C7C]", category: "Content" },
        { title: "Hero", desc: "Main landing area", icon: <Layout size={20} />, href: "/admin/hero", color: "bg-[#A68B7E]", category: "Sections" },
        { title: "About", desc: "Bio & Details", icon: <UserIcon size={20} />, href: "/admin/about", color: "bg-[#3B241A]", category: "Sections" },
        { title: "Services", desc: "Offerings list", icon: <Code size={20} />, href: "/admin/services", color: "bg-[#A68B7E]", category: "Sections" },
        { title: "Expertise", desc: "Skills & Tech", icon: <Code size={20} />, href: "/admin/expertise", color: "bg-[#D4A373]", category: "Sections" },
        { title: "Journey", desc: "Timeline story", icon: <Activity size={20} />, href: "/admin/my-journey", color: "bg-[#F2A7A7]", category: "Pages" },
        { title: "Projects", desc: "Builds & Code", icon: <Code size={20} />, href: "/admin/build", color: "bg-[#A68B7E]", category: "Pages" },
        { title: "Wall", desc: "Testimonials", icon: <MessageSquare size={20} />, href: "/admin/wall", color: "bg-[#DC7C7C]", category: "Pages" },
        { title: "Media", desc: "Gallery Assets", icon: <ImageIcon size={20} />, href: "/admin/media", color: "bg-[#DC7C7C]", category: "System" },
        { title: "Settings", desc: "Site Config", icon: <Settings size={20} />, href: "/admin/settings", color: "bg-[#3B241A]", category: "System" },
        { title: "Subscribers", desc: "Newsletter list", icon: <Users size={20} />, href: "/admin/subscribers", color: "bg-[#F2A7A7]", category: "System" },
    ];

    const quickActions = [
        { label: "New Blog", icon: <PenTool size={16}/>, href: "/admin/blogs/create", color: "bg-[#3B241A] text-[#FAF0E6]" },
        { label: "Add Quote", icon: <Quote size={16}/>, href: "/admin/quotes/create", color: "bg-white text-[#3B241A] border border-[#3B241A]/10" },
        { label: "Upload", icon: <ImageIcon size={16}/>, href: "/admin/media", color: "bg-white text-[#3B241A] border border-[#3B241A]/10" },
    ];

    const categories = ["Content", "Sections", "Pages", "System"];

    // --- LOADING ---
    if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A]">LOADING...</div>;
    if (!isAuthorized) return null;

    // --- HELPER FOR GRAPH ---
    const generatePath = (points: number[]) => {
        const width = 100;
        const height = 40;
        const max = Math.max(...points);
        const stepX = width / (points.length - 1);
        let path = `M 0 ${height - (points[0] / max) * height}`;
        points.forEach((p, i) => { path += ` L ${i * stepX} ${height - (p / max) * height}`; });
        return path;
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">
            {/* Spotlight Search */}
            <SpotlightSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            <main className="flex-1 relative z-10 w-full">

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-[#3B241A]/10 bg-[#FAF0E6]/95 backdrop-blur-md fixed top-0 left-0 w-full z-50 shadow-sm h-16">
                    <span className="font-serif font-bold text-[#3B241A] text-lg flex items-center gap-2"><Sparkles size={16} /> Admin Studio</span>
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-2 rounded-lg hover:bg-[#3B241A]/5 transition-colors"
                        title="Search (⌘K)"
                    >
                        <Search size={18} className="text-[#3B241A]" />
                    </button>
                    <div className="flex items-center gap-4">
                        <Link href="/" target="_blank"><ExternalLink size={20} className="text-[#3B241A]" /></Link>
                        <button onClick={handleLogout}><LogOut size={20} className="text-[#3B241A]" /></button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-4 pt-24 md:p-12">

                    {/* Desktop Header Greeting */}
                    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#3B241A]/5 border border-[#3B241A]/10">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/60">System Online</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#3B241A] mb-2 leading-tight">Dashboard.</h1>
                            <p className="text-sm md:text-base text-[#A68B7E]">Welcome back, Isha. Here is your overview.</p>
                        </div>
                        <div className="relative group w-full lg:w-auto">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="bg-white border border-[#3B241A]/10 rounded-full py-3 pl-10 pr-6 w-full lg:w-72 text-sm focus:outline-none focus:border-[#F2A7A7] transition-all shadow-sm hover:border-[#F2A7A7] text-left flex items-center justify-between"
                            >
                                <span className="text-[#A68B7E]">Search pages, settings...</span>
                                <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono bg-[#FAF0E6] rounded border border-[#3B241A]/10">⌘K</kbd>
                            </button>
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A68B7E] pointer-events-none" />
                        </div>
                    </header>

                    {/* --- MAIN GRID --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: MODULES */}
                        <div className="lg:col-span-2 space-y-10 order-2 lg:order-1">
                            {/* Quick Actions */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/50 mb-4">Quick Actions</h3>
                                <div className="flex flex-wrap gap-3 md:gap-4">
                                    {quickActions.map((action, i) => (
                                        <Link href={action.href} key={i} className="flex-grow md:flex-grow-0">
                                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={`flex items-center justify-center md:justify-start gap-3 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all ${action.color}`}>
                                                {action.icon}
                                                <span className="text-sm font-bold whitespace-nowrap">{action.label}</span>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Content Modules */}
                            {categories.map((cat) => (
                                <div key={cat}>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/50 mb-4 border-b border-[#3B241A]/10 pb-2">{cat}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {menuItems.filter(item => item.category === cat).map((item, index) => (
                                            <Link href={item.href} key={index}>
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group bg-white p-5 rounded-2xl border border-[#3B241A]/5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4 relative overflow-hidden h-full">
                                                    <div className={`absolute top-0 right-0 w-16 h-16 ${item.color} opacity-10 rounded-bl-full`} />
                                                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>{item.icon}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-[#3B241A] text-sm group-hover:text-[#F2A7A7] transition-colors truncate">{item.title}</h4>
                                                        <p className="text-xs text-[#A68B7E] line-clamp-1">{item.desc}</p>
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT COLUMN: ANALYTICS & WIDGETS */}
                        <div className="space-y-6 md:space-y-8 order-1 lg:order-2">

                            {/* --- COMPREHENSIVE ANALYTICS CARD --- */}
                            <div className="bg-[#3B241A] text-[#FAF0E6] p-1.5 rounded-3xl shadow-xl overflow-hidden">
                                {/* Tab Navigation */}
                                <div className="bg-[#2A1A12] p-1 rounded-[22px] flex gap-1 mb-1">
                                    {(['traffic', 'audience', 'content'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 py-2.5 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === tab ? 'bg-[#3B241A] text-[#F2A7A7] shadow-lg' : 'text-[#FAF0E6]/30 hover:text-[#FAF0E6]'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6">
                                    <AnimatePresence mode='wait'>
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {/* Top Section: Big Number + Growth */}
                                            <div className="flex justify-between items-end mb-6">
                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-1">{ANALYTICS_DATA[activeTab].label}</p>
                                                    <h3 className="font-serif font-bold text-4xl">{ANALYTICS_DATA[activeTab].total}</h3>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-1 text-[#3B241A] bg-[#F2A7A7] px-2 py-1 rounded-lg text-xs font-bold mb-1">
                                                        <ArrowUpRight size={12}/> {ANALYTICS_DATA[activeTab].growth}
                                                    </div>
                                                    <span className="text-[10px] opacity-40">vs last week</span>
                                                </div>
                                            </div>

                                            {/* SVG Graph */}
                                            <div className="h-20 w-full mb-8 relative">
                                                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                                    <defs>
                                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                            <stop offset="0%" stopColor="#F2A7A7" stopOpacity="0.3" />
                                                            <stop offset="100%" stopColor="#F2A7A7" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                    <path d={`${generatePath(ANALYTICS_DATA[activeTab].points)} L 100 40 L 0 40 Z`} fill="url(#chartGradient)" />
                                                    <path d={generatePath(ANALYTICS_DATA[activeTab].points)} fill="none" stroke="#F2A7A7" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
                                                </svg>
                                            </div>

                                            {/* Detailed Metric Grid */}
                                            <div className="grid grid-cols-2 gap-4 border-t border-[#FAF0E6]/10 pt-6">
                                                {ANALYTICS_DATA[activeTab].metrics.map((item, i) => (
                                                    <div key={i} className="flex flex-col gap-1 p-3 bg-[#FAF0E6]/5 rounded-xl">
                                                        <div className="flex items-center gap-2 opacity-50 text-[#F2A7A7]">
                                                            {item.icon}
                                                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#FAF0E6]">{item.label}</span>
                                                        </div>
                                                        <div className="flex items-baseline justify-between mt-1">
                                                            <span className="font-bold text-lg">{item.value}</span>
                                                            <span className="text-[10px] opacity-40">{item.trend}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Inbox */}
                            <div className="bg-white p-6 rounded-3xl border border-[#3B241A]/5 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-[#3B241A] text-sm uppercase tracking-wide">Inbox</h3>
                                    <Link href="/admin/enquiries" className="text-xs font-bold text-[#F2A7A7] hover:underline">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex gap-3 items-start p-3 hover:bg-[#FAF0E6]/50 rounded-xl transition-colors cursor-pointer group">
                                            <div className="w-2 h-2 mt-1.5 rounded-full bg-[#F2A7A7] flex-shrink-0" />
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-[#3B241A]">New Project Inquiry</h4>
                                                <p className="text-xs text-[#A68B7E] truncate">Hi, I'm interested in your services...</p>
                                                <span className="text-[10px] text-[#3B241A]/30 font-bold mt-1 block">2 hours ago</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity Log */}
                            <div className="bg-white p-6 rounded-3xl border border-[#3B241A]/5 shadow-sm">
                                <h3 className="font-bold text-[#3B241A] text-sm uppercase tracking-wide mb-6">Activity Log</h3>
                                <div className="space-y-6 relative">
                                    <div className="absolute left-1.5 top-2 bottom-2 w-[1px] bg-[#3B241A]/10" />
                                    {[
                                        { text: "Updated Hero Section", time: "10m ago" },
                                        { text: "Published 'Next.js Guide'", time: "4h ago" },
                                        { text: "Uploaded 3 Gallery Images", time: "1d ago" }
                                    ].map((log, i) => (
                                        <div key={i} className="flex gap-4 relative z-10">
                                            <div className="w-3 h-3 rounded-full bg-[#FAF0E6] border-2 border-[#3B241A] flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-[#3B241A]">{log.text}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-[#A68B7E] mt-0.5"><Clock size={10} /> {log.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Helper Components for Icon placeholders
function MonitorIcon({size}: {size: number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>; }
function BookOpenIcon({size}: {size: number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>; }
function ShareIcon({size}: {size: number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>; }