"use client";

import { Button } from "@/components/ui/button";
import { X, Menu, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
    label: string;
    href: string;
}

interface ToolbarProps {
    title?: string;
    showBackButton?: boolean;
    backHref?: string;
    navItems?: NavItem[]; // Optional prop
    showContactButton?: boolean;
    logoText?: string;
    logoTitle?: string;
    tagline?: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Services", href: "#service" },
    { label: "Blogs", href: "/blogs" },
    { label: "Quotes", href: "/quotes" },
    { label: "Build", href: "/build" },
];

const Toolbar = ({
                     title = "Back",
                     showBackButton = false,
                     backHref = "/",
                     navItems = DEFAULT_NAV_ITEMS, // Fallback to defaults here
                     showContactButton = true,
                     logoText = "IR",
                     logoTitle = "ISHA RANI",
                     tagline = "Content Creator",
                 }: ToolbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Always use DEFAULT_NAV_ITEMS for rendering menu
    const safeNavItems = DEFAULT_NAV_ITEMS;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-5xl">
            {/* --- Main Navigation Shell --- */}
            <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between shadow-xl shadow-[#3B241A]/5">

                {/* Left Section: Branding */}
                <div className="flex items-center flex-shrink-0 min-w-[100px]">
                    {showBackButton ? (
                        <Link
                            href={backHref || "/"}
                            className="group flex items-center gap-2 text-[#3B241A] hover:text-[#DC7C7C] transition-all"
                        >
                            <div className="p-2 rounded-full group-hover:bg-[#F2A7A7]/10 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="hidden sm:inline text-sm font-bold tracking-tight">{title}</span>
                        </Link>
                    ) : (
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full border border-[#F2A7A7]/30 flex items-center justify-center bg-white shadow-sm group-hover:border-[#F2A7A7] transition-all">
                                <span className="text-[#3B241A] font-serif font-bold text-lg">{logoText}</span>
                            </div>
                            <div className="hidden sm:flex flex-col leading-tight">
                                <span className="text-xs font-black text-[#3B241A] uppercase tracking-tighter">{logoTitle}</span>
                                <span className="text-[10px] text-[#A68B7E] font-medium uppercase tracking-widest">{tagline}</span>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Center Section: Desktop Navigation Links */}
                <div className="flex items-center gap-1 lg:gap-2 flex-grow justify-center">
                    {safeNavItems.length === 0 && (
                        <span className="text-red-600 font-bold">DEBUG: No menu items found</span>
                    )}
                    {safeNavItems.map((item, index) => {
                        if (!item.href || !item.label) return null;

                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={`desktop-nav-${item.href}-${index}`}
                                href={item.href}
                                className={`px-3 lg:px-4 py-2 text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all rounded-full hover:text-[#DC7C7C] ${
                                    isActive
                                        ? "text-[#3B241A] bg-[#F2A7A7]/15"
                                        : "text-[#A68B7E]"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Section: CTA & Mobile Menu Trigger */}
                <div className="flex items-center gap-2 flex-shrink-0 min-w-[100px] justify-end">
                    {showContactButton && (
                        <Button
                            onClick={() => router.push("/vcard")}
                            className="hidden md:flex bg-[#3B241A] hover:bg-[#2A1810] text-white rounded-full px-5 text-[10px] font-bold uppercase tracking-widest h-9 transition-all active:scale-95 shadow-lg shadow-[#3B241A]/10"
                        >
                            Vcard
                        </Button>
                    )}

                    <button
                        className="md:hidden p-2 rounded-full text-[#3B241A] hover:bg-[#F2A7A7]/10 transition-colors"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* --- Mobile Menu Drawer --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="md:hidden absolute top-full left-0 right-0 mt-3 p-3 rounded-[2.5rem] bg-white/95 backdrop-blur-lg shadow-2xl border border-[#F2A7A7]/20 z-[-1]"
                    >
                        <div className="flex flex-col gap-1 p-2">
                            {safeNavItems.map((item, index) => {
                                if (!item.href || !item.label) return null;

                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={`mobile-nav-${item.href}-${index}`}
                                        href={item.href}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center justify-between px-6 py-4 rounded-[1.5rem] text-sm font-bold uppercase tracking-widest transition-all ${
                                            isActive
                                                ? "bg-[#F2A7A7]/15 text-[#3B241A]"
                                                : "text-[#A68B7E] hover:bg-[#F2A7A7]/5"
                                        }`}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeDot"
                                                className="w-1.5 h-1.5 rounded-full bg-[#DC7C7C]"
                                            />
                                        )}
                                    </Link>
                                );
                            })}

                            <div className="mt-4 pt-4 border-t border-slate-100 px-2">
                                <Button
                                    onClick={() => {
                                        router.push("/vcard");
                                        closeMobileMenu();
                                    }}
                                    className="w-full bg-[#3B241A] hover:bg-[#2A1810] text-white py-7 rounded-[1.5rem] font-bold uppercase tracking-widest text-xs transition-all active:scale-95"
                                >
                                    Download Vcard
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Toolbar;