"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChevronDown,
    LayoutDashboard,
    BookOpen,
    Layers,
    LayoutTemplate,
    Image as ImageIcon,
    Settings,
    Users,
    LogOut,
    ExternalLink,
    Menu,
    X,
    Quote,
    PenTool,
    Search
} from 'lucide-react';

// --- MENU DATA ---
type MenuItem = {
    id: string;
    title: string;
    href?: string;
    icon?: React.ReactNode;
    children?: MenuItem[];
};

const MENU: MenuItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/admin',
        icon: <LayoutDashboard size={18} />
    },

    // CONTENT (Journaling & Wisdom)
    {
        id: 'content',
        title: 'Editorial Content',
        icon: <BookOpen size={18} />,
        children: [
            { id: 'blogs', title: 'Journal & Blogs', href: '/admin/blogs', icon: <PenTool size={14}/> },
            { id: 'quotes', title: 'Quotes Archive', href: '/admin/quotes', icon: <Quote size={14}/> },
        ],
    },

    // SECTIONS (Homepage Blocks)
    {
        id: 'sections',
        title: 'Page Sections',
        icon: <Layers size={18} />,
        children: [
            { id: 'hero', title: 'Hero Section', href: '/admin/hero' },
            { id: 'about', title: 'About Me', href: '/admin/about' },
            { id: 'services', title: 'Services', href: '/admin/services' },
            { id: 'expertise', title: 'Expertise', href: '/admin/expertise' },
            { id: 'contact', title: 'Contact Info', href: '/admin/contact' },
        ],
    },

    // PAGES (Standalone Pages)
    {
        id: 'pages',
        title: 'Standalone Pages',
        icon: <LayoutTemplate size={18} />,
        children: [
            { id: 'journey', title: 'My Journey', href: '/admin/my-journey' },
            { id: 'build', title: 'Build / Projects', href: '/admin/build' },
            { id: 'wall', title: 'Wall of Love', href: '/admin/wall' },
            { id: 'vcard', title: 'Digital VCard', href: '/admin/vcard' },
        ],
    },

    // MEDIA
    {
        id: 'media',
        title: 'Media Library',
        icon: <ImageIcon size={18} />,
        children: [
            { id: 'gallery', title: 'Gallery Assets', href: '/admin/media' },
        ],
    },

    // USERS (Community)
    {
        id: 'users',
        title: 'Community',
        icon: <Users size={18} />,
        children: [
            { id: 'testimonials', title: 'Testimonials', href: '/admin/testimonials', icon: <Quote size={14}/> },
            { id: 'enquiries', title: 'Enquiries', href: '/admin/enquiries' },
            { id: 'subscribers', title: 'Subscribers', href: '/admin/subscribers' },
        ],
    },

    // SETTINGS
    {
        id: 'settings',
        title: 'Configuration',
        icon: <Settings size={18} />,
        children: [
            { id: 'navigation', title: 'Main Navigation', href: '/admin/navigation' },
            { id: 'footer', title: 'Footer Links', href: '/admin/footer' },
            { id: 'site-settings', title: 'Global Settings', href: '/admin/settings' },
        ],
    },
];

