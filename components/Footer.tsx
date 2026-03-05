"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Instagram,
    Linkedin,
    Github,
    Mail,
    ArrowUpRight,
    Copyright,
    Send,
    Zap,
    Phone,
    MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";

// Scrolling Marquee Component
const Marquee = () => {
    const marqueeContent = (
        <div className="flex items-center gap-8 px-4">
            <span className="text-[#3B241A] font-bold text-base uppercase tracking-widest">
                OPEN FOR COLLABORATIONS
            </span>
            <span className="text-[#3B241A]/40">•</span>
            <span className="text-[#3B241A] font-bold text-base uppercase tracking-widest">
                UI/UX DESIGN
            </span>
            <span className="text-[#3B241A]/40">•</span>
            <span className="text-[#3B241A] font-bold text-base uppercase tracking-widest">
                CONTENT CREATION
            </span>
            <span className="text-[#3B241A]/40">•</span>
            <span className="text-[#3B241A] font-bold text-base uppercase tracking-widest">
                BRAND STRATEGY
            </span>
            <span className="text-[#3B241A]/40">•</span>
        </div>
    );

    return (
        <div className="bg-[#F2A7A7] overflow-hidden py-2.5 select-none border-b border-[#3B241A]/10">
            <div className="flex whitespace-nowrap overflow-hidden">
                <motion.div
                    className="flex"
                    animate={{ x: "-50%" }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                >
                    {marqueeContent}
                    {marqueeContent}
                    {marqueeContent}
                    {marqueeContent}
                </motion.div>
            </div>
        </div>
    );
};

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const router = useRouter();

    const socialLinks = [
        { name: "Instagram", icon: Instagram, href: "#" },
        { name: "LinkedIn", icon: Linkedin, href: "#" },
        { name: "GitHub", icon: Github, href: "#" },
    ];

    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = React.useState('');

    async function handleSubscribe(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        try {
            setStatus('loading');
            setMessage('');
            const res = await fetch('/api/subscribers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'footer' }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatus('success');
                setMessage(data.message || 'Check your email!');
                setEmail('');
                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Subscription failed');
                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                }, 3000);
            }
        } catch (_err) {
            setStatus('error');
            setMessage('Subscription failed. Try again.');
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);
        }
    }

    return (
        <footer className="bg-[#1A0F08] text-[#FAF0E6] flex flex-col">
            <Marquee />

            <div className="container mx-auto px-6 py-12 md:py-16">

                {/* Main Blended Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_1fr] gap-10 md:gap-6 mb-12">

                    {/* A. LEFT COLUMN (Contact & Location) */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h3 className="font-bold text-xl !text-[#FAF0E6] mb-4">Reach Out</h3>

                            <div className="flex flex-col gap-4">
                                {/* Address */}
                                <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-[#F2A7A7]/10 border border-[#F2A7A7]/20">
                                            <MapPin size={16} className="text-[#F2A7A7]" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm !text-[#FAF0E6] mb-0.5">Address</h3>
                                        <p className="text-[#A68B7E] text-xs leading-relaxed break-words">
                                            24/3 Paijawa, Near Mahadev Asthan, Patna, India Pin code : 800009
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-[#F2A7A7]/10 border border-[#F2A7A7]/20">
                                            <Phone size={16} className="text-[#F2A7A7]" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm !text-[#FAF0E6] mb-0.5">Phone</h3>
                                        <a href="tel:+919876543210" className="text-[#A68B7E] hover:text-[#F2A7A7] text-xs leading-relaxed transition-colors break-all">
                                            +91 98765 43210
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-[#F2A7A7]/10 border border-[#F2A7A7]/20">
                                            <Mail size={16} className="text-[#F2A7A7]" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm !text-[#FAF0E6] mb-0.5">Email</h3>
                                        <a href="mailto:me@isharani.in" className="text-[#A68B7E] hover:text-[#F2A7A7] text-xs leading-relaxed transition-colors break-all">
                                            me@isharani.in
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* B. MIDDLE COLUMN (Big CTA Card) - SWITCHED */}
                    <div className="relative flex flex-col justify-between md:px-2 h-full">

                        {/* Background Hover Effect */}
                        <div className="absolute right-0 top-0 w-48 h-48 bg-[#F2A7A7]/10 rounded-full blur-[60px] transition-colors duration-500 pointer-events-none" />

                        <div className="relative z-10 mb-6">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-3 !text-[#FAF0E6]">
                                Have an idea? <br />
                                <span className="text-[#F2A7A7] italic">Let&#39;s build it.</span>
                            </h2>
                            <p className="text-[#A68B7E] text-sm leading-relaxed max-w-sm">
                                Turning concepts into polished digital experiences. I am currently available for freelance projects.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-wrap gap-2.5 mt-auto">
                            <a
                                href="mailto:me@isharani.in"
                                className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-5 py-2.5 bg-[#FAF0E6] text-[#3B241A] rounded-full font-bold hover:bg-[#F2A7A7] transition-all duration-300 shadow-lg active:scale-95 text-sm whitespace-nowrap"
                            >
                                <Mail size={16} />
                                Email Me
                            </a>
                            <button
                                onClick={() => router.push('/build')}
                                className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-5 py-2.5 bg-[#F2A7A7] text-[#3B241A] rounded-full font-bold hover:bg-[#FAF0E6] transition-all duration-300 shadow-lg active:scale-95 text-sm whitespace-nowrap"
                            >
                                <Zap size={16} fill="currentColor" />
                                Let&#39;s Build!
                            </button>
                        </div>
                    </div>

                    {/* C. RIGHT COLUMN (Newsletter & Socials) - SWITCHED */}
                    <div className="flex flex-col justify-between gap-6">

                        {/* Newsletter Widget */}
                        <div>
                            <div className="mb-4">
                                <h3 className="font-bold text-xl !text-[#FAF0E6] mb-1.5">The Newsletter</h3>
                                <p className="text-[#A68B7E] text-sm leading-relaxed">
                                    Join my inner circle of creators. I share exclusive design resources, process breakdowns, and actionable tips to help you level up your brand.
                                </p>
                            </div>

                            <form className="flex gap-2" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F2A7A7]/50 focus:bg-white/10 transition-colors text-[#FAF0E6] placeholder:text-[#A68B7E]/50"
                                />
                                <button type="submit" disabled={status === 'loading'} className="bg-[#F2A7A7] text-[#3B241A] px-4 py-2.5 rounded-xl hover:bg-white transition-colors disabled:opacity-60 shrink-0">
                                    {status === 'loading' ? '...' : <Send size={18} />}
                                </button>
                            </form>
                            <div className="h-5 mt-1.5">
                                {message && (
                                    <p className={`text-xs uppercase tracking-wider font-bold ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                        {message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Socials & LinkTree Row */}
                        <div className="flex flex-wrap gap-2.5 mt-auto">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    title={social.name}
                                    className="w-11 h-11 bg-[#23150F] hover:bg-[#2A1810] border border-white/5 hover:border-[#F2A7A7]/50 rounded-full transition-all duration-300 flex items-center justify-center text-[#A68B7E] hover:text-[#F2A7A7] group"
                                >
                                    <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}

                            <Link
                                href="/links"
                                className="h-11 px-5 bg-[#F2A7A7] rounded-full flex items-center justify-center font-bold text-[#3B241A] hover:bg-white transition-colors text-xs uppercase tracking-widest gap-1.5 flex-grow sm:flex-grow-0 ml-auto"
                            >
                                Link Tree
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/5 gap-5">
                    <div className="flex items-center gap-2 text-[#A68B7E] text-xs">
                        <Copyright size={12} />
                        <span>{currentYear} Isha Rani. All rights reserved.</span>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-6 text-xs font-medium tracking-wide">
                        <Link
                            href="/my_journey"
                            className="text-[#FAF0E6] hover:text-[#F2A7A7] transition-colors relative group"
                        >
                            Journey
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#F2A7A7] group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Link
                            href="/quotes"
                            className="text-[#FAF0E6] hover:text-[#F2A7A7] transition-colors relative group"
                        >
                            Quotes
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#F2A7A7] group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Link
                            href="/wall"
                            className="text-[#FAF0E6] hover:text-[#F2A7A7] transition-colors relative group"
                        >
                            Wall
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#F2A7A7] group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Link
                            href="/vcard"
                            className="text-[#FAF0E6] hover:text-[#F2A7A7] transition-colors relative group"
                        >
                            VCard
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#F2A7A7] group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Link
                            href="/blogs"
                            className="text-[#FAF0E6] hover:text-[#F2A7A7] transition-colors relative group"
                        >
                            Blog
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#F2A7A7] group-hover:w-full transition-all duration-300" />
                        </Link>
                    </nav>
                </div>

            </div>
        </footer>
    );
}