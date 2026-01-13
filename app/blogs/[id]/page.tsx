'use client';

import React, { useState } from 'react';
import Toolbar from '@/components/Toolbar';
import {
    Calendar,
    Clock,
    Tag,
    Heart,
    Share2,
    Bookmark,
    MessageCircle,
    Twitter,
    Linkedin,
    Copy,
    Check,
    Globe,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';

// --- TYPES ---
interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    author: string;
    image: string;
    content: string;
    tags: string[];
}

// --- MOCK DATA ---
const DUMMY_POST: BlogPost = {
    id: "1",
    title: "The Art of Mindful Design: Creating Digital Spaces that Breathe",
    excerpt: "In an era of digital noise, how do we create interfaces that calm rather than clutter? Exploring the psychology behind whitespace, color theory, and user-centric flow.",
    category: "Design Theory",
    date: "October 12, 2025",
    readTime: "8 min read",
    author: "Isha Rani",
    image: "/isha_a.png",
    tags: ["UI/UX", "Minimalism", "Psychology", "Web Design"],
    content: `
    <p>The digital landscape is often crowded, loud, and demanding. As designers, we have a responsibility not just to convey information, but to do so in a way that respects the user's cognitive load.</p>
    <h2>The Power of Whitespace</h2>
    <p>Whitespace is not empty space; it is an active design element. It acts as the breath between musical notes. Without it, the composition creates noise rather than melody. By increasing margins and line heights, we allow the content to shine.</p>
    <blockquote>"Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs</blockquote>
    <p>When we prioritize soothing color palettes—like soft beiges, earthy browns, and muted pinks—we create an environment where users feel safe to explore. This emotional safety translates directly to higher engagement and better conversion rates.</p>
    <h2>Typography as Voice</h2>
    <p>Typefaces carry emotion. A serif font can evoke tradition, elegance, and trustworthiness, while a geometric sans-serif feels modern and efficient. Mixing these intentionally creates a hierarchy that guides the eye effortlessly down the page.</p>
    <ul>
      <li><strong>Contrast:</strong> Ensure text is legible but not jarring.</li>
      <li><strong>Hierarchy:</strong> Use size and weight to signpost importance.</li>
      <li><strong>Flow:</strong> Keep line lengths between 50-75 characters.</li>
    </ul>
    <p>Ultimately, mindful design is about empathy. It's about understanding the human on the other side of the screen.</p>
  `
};

