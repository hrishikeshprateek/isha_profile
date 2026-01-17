"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

// Define a strict type for reviews to avoid any
type Review = {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
};

// --- MOCK DATA ---
const reviews: Review[] = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Marketing Director @ TechFlow",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
        content: "Isha didn't just design a website; she crafted an entire brand identity that speaks volumes. Her eye for detail is unmatched.",
    },
    {
        id: 2,
        name: "David Chen",
        role: "Founder, Bloom Studios",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
        content: "The content strategy she delivered increased our engagement by 200% in a month. Absolute wizardry.",
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        role: "Content Creator",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
        content: "Working with Isha was seamless. She understood my vague ideas and turned them into a polished, professional reality.",
    },
    {
        id: 4,
        name: "Marcus Johnson",
        role: "CEO, Nexa",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
        content: "Professional, timely, and incredibly creative. The UI designs were exactly what we needed to secure our Series A funding.",
    },
    {
        id: 5,
        name: "Sophie Moore",
        role: "Lifestyle Blogger",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
        content: "She has a unique ability to blend aesthetics with functionality. My blog has never looked better or loaded faster.",
    },
];

const marqueeRows = [
    [...reviews, ...reviews],
    [...reviews.reverse(), ...reviews],
];

const Testimonials = () => {
    return (
        // DARK ESPRESSO BACKGROUND (#3B241A)
        <section className="py-12 bg-[#3B241A] relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#F2A7A7]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#F2A7A7]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 mb-12 relative z-10 text-center">

                {/* Title: Forced Light Cream Text (!text-[#FAF0E6]) */}
                <h2 className="text-3xl md:text-5xl font-serif font-bold !text-[#FAF0E6] leading-tight">
                    Don&#39;t just take <br />
                    <span className="text-[#F2A7A7] italic">my word</span> for it.
                </h2>
            </div>

            {/* MARQUEE WRAPPER */}
            <div className="relative w-full space-y-6">

                {/* Gradient Masks: Fading to Brown (#3B241A) */}
                <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-[#3B241A] to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-[#3B241A] to-transparent z-20 pointer-events-none" />

                {/* ROW 1 */}
                <div className="flex overflow-hidden -rotate-1 hover:rotate-0 transition-transform duration-700">
                    <motion.div
                        className="flex gap-4 pl-4"
                        animate={{ x: "-50%" }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 50 }}
                    >
                        {marqueeRows[0].map((review, index) => (
                            <ReviewCard key={`row1-${index}`} review={review} />
                        ))}
                    </motion.div>
                </div>

                {/* ROW 2 */}
                <div className="flex overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-700">
                    <motion.div
                        className="flex gap-4 pl-4"
                        animate={{ x: "0%" }}
                        initial={{ x: "-50%" }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
                    >
                        {marqueeRows[1].map((review, index) => (
                            <ReviewCard key={`row2-${index}`} review={review} />
                        ))}
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

// --- SUB-COMPONENT: DARK CARD ---
const ReviewCard = ({ review }: { review: Review }) => (
    <div className="w-[320px] md:w-[380px] flex-shrink-0 bg-[#FAF0E6]/5 backdrop-blur-md border border-[#FAF0E6]/10 p-6 rounded-2xl hover:bg-[#FAF0E6]/10 transition-colors duration-300 shadow-lg group">

        <div className="flex justify-between items-center mb-3">
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#F2A7A7] fill-current" />
                ))}
            </div>
            <Quote className="w-6 h-6 text-[#FAF0E6]/20 group-hover:text-[#F2A7A7]/40 transition-colors" />
        </div>

        {/* Content: Forced Light Cream Text */}
        <p className="!text-[#FAF0E6]/90 text-[15px] leading-relaxed font-serif mb-5 line-clamp-3">
            &quot;{review.content}&quot;
        </p>

        <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#FAF0E6]/20 flex-shrink-0">
                <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="min-w-0">
                {/* Name: Forced Light Cream Text */}
                <h4 className="font-bold !text-[#FAF0E6] text-sm truncate">{review.name}</h4>
                <p className="text-[#F2A7A7] text-[10px] uppercase tracking-wide truncate">{review.role}</p>
            </div>
        </div>
    </div>
);

export default Testimonials;