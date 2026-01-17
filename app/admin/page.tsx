"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    PenTool,
    Code,
    Image as ImageIcon,
    User as UserIcon,
    MessageSquare,
    LogOut,
    ExternalLink,
    Sparkles,
    Search,
    Settings,
    Users
} from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    // user state intentionally not stored here to avoid unused variable warnings

    // --- 1. AUTH LOGIC (Preserved) ---
    useEffect(() => {
        // Firebase must be initialized on client side
        if (!auth) {
            // Avoid calling setState synchronously inside effect
            setTimeout(() => setLoading(false), 0);
            router.push('/auth/login');
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser) {
                    setIsAuthorized(false);
                    setLoading(false);
                    router.push('/auth/login');
                    return;
                }

                // Get ID token claims to check admin status
                const idTokenResult = await firebaseUser.getIdTokenResult();

                if (!idTokenResult.claims.admin) {
                    setIsAuthorized(false);
                    setLoading(false);
                    router.push('/auth/login');
                    return;
                }

                // Store token for authenticated API calls
                localStorage.setItem('admin_token', idTokenResult.token);
                // intentionally not storing user in state to keep UI minimal
                setIsAuthorized(true);
                setLoading(false);
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAuthorized(false);
                setLoading(false);
                router.push('/auth/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    async function handleLogout() {
        try {
            if (auth) await signOut(auth);
            localStorage.removeItem('admin_token');

            // Call logout API to clear session
            try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (err) { console.warn(err); }

            // Redirect to login
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect to login even if error occurs
            router.push('/auth/login');
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
        // Content Management
        { title: "Journal & Blogs", desc: "Create, edit, and manage blog posts", icon: <PenTool size={24} />, href: "/admin/blogs", color: "bg-[#F2A7A7]", category: "Content" },
        { title: "Quotes", desc: "Manage inspirational quotes section", icon: <PenTool size={24} />, href: "/admin/quotes", color: "bg-[#DC7C7C]", category: "Content" },

        // Page Sections
        { title: "Hero Section", desc: "Update heading, tagline & profile image", icon: <Code size={24} />, href: "/admin/hero", color: "bg-[#F2A7A7]", category: "Sections" },
        { title: "About Me", desc: "Edit your bio and personal information", icon: <UserIcon size={24} />, href: "/admin/about", color: "bg-[#3B241A]", category: "Sections" },
        { title: "Services", desc: "Manage services you offer", icon: <Code size={24} />, href: "/admin/services", color: "bg-[#A68B7E]", category: "Sections" },
        { title: "Expertise", desc: "Update skills and expertise areas", icon: <ImageIcon size={24} />, href: "/admin/expertise", color: "bg-[#D4A373]", category: "Sections" },
        { title: "Contact", desc: "Manage contact information", icon: <MessageSquare size={24} />, href: "/admin/contact", color: "bg-[#BC6C25]", category: "Sections" },

        // Special Pages
        { title: "My Journey", desc: "Update your story and timeline", icon: <PenTool size={24} />, href: "/admin/my-journey", color: "bg-[#F2A7A7]", category: "Pages" },
        { title: "Build/Projects", desc: "Manage portfolio projects", icon: <Code size={24} />, href: "/admin/build", color: "bg-[#A68B7E]", category: "Pages" },
        { title: "Wall/Testimonials", desc: "Manage testimonials and reviews", icon: <MessageSquare size={24} />, href: "/admin/wall", color: "bg-[#DC7C7C]", category: "Pages" },
        { title: "VCard", desc: "Update digital business card", icon: <UserIcon size={24} />, href: "/admin/vcard", color: "bg-[#3B241A]", category: "Pages" },

        // Media & Files
        { title: "Gallery & Media", desc: "Upload and organize images", icon: <ImageIcon size={24} />, href: "/admin/media", color: "bg-[#DC7C7C]", category: "Media" },

        // Site Settings
        { title: "Navigation", desc: "Update navbar and menu items", icon: <ExternalLink size={24} />, href: "/admin/navigation", color: "bg-[#A68B7E]", category: "Settings" },
        { title: "Footer", desc: "Edit footer content and links", icon: <MessageSquare size={24} />, href: "/admin/footer", color: "bg-[#BC6C25]", category: "Settings" },
        { title: "Site Settings", desc: "General site configuration", icon: <Settings size={24} />, href: "/admin/settings", color: "bg-[#3B241A]", category: "Settings" },

        // User Management
        { title: "Enquiries", desc: "View incoming messages", icon: <MessageSquare size={24} />, href: "/admin/enquiries", color: "bg-[#BC6C25]", category: "Users" },
        { title: "Subscribers", desc: "Manage newsletter subscribers", icon: <Users size={24} />, href: "/admin/subscribers", color: "bg-[#F2A7A7]", category: "Users" },
    ];

    // Group items by category
    const categories = Array.from(new Set(menuItems.map(item => item.category)));

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* BACKGROUND TEXTURE */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* --- MAIN CONTENT (THE PAGE) --- */}
            <main className="flex-1 relative z-10 overflow-y-auto w-full">

                {/* Mobile Header (Simplified) */}
                <div className="md:hidden flex items-center justify-between p-6 border-b border-[#3B241A]/10 bg-[#FAF0E6]">
                    <span className="font-serif font-bold text-[#3B241A]">Admin Studio</span>
                    <button onClick={handleLogout}><LogOut size={20} className="text-[#3B241A]" /></button>
                </div>

                <div className="max-w-7xl mx-auto p-6 md:p-12">

                    {/* Top Bar Navigation (Desktop) */}
                    <div className="hidden md:flex justify-end items-center gap-6 mb-8 text-sm font-bold text-[#3B241A]/60">
                        <Link href="/" target="_blank" className="hover:text-[#3B241A] transition-colors flex items-center gap-2">
                            <ExternalLink size={14}/> Live Site
                        </Link>
                        <button onClick={handleLogout} className="hover:text-[#F2A7A7] transition-colors flex items-center gap-2">
                            <LogOut size={14}/> Sign Out
                        </button>
                    </div>

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
                            <p className="text-[#A68B7E]">Manage all sections of your portfolio</p>
                        </div>

                        {/* Search Mockup */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search sections..."
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
                            { label: "Projects", value: "8", sub: "All updated" },
                            { label: "Sections", value: `${menuItems.length}`, sub: "All available" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-[#3B241A]/5 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] mb-1">{stat.label}</p>
                                <p className="text-3xl font-serif font-bold text-[#3B241A]">{stat.value}</p>
                                <p className="text-xs text-[#F2A7A7] mt-1 font-medium">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Render by Category */}
                    {categories.map((category) => (
                        <div key={category} className="mb-12">
                            <h3 className="text-lg font-bold text-[#3B241A] mb-6 border-b border-[#3B241A]/10 pb-2">{category}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuItems.filter(item => item.category === category).map((item, index) => (
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
                        </div>
                    ))}

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