export default function BlogPostPage() {
    const params = useParams();
    let post = DUMMY_POST;

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const blogPosts = require('@/data/blogs.json');
        const found = blogPosts.find((p: BlogPost) => p.id === params.id);
        if(found) post = found;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
        // Fallback
    }

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* 1. PROGRESS BAR (Z-50 to stay on top of everything) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-[#F2A7A7] origin-left z-50"
                style={{ scaleX }}
            />

            {/* 2. TOOLBAR (Z-40) */}
            {/* Added backdrop-blur to ensure content scrolling under it looks nice */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-[#FAF0E6]/80 backdrop-blur-md transition-all duration-300">
                <Toolbar
                    title="Journal"
                    showBackButton={true}
                    backHref="/blogs"
                    navItems={["Home", "Services", "Work", "Contact"]}
                    showContactButton={false}
                />
            </div>

            {/* 3. MAIN CONTENT */}
            {/* Increased top padding (pt-28 to pt-32) so toolbar doesn't overlap header */}
            <div className="pt-28 md:pt-36">

                {/* HERO SECTION */}
                <header className="px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative mb-12">


                    {/* Decor */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#F2A7A7]/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/60 border border-[#3B241A]/10 text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#A68B7E] mb-4 md:mb-6 backdrop-blur-sm"
                    >
                        <Tag className="w-3 h-3" />
                        {post.category}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3B241A] leading-[1.2] mb-6 max-w-3xl mx-auto"
                    >
                        {post.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-xl text-[#6E5045] leading-relaxed max-w-xl mx-auto mb-8"
                    >
                        {post.excerpt}
                    </motion.p>

                    {/* Meta Data */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs md:text-sm text-[#A68B7E] font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-[#F2A7A7] to-[#3B241A] p-[2px]">
                                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                    <img src="/isha_a.png" alt="Isha" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <span className="text-[#3B241A]">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" /> {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" /> {post.readTime}
                        </div>
                    </motion.div>
                </header>

                {/* FEATURED IMAGE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-6xl mx-auto px-4 sm:px-6 mb-12"
                >
                    {/* Changed aspect ratio: Taller (4/3) on mobile, Wider (21/9) on desktop */}
                    <div className="relative aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl shadow-[#3B241A]/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#3B241A]/5 mix-blend-multiply" />
                    </div>
                </motion.div>

                {/* CONTENT LAYOUT */}
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12">

                    {/* LEFT SIDEBAR (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-2 relative">
                        <div className="sticky top-40 flex flex-col gap-4 items-center">
                            <p className="text-xs font-bold text-[#A68B7E] uppercase tracking-widest mb-2 writing-vertical-lr transform rotate-180">Share</p>
                            <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full transition-all duration-300 ${isLiked ? 'bg-[#F2A7A7] text-white shadow-lg' : 'bg-white text-[#3B241A] hover:bg-[#F2A7A7]/20'}`}>
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                            <button onClick={() => setIsSaved(!isSaved)} className={`p-3 rounded-full transition-all duration-300 ${isSaved ? 'bg-[#3B241A] text-white' : 'bg-white text-[#3B241A] hover:bg-[#3B241A]/10'}`}>
                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            <div className="w-8 h-[1px] bg-[#3B241A]/10 my-2" />
                            <button onClick={handleCopyLink} className="p-3 rounded-full bg-white text-[#3B241A] hover:bg-[#FAF0E6] transition-colors relative">
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* ARTICLE CONTENT */}
                    <main className="lg:col-span-8">
                        <article className="prose prose-lg prose-headings:font-serif prose-headings:text-[#3B241A] prose-headings:leading-tight prose-p:text-[#6E5045] prose-p:leading-loose prose-a:text-[#F2A7A7] prose-blockquote:border-[#F2A7A7] prose-blockquote:bg-white/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-strong:text-[#3B241A] max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </article>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-[#3B241A]/10">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-[#3B241A]/10 text-xs md:text-sm font-medium text-[#6E5045]">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Author Card */}
                        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-[#3B241A]/5 border border-[#F2A7A7]/20">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-br from-[#F2A7A7] to-[#3B241A] shrink-0">
                                    <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                        <img src="/isha_a.png" alt="Isha" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold font-serif text-[#3B241A]">Written by {post.author}</h3>
                                    <p className="text-xs font-bold text-[#F2A7A7] uppercase tracking-widest mt-1 mb-3">UI/UX Designer</p>
                                    <p className="text-sm md:text-base text-[#6E5045] mb-4 leading-relaxed">
                                        Crafting digital experiences that bridge the gap between functionality and art.
                                    </p>
                                    <div className="flex justify-center md:justify-start gap-4 text-[#A68B7E]">
                                        <Twitter size={18} />
                                        <Linkedin size={18} />
                                        <Globe size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Right Spacer */}
                    <div className="hidden lg:block lg:col-span-2"></div>
                </div>

                {/* NEWSLETTER */}
                <div className="bg-[#3B241A] text-[#FAF0E6] py-16 px-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F2A7A7] rounded-full blur-[100px] opacity-20 pointer-events-none" />
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4">Join the creative circle.</h2>
                        <p className="text-[#FAF0E6]/70 mb-8 text-sm md:text-lg">
                            Get the latest design insights delivered to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none"
                            />
                            <button className="px-6 py-3 rounded-xl bg-[#F2A7A7] text-[#3B241A] font-bold hover:bg-[#e08e8e]">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* BOTTOM PADDING for Sticky Mobile Bar */}
                <div className="h-24 lg:h-0" />

                {/* MOBILE STICKY BOTTOM BAR */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-[#3B241A]/10 p-3 pb-safe flex justify-around items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1 min-w-[60px]">
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#F2A7A7] text-[#F2A7A7]' : 'text-[#6E5045]'}`} />
                        <span className={`text-[10px] font-medium ${isLiked ? 'text-[#F2A7A7]' : 'text-[#6E5045]'}`}>{isLiked ? '124' : 'Like'}</span>
                    </button>
                    <button onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center gap-1 min-w-[60px]">
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#3B241A] text-[#3B241A]' : 'text-[#6E5045]'}`} />
                        <span className={`text-[10px] font-medium ${isSaved ? 'text-[#3B241A]' : 'text-[#6E5045]'}`}>Save</span>
                    </button>
                    <button onClick={handleCopyLink} className="flex flex-col items-center gap-1 min-w-[60px]">
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5 text-[#6E5045]" />}
                        <span className={`text-[10px] font-medium ${copied ? 'text-green-600' : 'text-[#6E5045]'}`}>{copied ? 'Copied' : 'Share'}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 min-w-[60px]">
                        <MessageCircle className="w-5 h-5 text-[#6E5045]" />
                        <span className="text-[10px] font-medium text-[#6E5045]">42</span>
                    </button>
                </div>

                {/* Typography Global Styles */}
                <style jsx global>{`
                    blockquote {
                        font-style: italic;
                        font-family: serif;
                        font-size: 1.15rem;
                        color: #3B241A !important;
                        margin: 2rem 0;
                        padding-left: 1.5rem;
                    }
                    /* Ensure images in content are responsive */
                    .prose img {
                        border-radius: 1rem;
                        width: 100%;
                        height: auto;
                    }
                `}</style>
            </div>
        </div>
    );
}