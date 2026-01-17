"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";

// --- MOCK DATA FOR PREVIEW (With Forced Colors) ---
const PREVIEW_QUOTES = [
    {
        id: 1,
        text: "Design is not just what it looks like. Design is how it works.",
        author: "Steve Jobs",
        // Added ! for forced colors
        color: "!bg-[#FAF0E6]",
        textColor: "!text-[#3B241A]"
    },
    {
        id: 2,
        text: "मंजिलें उन्हीं को मिलती हैं, जिनके सपनों में जान होती है।",
        author: "Mirza Ghalib",
        color: "!bg-[#F2A7A7]",
        textColor: "!text-[#3B241A]"
    },
    {
        id: 3,
        text: "Simplicity is the ultimate sophistication.",
        author: "Da Vinci",
        color: "!bg-[#2A1A12]", // Dark card for contrast
        textColor: "!text-[#FAF0E6]"
    }
];

export default function QuotesPreviewSection() {
    return (
        // Added !bg-[#3B241A] for forced background color
        <section className="py-24 !bg-[#3B241A] relative overflow-hidden">

            {/* Background Ambience (Forced colors) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] !bg-[#F2A7A7]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] !bg-[#F2A7A7]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* 1. LEFT: TEXT CONTENT */}
                    <div className="lg:w-1/2 text-center lg:text-left">

                        {/* "Digital Archive" Pill Removed Here */}

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            // Forced text colors
                            className="text-4xl md:text-6xl font-serif font-bold !text-[#FAF0E6] mb-6 leading-tight"
                        >
                            Words that <br/> <span className="!text-[#F2A7A7] italic">stuck.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            // Forced text color
                            className="!text-[#FAF0E6]/60 text-lg mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed"
                        >
                            A curated collection of thoughts, design principles, and poetry that fuels my creative process.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link
                                href="/quotes"
                                // Forced button colors
                                className="inline-flex items-center gap-3 px-8 py-4 !bg-[#FAF0E6] !text-[#3B241A] rounded-full font-bold hover:!bg-[#F2A7A7] transition-all duration-300 group shadow-xl"
                            >
                                Open Archive
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* 2. RIGHT: THE "FAN" DECK (Visual) */}
                    <div className="lg:w-1/2 w-full flex justify-center lg:justify-end perspective-1000">
                        <div className="relative w-72 h-80 md:w-80 md:h-96 group cursor-pointer">

                            {/* CARD 1 (Back - Rotated Left) */}
                            <motion.div
                                initial={{ rotate: -10, y: 0 }}
                                whileInView={{ rotate: -15, x: -40 }}
                                whileHover={{ rotate: -25, x: -80, y: 10 }}
                                transition={{ duration: 0.4 }}
                                // Forced border color
                                className={`absolute inset-0 rounded-3xl p-8 shadow-2xl !border-white/5 flex flex-col justify-between ${PREVIEW_QUOTES[0].color}`}
                            >
                                <Quote className="text-current opacity-10 rotate-180" size={32} />
                                <p className={`font-serif text-xl font-bold leading-tight ${PREVIEW_QUOTES[0].textColor}`}>
                                    &#34;{PREVIEW_QUOTES[0].text}&#34;
                                </p>
                                <p className={`text-xs font-bold uppercase tracking-widest opacity-60 ${PREVIEW_QUOTES[0].textColor}`}>
                                    {PREVIEW_QUOTES[0].author}
                                </p>
                            </motion.div>

                            {/* CARD 2 (Middle - Rotated Right) */}
                            <motion.div
                                initial={{ rotate: 10, y: 0 }}
                                whileInView={{ rotate: 15, x: 40 }}
                                whileHover={{ rotate: 25, x: 80, y: 10 }}
                                transition={{ duration: 0.4 }}
                                // Forced border color
                                className={`absolute inset-0 rounded-3xl p-8 shadow-2xl !border-white/5 flex flex-col justify-between ${PREVIEW_QUOTES[1].color}`}
                            >
                                <Quote className="text-current opacity-10 rotate-180" size={32} />
                                <p className={`font-serif text-xl font-bold leading-tight ${PREVIEW_QUOTES[1].textColor}`}>
                                    &#34;{PREVIEW_QUOTES[1].text}&#34;
                                </p>
                                <p className={`text-xs font-bold uppercase tracking-widest opacity-60 ${PREVIEW_QUOTES[1].textColor}`}>
                                    {PREVIEW_QUOTES[1].author}
                                </p>
                            </motion.div>

                            {/* CARD 3 (Front - Center) */}
                            <Link href="/quotes" className="block w-full h-full relative z-10">
                                <motion.div
                                    initial={{ rotate: 0, y: 10 }}
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    // Forced border color
                                    className={`w-full h-full rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] !border-white/10 flex flex-col justify-between ${PREVIEW_QUOTES[2].color}`}
                                >
                                    <div className="flex justify-between items-start">
                                        {/* Forced icon color */}
                                        <Quote className="!text-[#F2A7A7] opacity-40 rotate-180" size={32} />
                                        {/* Forced dot color */}
                                        <div className="w-2 h-2 rounded-full !bg-[#F2A7A7]" />
                                    </div>

                                    <p className={`font-serif text-2xl font-bold leading-tight ${PREVIEW_QUOTES[2].textColor}`}>
                                        &#34;{PREVIEW_QUOTES[2].text}&#34;
                                    </p>

                                    {/* Forced border color */}
                                    <div className="flex items-center gap-3 border-t !border-white/10 pt-4">
                            <span className={`text-xs font-bold uppercase tracking-widest ${PREVIEW_QUOTES[2].textColor} opacity-80`}>
                                {PREVIEW_QUOTES[2].author}
                            </span>
                                        {/* Forced arrow circle colors */}
                                        <div className="ml-auto p-1.5 rounded-full !bg-white/10 !text-[#F2A7A7]">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}