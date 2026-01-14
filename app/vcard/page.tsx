"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Download,
    Share2,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    QrCode,
    X,
    ArrowUpRight,
    Copy,
    Check,
    Sparkles,
    Palette, // Fallback icon
    Github,
    Facebook
} from 'lucide-react';

// --- 1. MOCK BACKEND DATA (JSON) ---
const userData = {
    profile: {
        name: "Isha Rani",
        role: "Digital Creator & Designer",
        email: "me@isharani.in",
        phone: "+91 98765 43210",
        location: "Patna, India", // Updated for better map accuracy
        websiteDisplay: "isharani.in",
        websiteUrl: "https://isharani.in",
        avatar: "/isha_a.png",
        status: "Available",
        yearsExp: "5+"
    },
    services: [
        "UI/UX Design", "•", "Brand Identity", "•", "Web Development", "•", "Motion Graphics", "•"
    ],
    tools: [
        { name: "Figma", color: "bg-[#1E1E1E]" },
        { name: "Ps", color: "bg-[#31A8FF]" },
        { name: "Ai", color: "bg-[#FF9A00]" },
        { name: "Pr", color: "bg-[#9999FF]" },
        { name: "Xd", color: "bg-[#FF61F6]" }
    ],
    latestProject: {
        title: "Neon Brand Identity",
        subtitle: "Rebranding • 2026",
        image: "/isha_a.png",
        link: "https://behance.net/your-project-link"
    },
    socials: [
        { id: "instagram", url: "#", label: "Instagram" },
        { id: "linkedin", url: "#", label: "LinkedIn" },
        { id: "twitter", url: "#", label: "Twitter" },
        { id: "youtube", url: "#", label: "YouTube" }
    ]
};