export default function AdminSidebar({ onSearch }: { onSearch?: () => void }) {
    const pathname = usePathname() || '';
    const [open, setOpen] = useState<Record<string, boolean>>({ content: true, sections: false });
    const [mobileOpen, setMobileOpen] = useState(false);

    function toggle(id: string) {
        setOpen((s) => ({ ...s, [id]: !s[id] }));
    }

    function isActive(href?: string) {
        if (!href) return false;
        return pathname === href || pathname.startsWith(href + '/');
    }

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            localStorage.removeItem('admin_token');
            window.location.href = '/auth/login';
        } catch {
            window.location.href = '/auth/login';
        }
    };

    return (
        <>
            {/* Custom Scrollbar CSS */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(250, 240, 230, 0.05); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(250, 240, 230, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(242, 167, 167, 0.5); }
            `}</style>

            {/* MOBILE TOGGLE */}
            <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-[#3B241A] text-[#FAF0E6] flex items-center justify-between px-4 py-3 border-b border-[#FAF0E6]/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#3B241A] flex items-center justify-center">
                        <span className="font-serif font-bold text-sm">I</span>
                    </div>
                    <div className="leading-tight">
                        <p className="text-[11px] font-bold tracking-widest uppercase ">Isha Rani</p>
                        <p className="text-[10px] opacity-60">Administrator</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onSearch?.()}
                        className="p-2 rounded-md hover:bg-[#FAF0E6]/10 transition-colors"
                        title="Search (⌘K)"
                    >
                        <Search size={18} />
                    </button>
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="p-2 rounded-md hover:bg-[#FAF0E6]/10"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* MAIN SIDEBAR */}
            <aside
                className={`
                    fixed lg:sticky top-0 h-screen z-50
                    w-72 lg:w-64 flex-shrink-0 flex flex-col
                    bg-[#3B241A] text-[#FAF0E6] shadow-2xl transition-transform duration-300 ease-in-out font-sans
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* MOBILE HEADER INSIDE SIDEBAR (when open) */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#FAF0E6]/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#3B241A] flex items-center justify-center">
                            <span className="font-serif font-bold text-sm">I</span>
                        </div>
                        <div className="leading-tight">
                            <p className="text-[11px] font-bold tracking-widest uppercase">Isha Rani</p>
                            <p className="text-[10px] opacity-60">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onSearch?.()}
                        className="p-2 rounded-md hover:bg-[#FAF0E6]/10"
                        title="Search"
                    >
                        <Search size={18} />
                    </button>
                </div>

                {/* HEADER (DESKTOP) */}
                <div className="p-6 border-b border-[#FAF0E6]/10 hidden lg:block flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#FAF0E6] text-[#3B241A] flex items-center justify-center shadow-md">
                            <span className="font-serif font-bold text-xl">I</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-sm tracking-widest uppercase text-[#FAF0E6]">Isha Rani</h2>
                            <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest text-[#FAF0E6] mt-0.5">Administrator</p>
                        </div>
                    </div>

                    {/* DESKTOP SEARCH BAR */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search pages..."
                            className="w-full bg-[#2F1E17]/60 text-[#FAF0E6] placeholder-[#FAF0E6]/60 border border-[#FAF0E6]/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#F2A7A7]"
                            onFocus={() => onSearch?.()}
                            onKeyDown={(e) => { if (e.key === 'Enter') onSearch?.(); }}
                        />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FAF0E6]/60 pointer-events-none" />
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-2 pb-4">
                        {MENU.map((item) => (
                            <li key={item.id}>
                                {item.children ? (
                                    /* PARENT ITEM */
                                    <div className="rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggle(item.id)}
                                            className={`
                                                w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                                ${isActive(item.href) || open[item.id]
                                                ? 'bg-[#FAF0E6]/5 text-[#F2A7A7]'
                                                : 'text-[#FAF0E6]/70 hover:bg-[#FAF0E6]/5 hover:text-[#FAF0E6]'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Icon with fixed width for alignment */}
                                                <span className="w-5 flex justify-center">{item.icon}</span>
                                                <span className="text-sm font-semibold tracking-wide">{item.title}</span>
                                            </div>
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-300 ${open[item.id] ? 'rotate-180' : ''} opacity-50 group-hover:opacity-100`}
                                            />
                                        </button>

                                        {/* SUBMENU */}
                                        <div
                                            className={`
                                                overflow-hidden transition-all duration-300 ease-in-out
                                                ${open[item.id] ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
                                            `}
                                        >
                                            <ul className="pl-4 space-y-1">
                                                {item.children.map((sub) => (
                                                    <li key={sub.id}>
                                                        <Link
                                                            href={sub.href || '#'}
                                                            onClick={() => setMobileOpen(false)}
                                                            className={`
                                                                flex items-center gap-3 px-4 py-2.5 rounded-md text-[13px] font-medium transition-colors border-l-2 ml-2
                                                                ${isActive(sub.href)
                                                                ? 'border-[#F2A7A7] bg-[#FAF0E6]/10 text-[#F2A7A7]'
                                                                : 'border-transparent text-[#FAF0E6]/50 hover:text-[#FAF0E6] hover:bg-[#FAF0E6]/5'}
                                                            `}
                                                        >
                                                            {/* Optional sub-icon or bullet */}
                                                            {sub.icon ? <span className="opacity-70">{sub.icon}</span> : <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />}
                                                            <span>{sub.title}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    /* SINGLE LINK */
                                    <Link
                                        href={item.href || '#'}
                                        onClick={() => setMobileOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                            ${isActive(item.href)
                                            ? 'bg-[#FAF0E6]/10 text-[#F2A7A7] font-bold shadow-sm'
                                            : 'text-[#FAF0E6]/70 hover:bg-[#FAF0E6]/5 hover:text-[#FAF0E6]'}
                                        `}
                                    >
                                        <span className="w-5 flex justify-center">{item.icon}</span>
                                        <span className="text-sm font-semibold tracking-wide">{item.title}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* FOOTER */}
                <div className="p-6 border-t border-[#FAF0E6]/10 space-y-3 bg-[#3B241A] flex-shrink-0">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#FAF0E6]/40 hover:text-[#FAF0E6] transition-colors"
                    >
                        <ExternalLink size={14} />
                        Back to Site
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAF0E6]/5 text-[#F2A7A7] hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-all duration-300 text-sm font-bold shadow-sm"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}