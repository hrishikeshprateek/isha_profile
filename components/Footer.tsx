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
    Zap
} from "lucide-react";
import {useRouter} from "next/navigation";


// Scrolling Marquee Component
const Marquee = () => {
    const marqueeContent = (
        <div className="flex items-center gap-8 px-4">
      <span className="text-[#3B241A] font-bold text-sm uppercase tracking-widest">
        OPEN FOR COLLABORATIONS
      </span>
            <span className="text-[#3B241A]/40">•</span>
            <span className="text-[#3B241A] font-bold text-sm uppercase tracking-widest">
        UI/UX DESIGN
      </span>
            <span className="text-[#3B241A]/40">•</span>
            <span className="text-[#3B241A] font-bold text-sm uppercase tracking-widest">
        CONTENT CREATION
      </span>
            <span className="text-[#3B241A]/40">•</span>
            <span className="text-[#3B241A] font-bold text-sm uppercase tracking-widest">
        BRAND STRATEGY
      </span>
            <span className="text-[#3B241A]/40">•</span>
        </div>
    );

    return (
        <div className="bg-[#F2A7A7] overflow-hidden py-3 select-none border-b border-[#3B241A]/10">
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

    return (
        <footer className="bg-[#1A0F08] text-[#FAF0E6] flex flex-col">
            <Marquee />

            <div className="container mx-auto px-4 py-10">

                {/* Main Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 items-stretch">

                    {/* A. BIG CTA CARD (Left) */}
                    <div className="md:col-span-7 bg-[#23150F] rounded-3xl p-8 flex flex-col justify-between border border-white/5 relative overflow-hidden group min-h-[320px]">

                        {/* Background Hover Effect */}
                        <div className="absolute right-0 top-0 w-64 h-64 bg-[#F2A7A7]/10 rounded-full blur-[80px] group-hover:bg-[#F2A7A7]/20 transition-colors duration-500 pointer-events-none" />

                        <div className="relative z-10">
                            {/* FIX: Added !text-[#FAF0E6] to force light color override */}
                            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4 !text-[#FAF0E6]">
                                Have an idea? <br />
                                <span className="text-[#F2A7A7] italic">Let&#39;s build it.</span>
                            </h2>
                            <p className="text-[#A68B7E] text-sm md:text-base max-w-sm mb-6 leading-relaxed">
                                Turning concepts into polished digital experiences. I am currently available for freelance projects.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-wrap gap-3 mt-auto">
                            <a
                                href="mailto:me@isharani.in"
                                className="flex items-center gap-2 px-6 py-3 bg-[#FAF0E6] text-[#3B241A] rounded-full font-bold hover:bg-[#F2A7A7] transition-all duration-300 shadow-lg active:scale-95 text-sm"
                            >
                                <Mail size={16} />
                                Email Me
                            </a>
                            <button onClick={() => {
                                router.push('/build')
                            }} className="flex items-center gap-2 px-6 py-3 bg-[#F2A7A7] text-[#3B241A] rounded-full font-bold hover:bg-[#FAF0E6] transition-all duration-300 shadow-lg active:scale-95 text-sm">
                                <Zap size={16} fill="currentColor" />
                                Let&#39;s Build!
                            </button>
                        </div>
                    </div>

                    {/* B. RIGHT COLUMN (Newsletter & Socials) */}
                    <div className="md:col-span-5 flex flex-col gap-4">

                        {/* 1. Newsletter Widget (Expanded) */}
                        <div className="bg-[#23150F] rounded-3xl p-8 border border-white/5 flex flex-col justify-center flex-grow">
                            <div className="mb-6">
                                {/* FIX: Added !text-[#FAF0E6] to force light color override */}
                                <h3 className="font-bold text-xl !text-[#FAF0E6] mb-2">The Newsletter</h3>
                                <p className="text-[#A68B7E] text-sm leading-relaxed">
                                    Join my inner circle of creators. I share exclusive design resources, behind-the-scenes process breakdowns, and actionable tips to help you level up your brand—delivered straight to your inbox.
                                </p>
                            </div>

                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2A7A7]/50 focus:bg-white/10 transition-colors text-[#FAF0E6] placeholder:text-[#A68B7E]/50"
                                />
                                <button className="bg-[#F2A7A7] text-[#3B241A] px-4 py-3 rounded-xl hover:bg-white transition-colors">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>

                        {/* 2. Socials & LinkTree Row */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    title={social.name}
                                    className="w-14 h-14 bg-[#23150F] hover:bg-[#2A1810] border border-white/5 hover:border-[#F2A7A7]/50 rounded-full transition-all duration-300 flex items-center justify-center text-[#A68B7E] hover:text-[#F2A7A7] group"
                                >
                                    <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}

                            <Link
                                href="/links"
                                className="h-14 px-6 bg-[#F2A7A7] rounded-full flex items-center justify-center font-bold text-[#3B241A] hover:bg-white transition-colors text-xs uppercase tracking-wide gap-2 ml-auto flex-grow md:flex-grow-0"
                            >
                                Link Tree
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/5 gap-4">
                    <div className="flex items-center gap-2 text-[#A68B7E] text-xs">
                        <Copyright size={12} />
                        <span>{currentYear} Isha Rani. All rights reserved.</span>
                    </div>

                    <nav className="flex gap-6 text-xs font-medium tracking-wide">
                        {["Home", "Work", "Services", "Blog"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="text-[#FAF0E6] hover:text-[#F2A7A7] transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#F2A7A7] group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>
                </div>

            </div>
        </footer>
    );
}