// --- 2. CONFIGURATION HELPER ---
const getSocialConfig = (id: string) => {
    switch (id) {
        case 'instagram': return { icon: Instagram, bg: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500" };
        case 'linkedin': return { icon: Linkedin, bg: "bg-[#0077B5]" };
        case 'twitter': return { icon: Twitter, bg: "bg-black" };
        case 'youtube': return { icon: Youtube, bg: "bg-[#FF0000]" };
        case 'github': return { icon: Github, bg: "bg-[#333]" };
        case 'facebook': return { icon: Facebook, bg: "bg-[#1877F2]" };
        default: return { icon: Globe, bg: "bg-gray-400" };
    }
};

export default function UltimateVCard() {
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState("");

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center p-4 py-10 relative font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A] overflow-x-hidden">

            {/* --- BACKGROUND FX --- */}
            <div className="fixed inset-0 pointer-events-none opacity-30 mix-blend-multiply z-0"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Ambient Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#F2A7A7]/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3B241A]/10 rounded-full blur-[100px]" />
            </div>

            {/* --- MAIN CARD --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="w-full max-w-[400px] bg-white/60 backdrop-blur-xl border border-white/80 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(59,36,26,0.15)] overflow-hidden relative z-10 h-auto"
            >
                {/* Main Content Padding Wrapper */}
                <div className="pb-32">

                    {/* QR TOGGLE BUTTON */}
                    <div className="absolute top-6 right-6 z-30">
                        <button
                            onClick={() => setShowQR(!showQR)}
                            className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform text-[#3B241A] border border-white"
                        >
                            <AnimatePresence mode="wait">
                                {showQR ? (
                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                        <X size={18} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="qr" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                        <QrCode size={18} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>

                    {/* 1. HEADER & PROFILE */}
                    <div className="relative pt-12 pb-2 px-6 flex flex-col items-center text-center">

                        {/* Profile/QR Flip */}
                        <div className="relative w-32 h-32 mb-5 perspective-1000">
                            <motion.div
                                className="w-full h-full relative preserve-3d transition-transform duration-700"
                                animate={{ rotateY: showQR ? 180 : 0 }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Front */}
                                <div className="absolute inset-0 backface-hidden">
                                    <div className="w-full h-full rounded-full p-1 bg-gradient-to-bl from-[#F2A7A7] to-[#3B241A] shadow-lg">
                                        <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden bg-[#F2E4D8]">
                                            <img src={userData.profile.avatar} alt={userData.profile.name} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md z-10 border border-gray-100">
                                        <Sparkles size={14} className="text-[#F2A7A7] fill-[#F2A7A7]" />
                                    </div>
                                </div>
                                {/* Back */}
                                <div
                                    className="absolute inset-0 backface-hidden rounded-full bg-white flex items-center justify-center border border-[#3B241A]/10 shadow-inner"
                                    style={{ transform: "rotateY(180deg)" }}
                                >
                                    <QrCode size={64} className="text-[#3B241A]" />
                                </div>
                            </motion.div>
                        </div>

                        <h1 className="text-3xl font-serif font-bold text-[#3B241A] tracking-tight">{userData.profile.name}</h1>
                        <p className="text-[#6E5045] font-medium text-sm mt-1 opacity-90">{userData.profile.role}</p>

                        {/* Availability Pill */}
                        <div className="mt-3 px-3 py-1 rounded-full bg-[#3B241A]/5 border border-[#3B241A]/5 flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-[#3B241A]/70 uppercase tracking-widest">{userData.profile.status}</span>
                        </div>
                    </div>

                    {/* 2. SCROLLING MARQUEE (Services) */}
                    <div
                        className="w-full overflow-hidden py-4 opacity-70 relative"
                        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
                    >
                        <motion.div
                            className="flex whitespace-nowrap"
                            animate={{ x: [0, -200] }}
                            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                        >
                            {[...userData.services, ...userData.services, ...userData.services].map((item, i) => (
                                <span key={i} className="mx-3 text-xs font-bold uppercase tracking-widest text-[#3B241A]">{item}</span>
                            ))}
                        </motion.div>
                    </div>

                    {/* 3. BENTO GRID CONTENT */}
                    <div className="px-5 space-y-3">

                        {/* ROW 1: Contact (Email & Phone) */}
                        <div className="grid grid-cols-2 gap-3">
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCopy(userData.profile.email, "email")}
                                className="bg-white p-4 rounded-[1.5rem] flex flex-col justify-between h-28 border border-transparent hover:border-[#F2A7A7]/30 shadow-sm cursor-pointer relative overflow-hidden group"
                            >
                                <div className="absolute top-3 right-3 text-[#F2A7A7] opacity-0 group-hover:opacity-100 transition-opacity">
                                    {copied === "email" ? <Check size={14} /> : <Copy size={14} />}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#3B241A]">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#A68B7E] uppercase font-bold mb-0.5">Write me</p>
                                    <p className="text-[#3B241A] font-bold text-xs break-all leading-tight">{userData.profile.email}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCopy(userData.profile.phone, "phone")}
                                className="bg-white p-4 rounded-[1.5rem] flex flex-col justify-between h-28 border border-transparent hover:border-[#F2A7A7]/30 shadow-sm cursor-pointer relative overflow-hidden group"
                            >
                                <div className="absolute top-3 right-3 text-[#F2A7A7] opacity-0 group-hover:opacity-100 transition-opacity">
                                    {copied === "phone" ? <Check size={14} /> : <Copy size={14} />}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#3B241A]">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#A68B7E] uppercase font-bold mb-0.5">Call me</p>
                                    <p className="text-[#3B241A] font-bold text-xs break-words leading-tight">{userData.profile.phone}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* ROW 2: Tools Stack (Full Width) */}
                        <div className="bg-white rounded-[1.5rem] p-3 flex items-center justify-between px-5 shadow-sm border border-gray-100 h-16">
                            <div className="flex -space-x-2">
                                {userData.tools.map((tool, i) => (
                                    <div key={i} className={`w-9 h-9 rounded-full ${tool.color} border-2 border-white flex items-center justify-center text-[9px] font-bold text-white`}>
                                        {tool.name.substring(0, 2)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-[#A68B7E] uppercase font-bold">My Stack</p>
                                <p className="text-xs font-bold text-[#3B241A]">Toolkit</p>
                            </div>
                        </div>

                        {/* ROW 3: Latest Work (Dynamic) */}
                        <a href={userData.latestProject.link} target="_blank" rel="noopener noreferrer">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="w-full h-32 rounded-[1.5rem] relative overflow-hidden group cursor-pointer shadow-sm mt-3"
                            >
                                {/* DYNAMIC IMAGE */}
                                <img src={userData.latestProject.image} alt={userData.latestProject.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#3B241A]/90 via-transparent to-transparent flex flex-col justify-end p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {/* DYNAMIC TEXT */}
                                            <p className="text-[#FAF0E6] font-bold text-sm">{userData.latestProject.title}</p>
                                            <p className="text-[#FAF0E6]/70 text-[10px]">{userData.latestProject.subtitle}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                            <ArrowUpRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </a>

                        {/* ROW 4: Location & Website (Slim) */}
                        <div className="flex gap-3 mt-3">
                            {/* UPDATED: Clickable Location opening Google Maps */}
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userData.profile.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 h-14 bg-white rounded-[1.2rem] flex items-center justify-center gap-2 border border-gray-100 shadow-sm hover:border-[#F2A7A7] transition-colors cursor-pointer"
                            >
                                <MapPin size={14} className="text-[#F2A7A7]" />
                                <span className="text-xs font-bold text-[#3B241A]">{userData.profile.location}</span>
                            </a>

                            <a href={userData.profile.websiteUrl} target="_blank" className="flex-1 h-14 bg-white rounded-[1.2rem] flex items-center justify-center gap-2 border border-gray-100 shadow-sm hover:border-[#F2A7A7] transition-colors">
                                <Globe size={14} className="text-[#F2A7A7]" />
                                <span className="text-xs font-bold text-[#3B241A]">Portfolio</span>
                            </a>
                        </div>

                        {/* ROW 5: Social Dock */}
                        <div className="bg-white/50 border border-white/60 rounded-[1.5rem] p-2 flex justify-between items-center shadow-sm mt-3">
                            {userData.socials.map((social, index) => {
                                const config = getSocialConfig(social.id);
                                const Icon = config.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        whileHover={{ y: -3, scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`w-12 h-12 rounded-2xl ${config.bg} text-white flex items-center justify-center shadow-md transition-shadow hover:shadow-lg`}
                                    >
                                        <Icon size={20} />
                                    </motion.a>
                                )
                            })}
                        </div>

                    </div>
                </div>

                {/* FLOATING SAVE BUTTON (Gradient Style) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF0E6] via-[#FAF0E6]/90 to-transparent pt-12 z-20 rounded-b-[3rem]">
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 35px -10px rgba(242, 167, 167, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-[#F2A7A7] to-[#d68c8c] text-white h-14 rounded-full font-bold text-lg shadow-[0_10px_30px_-10px_rgba(242,167,167,0.6)] flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                        <Download size={20} />
                        <span className="tracking-wide">Save Contact</span>
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
}