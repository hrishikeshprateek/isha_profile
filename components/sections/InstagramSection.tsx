'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface InstagramPost {
  id: string;
  url: string;
}

interface InstagramData {
  profileUrl: string;
  profileHandle: string;
  posts: InstagramPost[];
}

const SkeletonLoader = () => (
    <div className="w-full flex-1 flex flex-col flex-grow animate-[pulse_2s_ease-in-out_infinite] bg-white/20 p-4 rounded-3xl mx-auto h-full">
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#DC7C7C]/20 to-[#A68B7E]/20" />
            <div className="space-y-2 flex-1">
                <div className="h-3 w-20 rounded bg-gradient-to-r from-[#DC7C7C]/20 to-[#A68B7E]/20" />
                <div className="h-2 w-12 rounded bg-gradient-to-r from-[#DC7C7C]/10 to-[#A68B7E]/10" />
            </div>
        </div>
        {/* Image Skeleton */}
        <div className="w-full flex-grow rounded-xl bg-gradient-to-br from-[#DC7C7C]/20 via-[#A68B7E]/20 to-[#F2A7A7]/10 mb-4" />
        {/* Caption Skeleton */}
        <div className="space-y-2">
            <div className="h-2 w-full rounded bg-gradient-to-r from-[#DC7C7C]/20 to-[#A68B7E]/20" />
            <div className="h-2 w-4/5 rounded bg-gradient-to-r from-[#DC7C7C]/20 to-[#A68B7E]/20" />
        </div>
    </div>
);

const InstagramSection = () => {
    const [instagramData, setInstagramData] = useState<InstagramData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Instagram data from API
    useEffect(() => {
        const fetchInstagramData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/instagram');
                const data = await response.json();

                if (data.success && data.data) {
                    setInstagramData(data.data);
                    setError(null);
                } else {
                    setError('Failed to load Instagram data');
                }
            } catch (err) {
                console.error('Error fetching Instagram data:', err);
                setError('Error loading Instagram section');
            } finally {
                setLoading(false);
            }
        };

        fetchInstagramData();
    }, []);

    // Process Instagram embeds
    useEffect(() => {
        // Reuse existing script if already present
        const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');
        const script = existing ?? document.createElement('script');

        if (!existing) {
            script.async = true;
            script.src = 'https://www.instagram.com/embed.js';
            document.body.appendChild(script);
        }

        const checkInstagram = setInterval(() => {
            if (window.instgrm?.Embeds) {
                clearInterval(checkInstagram);
                window.instgrm.Embeds.process();

                setTimeout(() => {
                    const wrappers = document.querySelectorAll('.instagram-embed-wrapper');
                    const skeletons = document.querySelectorAll('.instagram-skeleton');

                    wrappers.forEach((w) => {
                        w.classList.add('opacity-100');
                        w.classList.remove('opacity-0');
                    });

                    skeletons.forEach((s) => {
                        s.classList.add('hidden');
                    });
                }, 1000);
            }
        }, 100);

        return () => {
            clearInterval(checkInstagram);
        };
    }, [instagramData]);

    // Show skeleton while loading
    if (loading) {
        return (
            <section className="py-12 md:py-16 bg-gradient-to-b from-[#FAF0E6] to-[#FFF5ED] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#DC7C7C]/8 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#DC7C7C]/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[1200px]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 mb-3 opacity-70">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#DC7C7C] font-serif">On The Gram</span>
                                <div className="w-8 h-px bg-[#DC7C7C]/40" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-[#3B241A] leading-tight mb-4">
                                Instagram <span className="text-[#DC7C7C] italic font-light">Moments</span>
                            </h3>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl">
                            <div className="lg:col-span-1"><SkeletonLoader /></div>
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                <SkeletonLoader />
                                <SkeletonLoader />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state
    if (error || !instagramData) {
        return (
            <section className="py-12 md:py-16 bg-gradient-to-b from-[#FAF0E6] to-[#FFF5ED] relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[1200px]">
                    <div className="text-center">
                        <p className="text-[#DC7C7C] font-semibold">{error || 'Unable to load Instagram section'}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-16 bg-gradient-to-b from-[#FAF0E6] to-[#FFF5ED] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#DC7C7C]/8 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#DC7C7C]/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

            {/* Container */}
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[1200px]">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 mb-3 opacity-70">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#DC7C7C] font-serif">
                                On The Gram
                            </span>
                            <div className="w-8 h-px bg-[#DC7C7C]/40" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-[#3B241A] leading-tight mb-4">
                            Instagram <span className="text-[#DC7C7C] italic font-light">Moments</span>
                        </h3>
                        <p className="text-[#A68B7E] text-base leading-relaxed max-w-xl">
                            Behind-the-scenes snapshots and daily inspiration from my creative journey.
                        </p>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="flex justify-center">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl">
                        {/* Profile Card */}
                        <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
                            {/* Profile */}
                            <div className="relative flex flex-col w-full">
                                <div className="instagram-skeleton">
                                    <SkeletonLoader />
                                </div>
                                <div className="instagram-embed-wrapper opacity-0 transition-opacity duration-700 w-full flex items-center justify-center" style={{ transformOrigin: 'center', minWidth: '0' }}>
                                    <blockquote
                                        className="instagram-media !m-0"
                                        data-instgrm-permalink={instagramData.profileUrl}
                                        data-instgrm-version="14"
                                        style={{ border: 'none', padding: '0px', maxWidth: '100%', width: '100%' }}
                                    />
                                </div>
                            </div>

                            {/* Divider Text Line */}
                            <div className="flex items-center justify-center gap-4 py-3">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DC7C7C]/30 to-transparent" />
                                <span className="text-xs font-semibold text-[#A68B7E] uppercase tracking-widest">Stories & Life</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DC7C7C]/30 to-transparent" />
                            </div>

                            {/* Follow Button */}
                            <a
                                href={instagramData.profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full bg-white/60 backdrop-blur-sm border border-[#DC7C7C]/20 text-[#3B241A] font-semibold hover:bg-white hover:border-[#DC7C7C]/40 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap w-full text-sm md:text-base"
                            >
                                Follow on Instagram
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6-6m0 0L21 3m-6 0v12" />
                                </svg>
                            </a>
                        </div>

                        {/* Right Column: Posts (Dynamic) */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            {instagramData.posts.map((post) => (
                                <div key={post.id} className="relative flex flex-col w-full">
                                    <div className="instagram-skeleton">
                                        <SkeletonLoader />
                                    </div>
                                    <div className="instagram-embed-wrapper opacity-0 transition-opacity duration-700 w-full flex items-center justify-center" style={{ transformOrigin: 'center', minWidth: '0' }}>
                                        <blockquote
                                            className="instagram-media !m-0"
                                            data-instgrm-permalink={post.url}
                                            data-instgrm-version="14"
                                            style={{ border: 'none', padding: '0px', maxWidth: '100%', width: '100%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default InstagramSection;