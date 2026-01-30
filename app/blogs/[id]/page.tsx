'use client';

import React, { useEffect, useState } from 'react';
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
    Globe
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Link from 'next/link';

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
    likes?: number;
    shares?: number;
}

export default function BlogPostPage() {
    const params = useParams();

    // --- HOOKS (stable order) ---
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const [likes, setLikes] = useState<number>(0);
    const [shares, setShares] = useState<number>(0);

    // normalize param id safely
    const rawParams = params as { id?: string | string[] | undefined };
    const idParam = Array.isArray(rawParams?.id) ? rawParams.id[0] : rawParams?.id;

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setNotFound(false);

            if (!idParam) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            try {
                const url = `/api/blogs?id=${encodeURIComponent(idParam)}`;
                const res = await fetch(url);
                const data = await res.json();

                if (data && data.success && data.blog) {
                    const b = data.blog as Record<string, unknown>;
                    const getStr = (k: string) => {
                        const v = (b as Record<string, unknown>)[k];
                        if (typeof v === 'string') return v;
                        if (typeof v === 'number') return String(v);
                        return '';
                    };

                    // resolve _id safely to a string (handles ObjectId or { $oid } shapes)
                    const rawId = (b as Record<string, unknown>)['_id'];
                    let resolvedId = getStr('id') || (idParam || '');
                    if (typeof rawId === 'string') {
                        resolvedId = rawId;
                    } else if (rawId && typeof (rawId as { toString?: unknown }).toString === 'function') {
                        resolvedId = String((rawId as { toString: () => string }).toString());
                    }

                    const blog: BlogPost = {
                        id: resolvedId,
                        title: getStr('title') || 'Untitled',
                        excerpt: getStr('excerpt') || '',
                        category: getStr('category') || 'General',
                        date: getStr('date') || '',
                        readTime: getStr('readTime') || '',
                        author: getStr('author') || 'Isha Rani',
                        image: getStr('image') || '/isha_a.png',
                        tags: Array.isArray(b.tags) ? (b.tags as string[]) : [],
                        content: getStr('content') || '',
                        likes: typeof b.likes === 'number' ? b.likes : Number(b.likes || 0),
                        shares: typeof b.shares === 'number' ? b.shares : Number(b.shares || 0)
                    };

                    if (!cancelled) {
                        setPost(blog);
                        setLikes(blog.likes || 0);
                        setShares(blog.shares || 0);
                        try {
                            const key = `blog_liked_${blog.id}`;
                            const val = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
                            setIsLiked(val === '1');
                        } catch {
                            // ignore
                        }
                    }
                } else {
                    if (!cancelled) setNotFound(true);
                }
            } catch {
                console.error('Error loading blog');
                if (!cancelled) setNotFound(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [idParam]);

    // Handlers (keep existing implementation)
    const handleCopyLink = async () => {
        if (!post) return;
        try {
            const url = typeof window !== 'undefined' ? window.location.href : '';
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const handleLike = async () => {
        if (!post) return;
        const key = `blog_liked_${post.id}`;
        const already = (() => {
            try { return typeof window !== 'undefined' && localStorage.getItem(key) === '1'; } catch { return false; }
        })();

        const delta = already ? -1 : 1;
        setIsLiked(!already);
        setLikes((s) => Math.max(0, s + delta));

        try {
            const res = await fetch('/api/blogs/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: post.id, delta })
            });
            const data = await res.json();
            if (data && data.success && typeof data.likes === 'number') {
                setLikes(data.likes);
                try {
                    if (delta === 1) localStorage.setItem(key, '1'); else localStorage.removeItem(key);
                } catch {}
            } else {
                setIsLiked(already);
                setLikes((s) => Math.max(0, s - delta));
            }
        } catch {
            setIsLiked(already);
            setLikes((s) => Math.max(0, s - delta));
        }
    };

    const handleShare = async () => {
        if (!post) return;
        const url = typeof window !== 'undefined' ? window.location.href : '';
        try {
            if (navigator.share) {
                await navigator.share({ title: post.title, text: post.excerpt, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }

            // After successful share/copy, update share counts via API
            try {
                const res = await fetch('/api/blogs/share', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: post.id })
                });
                const data = await res.json();
                if (data && data.success && typeof data.shares === 'number') {
                    setShares(data.shares);
                } else {
                    setShares((s) => s + 1);
                }
            } catch {
                setShares((s) => s + 1);
            }
        } catch {
            // share/copy failed - do nothing
        }
    };

    // Not found view
    if (!loading && notFound) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] font-sans flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-40 bg-[#FAF0E6]/80 backdrop-blur-md">
                    <Toolbar title="Journal" showBackButton={true} backHref="/blogs" navItems={["Home", "Services", "Work", "Contact"]} showContactButton={false} />
                </div>
                <div className="pt-36 max-w-4xl mx-auto px-6">
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-serif font-bold text-[#3B241A] mb-4">Blog not found</h2>
                        <p className="text-[#6E5045]">The blog you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                        <div className="mt-6">
                            <Link href="/blogs" className="inline-block px-4 py-2 bg-[#F2A7A7] text-white rounded-full">Back to Journal</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Loading spinner
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#3B241A] border-t-transparent" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] font-sans flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-serif font-bold text-[#3B241A]">Blog not found</h2>
                    <Link href="/blogs" className="mt-4 inline-block px-4 py-2 bg-[#F2A7A7] text-white rounded-full">Back to Journal</Link>
                </div>
            </div>
        );
    }

    // Main render - match provided UI while keeping logic intact
    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* Progress bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#F2A7A7] origin-left z-50" style={{ scaleX }} />

            {/* Toolbar */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-[#FAF0E6]/80 backdrop-blur-md transition-all duration-300">
                <Toolbar title="Journal" showBackButton={true} backHref="/blogs" navItems={["Home", "Services", "Work", "Contact"]} showContactButton={false} />
            </div>

            {/* Main content */}
            <div className="pt-28 md:pt-36">
                <header className="px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative mb-12">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#F2A7A7]/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10" />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/60 border border-[#3B241A]/10 text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#A68B7E] mb-4 md:mb-6 backdrop-blur-sm">
                        <Tag className="w-3 h-3" />
                        {post.category}
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3B241A] leading-[1.2] mb-6 max-w-3xl mx-auto">
                        {post.title}
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base md:text-xl text-[#6E5045] leading-relaxed max-w-xl mx-auto mb-8">
                        {post.excerpt}
                    </motion.p>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs md:text-sm text-[#A68B7E] font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-[#F2A7A7] to-[#3B241A] p-[2px]">
                                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                    <Image src="/isha_a.png" alt="Isha" width={32} height={32} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <span className="text-[#3B241A]">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2"><Calendar className="w-3 h-3 md:w-4 md:h-4" /> {post.date}</div>
                        <div className="flex items-center gap-2"><Clock className="w-3 h-3 md:w-4 md:h-4" /> {post.readTime}</div>
                    </motion.div>
                </header>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                    <div className="relative aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl shadow-[#3B241A]/10">
                        <Image src={post.image || '/isha_a.png'} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 1200px" />
                        <div className="absolute inset-0 bg-[#3B241A]/5 mix-blend-multiply" />
                    </div>
                </motion.div>

                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12">
                    <div className="hidden lg:block lg:col-span-2 relative">
                        <div className="sticky top-40 flex flex-col gap-4 items-center">
                            <p className="text-xs font-bold text-[#A68B7E] uppercase tracking-widest mb-2 writing-vertical-lr transform rotate-180">Share</p>
                            <button onClick={handleLike} className={`p-3 rounded-full transition-all duration-300 ${isLiked ? 'bg-[#F2A7A7] text-white shadow-lg' : 'bg-white text-[#3B241A] hover:bg-[#F2A7A7]/20'}`}>
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                            <button onClick={() => setIsSaved(!isSaved)} className={`p-3 rounded-full transition-all duration-300 ${isSaved ? 'bg-[#3B241A] text-white' : 'bg-white text-[#3B241A] hover:bg-[#3B241A]/10'}`}>
                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            <div className="w-8 h-[1px] bg-[#3B241A]/10 my-2" />
                            <button onClick={handleCopyLink} className="p-3 rounded-full bg-white text-[#3B241A] hover:bg-[#FAF0E6] transition-colors relative">
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button onClick={handleShare} className="p-3 rounded-full bg-white text-[#3B241A] hover:bg-[#FAF0E6] transition-colors relative flex items-center gap-2">
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                {/* small shares count badge (keeps UI minimal) */}
                                {shares > 0 ? <span className="text-xs text-[#6E5045]">{shares}</span> : null}
                            </button>
                            <button className="p-3 rounded-full bg-white text-[#3B241A] hover:bg-[#F2A7A7]/20 transition-colors relative group">
                                <MessageCircle className="w-5 h-5" />
                                <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#3B241A] text-[#FAF0E6] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Comments</span>
                            </button>
                        </div>
                    </div>

                    <main className="lg:col-span-8">
                        <article className="prose prose-lg prose-headings:font-serif prose-headings:text-[#3B241A] prose-headings:leading-tight prose-p:text-[#6E5045] prose-p:leading-loose prose-a:text-[#F2A7A7] prose-blockquote:border-[#F2A7A7] prose-blockquote:bg-white/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-strong:text-[#3B241A] max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </article>

                        <div className="mt-12 pt-8 border-t border-[#3B241A]/10">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-[#3B241A]/10 text-xs md:text-sm font-medium text-[#6E5045]">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-[#3B241A]/5 border border-[#F2A7A7]/20">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-br from-[#F2A7A7] to-[#3B241A] shrink-0">
                                    <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                        <Image src="/isha_a.png" alt="Isha" width={96} height={96} className="object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold font-serif text-[#3B241A]">Written by {post.author}</h3>
                                    <p className="text-xs font-bold text-[#F2A7A7] uppercase tracking-widest mt-1 mb-3">UI/UX Designer</p>
                                    <p className="text-sm md:text-base text-[#6E5045] mb-4 leading-relaxed">Crafting digital experiences that bridge the gap between functionality and art.</p>
                                    <div className="flex justify-center md:justify-start gap-4 text-[#A68B7E]">
                                        <Twitter size={18} />
                                        <Linkedin size={18} />
                                        <Globe size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    <div className="hidden lg:block lg:col-span-2"></div>
                </div>

                <Footer />

                <div className="h-24 lg:h-0" />

                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-[#3B241A]/10 p-3 pb-safe flex justify-around items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <button onClick={handleLike} className="flex flex-col items-center gap-1 min-w-[60px]">
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#F2A7A7] text-[#F2A7A7]' : 'text-[#6E5045]'}`} />
                        <span className={`text-[10px] font-medium ${isLiked ? 'text-[#F2A7A7]' : 'text-[#6E5045]'}`}>{likes > 0 ? likes : 'Like'}</span>
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
