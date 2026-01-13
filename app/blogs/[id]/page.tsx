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
    Check, Globe
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

// --- MOCK DATA (Fallback if json fails) ---
// In a real app, this comes from your JSON or API
const DUMMY_POST: BlogPost = {
    id: "1",
    title: "The Art of Mindful Design: Creating Digital Spaces that Breathe",
    excerpt: "In an era of digital noise, how do we create interfaces that calm rather than clutter? Exploring the psychology behind whitespace, color theory, and user-centric flow.",
    category: "Design Theory",
    date: "October 12, 2025",
    readTime: "8 min read",
    author: "Isha Rani",
    image: "/isha_a.png", // Replace with your actual blog image path
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
    // Try to load real data, fallback to dummy for display purposes
    let post = DUMMY_POST;

    // Logic to fetch real post if available
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const blogPosts = require('@/data/blogs.json');
        const found = blogPosts.find((p: BlogPost) => p.id === params.id);
        if(found) post = found;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
        // console.log("Using dummy data");
    }

    // Scroll Progress Bar
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

            {/* 1. READING PROGRESS BAR (Sticky Top) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-[#F2A7A7] origin-left z-50"
                style={{ scaleX }}
            />

            {/* Toolbar */}
            <div className="fixed top-0 left-0 right-0 z-40">
                <Toolbar
                    title="Journal"
                    showBackButton={true}
                    backHref="/blogs"
                    navItems={["Home", "Services", "Work", "Contact"]}
                    showContactButton={false}
                />
            </div>

            {/* Main Content with proper padding for toolbar */}
            <div className="pt-20 lg:pt-24">

            {/* --- HERO SECTION --- */}
            <header className="pt-12 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">

                {/* Background Blur Spot */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#F2A7A7]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                {/* Category Pill */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[#3B241A]/10 text-xs font-bold tracking-widest uppercase text-[#A68B7E] mb-6 backdrop-blur-sm"
                >
                    <Tag className="w-3 h-3" />
                    {post.category}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3B241A] leading-[1.15] mb-6 max-w-4xl mx-auto"
                >
                    {post.title}
                </motion.h1>

                {/* Excerpt */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-[#6E5045] leading-relaxed max-w-2xl mx-auto mb-8"
                >
                    {post.excerpt}
                </motion.p>

                {/* Meta Data Row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#A68B7E] font-medium"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F2A7A7] to-[#3B241A] p-[2px]">
                            <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                <img src="/isha_a.png" alt="Isha" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-[#3B241A]">{post.author}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-[#3B241A]/20" />
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {post.date}
                    </div>
                    <span className="w-1 h-1 rounded-full bg-[#3B241A]/20" />
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {post.readTime}
                    </div>
                </motion.div>
            </header>

            {/* --- FEATURED IMAGE --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12"
            >
                <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl sm:shadow-2xl shadow-[#3B241A]/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-[#3B241A]/10 mix-blend-multiply" />
                </div>
            </motion.div>

            {/* --- CONTENT LAYOUT --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-24 lg:pb-24">

                {/* LEFT SIDEBAR (Sticky Actions) */}
                <div className="hidden lg:block lg:col-span-2 relative">
                    <div className="sticky top-40 flex flex-col gap-4 items-center">
                        <p className="text-xs font-bold text-[#A68B7E] uppercase tracking-widest mb-2 writing-vertical-lr transform rotate-180">Share</p>

                        <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full transition-all duration-300 ${isLiked ? 'bg-[#F2A7A7] text-white shadow-lg shadow-pink-200' : 'bg-white text-[#3B241A] hover:bg-[#F2A7A7]/20'}`}>
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>

                        <button onClick={() => setIsSaved(!isSaved)} className={`p-3 rounded-full transition-all duration-300 ${isSaved ? 'bg-[#3B241A] text-white' : 'bg-white text-[#3B241A] hover:bg-[#3B241A]/10'}`}>
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        <div className="w-8 h-[1px] bg-[#3B241A]/10 my-2" />

                        <button className="p-3 rounded-full bg-white text-[#3B241A] hover:text-[#1DA1F2] hover:bg-blue-50 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-full bg-white text-[#3B241A] hover:text-[#0A66C2] hover:bg-blue-50 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </button>
                        <button onClick={handleCopyLink} className="p-3 rounded-full bg-white text-[#3B241A] hover:bg-[#FAF0E6] transition-colors relative">
                            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* CENTER CONTENT (Article) */}
                <main className="lg:col-span-8">
                    <article className="prose prose-sm sm:prose-base lg:prose-lg prose-headings:font-serif prose-headings:text-[#3B241A] prose-p:text-[#6E5045] prose-p:leading-relaxed prose-a:text-[#F2A7A7] prose-blockquote:border-[#F2A7A7] prose-blockquote:bg-white/50 prose-blockquote:py-2 prose-strong:text-[#3B241A] max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </article>

                    {/* Tags */}
                    <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-[#3B241A]/10">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span key={tag} className="px-3 sm:px-4 py-2 rounded-full bg-white border border-[#3B241A]/10 text-xs sm:text-sm font-medium text-[#6E5045] hover:bg-[#F2A7A7] hover:text-white hover:border-[#F2A7A7] transition-all cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Author Bio Card */}
                    <div className="mt-12 sm:mt-16 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg sm:shadow-xl shadow-[#3B241A]/5 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left border border-[#F2A7A7]/20">
                        <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full p-1 bg-gradient-to-br from-[#F2A7A7] to-[#3B241A] shrink-0">
                            <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/isha_a.png" alt="Isha" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-3 sm:mb-4">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold font-serif text-[#3B241A]">Written by {post.author}</h3>
                                    <p className="text-xs font-bold text-[#F2A7A7] uppercase tracking-widest mt-1">UI/UX Designer</p>
                                </div>
                                <button className="mt-3 sm:mt-0 px-4 sm:px-6 py-2 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs sm:text-sm font-bold hover:bg-[#5a3a2d] transition-colors">
                                    Follow
                                </button>
                            </div>
                            <p className="text-xs sm:text-sm text-[#6E5045] mb-4 sm:mb-6 leading-relaxed">
                                Crafting digital experiences that bridge the gap between functionality and art.
                                I write about design systems, emotional UI, and the creative process.
                            </p>
                            <div className="flex justify-center sm:justify-start gap-4">
                                <Link href="#" className="text-[#A68B7E] hover:text-[#F2A7A7] transition-colors"><Twitter size={20} /></Link>
                                <Link href="#" className="text-[#A68B7E] hover:text-[#F2A7A7] transition-colors"><Linkedin size={20} /></Link>
                                <Link href="#" className="text-[#A68B7E] hover:text-[#F2A7A7] transition-colors"><Globe size={20} /></Link>
                            </div>
                        </div>
                    </div>

                </main>

                {/* RIGHT SIDEBAR (Optional) */}
                <div className="hidden lg:block lg:col-span-2"></div>
            </div>

            {/* --- NEWSLETTER SECTION --- */}
            <div className="bg-[#3B241A] text-[#FAF0E6] py-16 sm:py-20 px-4 relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#F2A7A7] rounded-full blur-[100px] sm:blur-[150px] opacity-20 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6">Join the creative circle.</h2>
                    <p className="text-[#FAF0E6]/70 mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base lg:text-lg">
                        Get the latest design insights, resources, and behind-the-scenes stories delivered to your inbox.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto px-4 sm:px-0">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-sm"
                        />
                        <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#F2A7A7] text-[#3B241A] text-sm sm:text-base font-bold hover:bg-[#e08e8e] transition-colors shadow-lg shadow-pink-900/20 whitespace-nowrap">
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-[#FAF0E6]/40 mt-4 sm:mt-6">No spam. Unsubscribe anytime.</p>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar (Visible only on mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#3B241A]/10 p-3 sm:p-4 flex justify-around items-center z-40">
                <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1 text-xs font-medium text-[#6E5045]">
                    <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isLiked ? 'fill-[#F2A7A7] text-[#F2A7A7]' : ''}`} />
                    <span className="text-xs">Like</span>
                </button>
                <button onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center gap-1 text-xs font-medium text-[#6E5045]">
                    <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${isSaved ? 'fill-[#3B241A] text-[#3B241A]' : ''}`} />
                    <span className="text-xs">Save</span>
                </button>
                <button onClick={handleCopyLink} className="flex flex-col items-center gap-1 text-xs font-medium text-[#6E5045]">
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xs">Share</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-xs font-medium text-[#6E5045]">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xs">Comment</span>
                </button>
            </div>

            {/* Padding for mobile bottom bar */}
            <div className="h-20 lg:h-0" />

            {/* Global Styles for Typography */}
            <style jsx global>{`
        /* Custom scrollbar for webkit */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #FAF0E6;
        }
        ::-webkit-scrollbar-thumb {
          background: #3B241A;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #F2A7A7;
        }
        
        /* Smooth selection color */
        ::selection {
          background: #F2A7A7;
          color: #3B241A;
        }
        
        /* Blockquote Styling */
        blockquote {
          font-style: italic;
          font-family: serif;
          font-size: 1.25rem;
          color: #3B241A !important;
        }
      `}</style>
            </div>
        </div>
    );
}