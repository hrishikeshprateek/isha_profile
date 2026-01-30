'use client';

import React, { useState, useEffect } from 'react';
import Toolbar from '@/components/Toolbar';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';

// Interface for blog post data
interface BlogPost {
    id: string;
    slug?: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    author: string;
    tags: string[];
}

const categories = ['All', 'Travel', 'Content Creation', 'Food & Culture', 'Photography', 'Design', 'General'];

const Blogs = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // move fetch inside effect to avoid dependency issues
        let cancelled = false;
        async function doFetch() {
            try {
                setLoading(true);
                const url = new URL('/api/blogs', window.location.origin);
                if (selectedCategory !== 'All') {
                    url.searchParams.append('category', selectedCategory);
                }

                const res = await fetch(url.toString());
                const data = await res.json();

                console.debug('Blogs API response:', data);

                // Normalise response to expected BlogPost[] shape
                const rawBlogs = Array.isArray(data.blogs) ? data.blogs : (data && (data as any).blogs) || [];

                const normalized = (rawBlogs as unknown[]).map((b) => {
                    const bb = b as Record<string, unknown>;
                    const id = bb.id ?? bb._id ?? '';
                    const dateVal = bb.date as string | undefined | Date;
                    return {
                        id: String(id || ''),
                        slug: String(bb.slug ?? ''),
                        title: String(bb.title ?? 'Untitled'),
                        excerpt: String(bb.excerpt ?? ''),
                        category: String(bb.category ?? 'General'),
                        date: typeof dateVal === 'string' ? dateVal : (dateVal ? new Date(String(dateVal)).toLocaleDateString() : ''),
                        readTime: String(bb.readTime ?? ''),
                        image: String(bb.image ?? '/isha_a.png'),
                        author: String(bb.author ?? 'Isha Rani'),
                        tags: Array.isArray(bb.tags) ? (bb.tags as string[]) : []
                    } as BlogPost;
                });

                if (!cancelled) {
                    setBlogs(normalized);
                }
            } catch (err) {
                console.warn('Failed to fetch blogs:', err);
                if (!cancelled) setBlogs([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        doFetch();
        return () => {
            cancelled = true;
        };
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-[#FAF0E6] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">
            {/* Reusable Toolbar */}
            <Toolbar
                title="Journal"
                showBackButton={true}
                backHref="/d1"
                navItems={["Home", "Services", "My Projects", "Reviews", "Contact"]}
                showContactButton={false}
            />

            {/* --- MINIMAL HEADER --- */}
            <div className="pt-32 pb-8 px-6 sm:px-8 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {/* Top Label */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-6 h-[1px] bg-[#3B241A]/30"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A68B7E]">
                                The Collection
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#3B241A] tracking-tight">
                            Stories <span className="font-light italic text-[#3B241A]/60">&</span> Creative Insights.
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* --- CLEAN TABS (Not Sticky - Scrolls with page) --- */}
            <div className="mb-12 border-b border-[#3B241A]/5">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 overflow-x-auto no-scrollbar">
                    <div className="flex gap-8 min-w-max justify-center md:justify-start">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${
                                    selectedCategory === category
                                        ? 'text-[#3B241A] opacity-100'
                                        : 'text-[#3B241A]/40 hover:text-[#3B241A] hover:opacity-100'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- BLOG GRID --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3B241A] border-t-transparent"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[#A68B7E] text-lg font-serif italic">No stories found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {blogs.map((blog, index) => (
                            <Link key={blog.id} href={`/blogs/${blog.slug || blog.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group cursor-pointer flex flex-col h-full"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-[#3B241A]/5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={blog.image || '/isha_a.png'}
                                            alt={blog.title || 'Cover'}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute top-4 left-4">
                                           <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#3B241A]">
                                            {blog.category}
                                          </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow">
                                        <div className="flex items-center text-xs font-bold text-[#A68B7E] mb-3 uppercase tracking-wider gap-2">
                                            <span>{blog.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-[#A68B7E]/50"/>
                                            <span>{blog.readTime}</span>
                                        </div>

                                        <h3 className="text-xl font-serif font-bold text-[#3B241A] mb-3 group-hover:text-[#F2A7A7] transition-colors leading-snug">
                                            {blog.title}
                                        </h3>

                                        <p className="text-sm text-[#3B241A]/60 line-clamp-3 leading-relaxed mb-4 flex-grow">
                                            {blog.excerpt || 'Read more about this story.'}
                                        </p>

                                        <div className="flex items-center text-sm font-bold text-[#3B241A] underline decoration-1 underline-offset-4 decoration-[#3B241A]/30 group-hover:decoration-[#F2A7A7] transition-all">
                                            Read Story
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            {/* Global CSS to Hide Scrollbars */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

export default Blogs;

