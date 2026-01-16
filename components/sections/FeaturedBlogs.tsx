'use client';

import React from 'react';
import Link from 'next/link';

// Interface (Same as your main page)
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

// Load data and slice the first 3 items
const blogPosts: BlogPost[] = require('@/data/blogs.json');
const recentPosts = blogPosts.slice(0, 3); // ONLY SHOW TOP 3

const FeaturedBlogs = () => {
    return (
        <section className="py-12 bg-[#FAF0E6] relative overflow-hidden">
            {/* Optional: Decorative background blur/blob to add depth */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#DC7C7C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 fade-in-up">
                    <div className="max-w-2xl">
                        <h2 className="text-sm font-bold tracking-widest text-[#DC7C7C] uppercase mb-2">
                            The Journal
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-[#3B241A]">
                            Latest Stories & <span className="text-gradient">Insights</span>
                        </h3>
                        <p className="mt-4 text-[#A68B7E] text-lg">
                            Adventures, thoughts, and tutorials from my daily work and travels.
                        </p>
                    </div>

                    {/* Desktop 'View All' Button */}
                    <Link
                        href="/blogs"
                        className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#3B241A] text-[#3B241A] font-medium hover:bg-[#3B241A] hover:text-[#FAF0E6] transition-all duration-300 group"
                    >
                        View All Articles
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* The Grid (Limited to 3) */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentPosts.map((post, index) => (
                        <Link key={post.id} href={`/blogs/${post.id}`} className="block h-full">
                            <article
                                className={`h-full glass rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col fade-in-up stagger-${index + 1}`}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full glass-nav text-xs font-semibold backdrop-blur-md bg-white/30 text-[#3B241A]">
                      {post.category}
                    </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 text-xs text-[#A68B7E] mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {post.date}
                    </span>
                                        <span className="w-1 h-1 rounded-full bg-[#A68B7E]/50" />
                                        <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {post.readTime}
                    </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#3B241A] mb-3 group-hover:text-[#DC7C7C] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>

                                    <p className="text-[#A68B7E] text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    <div className="pt-4 mt-auto border-t border-[#3B241A]/5 flex items-center text-[#DC7C7C] font-medium text-sm group-hover:gap-2 transition-all">
                                        Read Story
                                        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* Mobile 'View All' Button (Only shows on small screens) */}
                <div className="mt-10 text-center md:hidden">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B241A] text-[#FAF0E6] font-medium shadow-lg active:scale-95 transition-all"
                    >
                        View All Articles
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FeaturedBlogs;