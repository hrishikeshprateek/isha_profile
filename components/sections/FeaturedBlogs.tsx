'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Interface
interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    author: string;
    content: string;
    tags: string[];
}

// Load data and slice the first 4 items (Even number works best for 2x2 layouts)
import blogPosts from '@/data/blogs.json';
const recentPosts = blogPosts.slice(0, 4);

const FeaturedBlogs = () => {
    return (
        <section className="py-24 bg-[#FAF0E6] relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#DC7C7C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            {/* Container matches your Quotes/Hero width exactly */}
            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 mb-2 opacity-60">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#DC7C7C]">The Journal</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-[#3B241A] leading-tight">
                            Latest Stories & <span className="text-[#DC7C7C] italic">Insights</span>
                        </h3>
                        <p className="mt-4 text-[#A68B7E] text-lg">
                            Adventures, thoughts, and tutorials from my daily work and travels.
                        </p>
                    </div>

                    {/* Desktop 'View All' Button */}
                    <Link
                        href="/blogs"
                        className="hidden md:inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#3B241A]/10 bg-white text-[#3B241A] font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] transition-all duration-300 group shadow-sm"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* THE GRID FIX:
                    - Mobile: 1 col
                    - Medium (Tablet): 2 cols (Perfect 2x2 grid)
                    - Large (Desktop): 4 cols (Perfect 1x4 row)
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentPosts.map((post, index) => (
                        <Link key={post.id} href={`/blogs/${post.id}`} className="block h-full">
                            <article
                                className="h-full bg-white border border-[#3B241A]/5 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-[#DC7C7C]/10 hover:-translate-y-1 transition-all duration-500 group flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#3B241A] shadow-sm">
                                          {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#A68B7E] mb-3">
                                        <span>{post.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#A68B7E]/50" />
                                        <span>{post.readTime}</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-[#3B241A] mb-3 group-hover:text-[#DC7C7C] transition-colors line-clamp-2 leading-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-[#A68B7E] text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    <div className="pt-4 mt-auto border-t border-[#3B241A]/5 flex items-center text-[#DC7C7C] font-bold text-xs uppercase tracking-wider group-hover:gap-2 transition-all">
                                        Read Story
                                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* Mobile 'View All' Button */}
                <div className="mt-10 text-center md:hidden">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#3B241A] text-[#FAF0E6] font-bold shadow-lg active:scale-95 transition-all"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FeaturedBlogs;