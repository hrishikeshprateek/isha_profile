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
    Check
} from 'lucide-react';

const socialLinks = [
    { icon: Instagram, href: "#", bg: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500", label: "Instagram" },
    { icon: Linkedin, href: "#", bg: "bg-[#0077B5]", label: "LinkedIn" },
    { icon: Twitter, href: "#", bg: "bg-black", label: "Twitter" },
    { icon: Youtube, href: "#", bg: "bg-[#FF0000]", label: "YouTube" }
];

export default function PremiumVCard() {
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState("");

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* --- BACKGROUND FX --- */}
            <div className="fixed inset-0 pointer-events-none opacity-40"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")` }}>
            </div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#F2A7A7]/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3B241A]/10 rounded-full blur-[100px]" />
            </div>

            {/* --- MAIN CARD --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full max-w-[400px] bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(59,36,26,0.1)] overflow-hidden relative z-10 pb-24"
            >

                {/* TOP BAR ACTIONS */}
                <div className="absolute top-6 right-6 z-20">
                    <button
                        onClick={() => setShowQR(!showQR)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-[#3B241A]"
                    >
                        <AnimatePresence mode="wait">
                            {showQR ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                    <X size={20} />
                                </motion.div>
                            ) : (
                                <motion.div key="qr" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                    <QrCode size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                {/* 1. HEADER SECTION */}
                <div className="relative pt-12 pb-6 px-6 flex flex-col items-center text-center">

                    {/* Flip Container for Profile/QR */}
                    <div className="relative w-36 h-36 mb-6 perspective-1000">
                        <motion.div
                            className="w-full h-full relative preserve-3d transition-transform duration-700"
                            animate={{ rotateY: showQR ? 180 : 0 }}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {/* Front: Profile Pic */}
                            <div className="absolute inset-0 backface-hidden">
                                <div className="w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-[#F2A7A7] to-[#3B241A]">
                                    <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-[#F2E4D8]">
                                        <img src="/isha_a.png" alt="Isha" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md z-10">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                </div>
                            </div>

                            {/* Back: QR Code */}
                            <div
                                className="absolute inset-0 backface-hidden rounded-3xl bg-white flex items-center justify-center shadow-inner border border-[#3B241A]/5"
                                style={{ transform: "rotateY(180deg)" }}
                            >
                                <QrCode size={80} className="text-[#3B241A]" />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h1 className="text-3xl font-serif font-bold text-[#3B241A]">Isha Rani</h1>
                        <p className="text-[#6E5045] font-medium text-sm mt-1 mb-4 opacity-80">
                            UI/UX Designer & Content Creator
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B241A]/5 border border-[#3B241A]/5 text-[#3B241A] text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F2A7A7]" /> Available for work
                        </div>
                    </motion.div>
                </div>

                {/* 2. BENTO GRID */}
                <div className="px-5 space-y-3">

                    {/* Row 1: Contact Methods */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Email Widget */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCopy("hello@isharani.com", "email")}
                            className="col-span-1 bg-[#FDF6F0] p-4 rounded-[1.5rem] flex flex-col justify-between h-32 cursor-pointer border border-[#F2A7A7]/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#F2A7A7]">
                                {copied === "email" ? <Check size={16} /> : <Copy size={16} />}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#3B241A] shadow-sm">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-[#A68B7E] uppercase font-bold mb-0.5">Email</p>
                                {/* CHANGED: Removed truncate, added break-all and tight leading for wrapping */}
                                <p className="text-[#3B241A] font-bold text-xs sm:text-sm break-all leading-tight">
                                    hello@isharani.com
                                </p>
                            </div>
                        </motion.div>

                        {/* Phone Widget */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCopy("+919876543210", "phone")}
                            className="col-span-1 bg-white p-4 rounded-[1.5rem] flex flex-col justify-between h-32 cursor-pointer border border-[#3B241A]/5 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#3B241A]">
                                {copied === "phone" ? <Check size={16} /> : <Copy size={16} />}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#3B241A]">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-[#A68B7E] uppercase font-bold mb-0.5">Phone</p>
                                {/* CHANGED: Removed truncate, added break-words */}
                                <p className="text-[#3B241A] font-bold text-xs sm:text-sm break-words leading-tight">
                                    +91 98765 43210
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Row 2: Location (Visual) */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="w-full h-24 bg-[#3B241A] rounded-[1.5rem] relative overflow-hidden flex items-center justify-between px-6 text-[#FAF0E6] cursor-pointer"
                    >
                        {/* Abstract Map Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                        <div className="relative z-10">
                            <p className="text-[10px] opacity-60 uppercase font-bold mb-1">Based In</p>
                            <p className="text-xl font-serif font-bold">Mumbai, India</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center relative z-10 border border-white/20">
                            <MapPin size={18} className="text-[#F2A7A7]" />
                        </div>
                    </motion.div>

                    {/* Row 3: Website & Portfolio */}
                    <motion.a
                        href="https://isharani.com"
                        target="_blank"
                        whileHover={{ scale: 1.01 }}
                        className="block w-full h-20 bg-gradient-to-r from-[#F2A7A7] to-[#E8A0A0] rounded-[1.5rem] relative overflow-hidden px-6 flex items-center justify-between text-white shadow-lg shadow-pink-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Globe size={20} />
                            </div>
                            <div>
                                <p className="font-bold">Visit Portfolio</p>
                                <p className="text-xs opacity-80">isharani.com</p>
                            </div>
                        </div>
                        <ArrowUpRight size={20} />
                    </motion.a>

                    {/* Row 4: Social Dock */}
                    <div className="bg-white/50 border border-white/60 rounded-[1.5rem] p-2 flex justify-between items-center">
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.href}
                                whileHover={{ y: -5, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-12 h-12 rounded-2xl ${social.bg} text-white flex items-center justify-center shadow-md transition-shadow hover:shadow-lg`}
                            >
                                <social.icon size={20} />
                            </motion.a>
                        ))}
                    </div>

                </div>

                {/* 3. FLOATING ACTION DOCK (Sticky Bottom) */}
                <div className="absolute bottom-6 left-0 right-0 px-6 z-50">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-[#3B241A] text-[#FAF0E6] h-14 rounded-2xl font-bold text-lg shadow-xl shadow-[#3B241A]/20 flex items-center justify-center gap-3"
                    >
                        <Download size={20} />
                        Save Contact
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
}