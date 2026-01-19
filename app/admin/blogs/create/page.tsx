"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Tag,
    Type,
    AlignLeft,
    Clock,
    Sparkles,
    PenTool
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// 1. DYNAMIC IMPORT
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => (
        <div className="h-96 bg-[#FAF0E6]/20 animate-pulse rounded-3xl flex items-center justify-center">
            <span className="text-[#3B241A]/20 font-serif italic">Loading Editor...</span>
        </div>
    )
});
import 'react-quill-new/dist/quill.snow.css';

// 2. FULL FEATURES CONFIGURATION
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'code-block'],
        ['clean']
    ],
};

export default function CreateBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        image: '',
        tags: '',
        readTime: '',
        author: 'Isha Rani'
    });

    useEffect(() => {
        if (!auth) { router.push('/auth/login'); return; }
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser || !(await firebaseUser.getIdTokenResult()).claims.admin) {
                router.push('/auth/login');
                return;
            }
            localStorage.setItem('admin_token', (await firebaseUser.getIdTokenResult()).token);
            setIsAuthorized(true);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        if (!formData.title || !formData.content) {
            setError('Title and Content are required');
            setSaving(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            };

            const res = await fetch('/api/admin/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/blogs');
            } else {
                setError(data.error || 'Failed to create blog');
            }
        } catch (err) {
            setError('An error occurred while saving.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center flex-col gap-4">
            <Sparkles className="animate-spin text-[#3B241A]" />
            <span className="text-[#3B241A] font-bold tracking-widest text-xs uppercase">Loading Studio...</span>
        </div>
    );
    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A] pb-32">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* HEADER CONFIGURATION
                Mobile: fixed top-0 (Pins it so it doesn't scroll)
                Desktop: sticky top-0 (Standard sticky behavior)
            */}
            <div className="fixed md:sticky top-0 left-0 w-full z-50 bg-[#FAF0E6]/95 backdrop-blur-md border-b border-[#3B241A]/5 px-4 md:px-6 py-3 md:py-4 shadow-sm transition-all">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-[#3B241A]/5 rounded-full transition-colors text-[#3B241A]/60 hover:text-[#3B241A]">
                            <ArrowLeft size={20}/>
                        </button>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold hidden md:block">Journal</p>
                            <h1 className="text-lg md:text-2xl font-serif font-bold leading-none mt-0 md:mt-1">New Story</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/admin/blogs')} className="hidden md:block text-xs font-bold uppercase tracking-widest text-[#A68B7E] hover:text-[#3B241A] px-4">
                            Discard
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] disabled:opacity-50 transition-colors shadow-lg"
                        >
                            <Save size={14}/> {saving ? 'Saving...' : 'Publish'}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT
                Mobile: pt-24 (Adds padding so content starts BELOW the fixed header)
                Desktop: pt-8 (Resets padding since header is sticky)
            */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 pt-24 md:pt-8">

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 flex items-center gap-3 animate-pulse">
                        <div className="w-2 h-2 bg-red-500 rounded-full"/>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT: MAIN EDITOR (8 Cols) --- */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Title Input */}
                        <div className="group relative">
                            <input
                                type="text"
                                placeholder="Enter your title here..."
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full text-3xl md:text-5xl font-serif font-bold text-[#3B241A] placeholder:text-[#3B241A]/10 bg-transparent outline-none border-b-2 border-transparent focus:border-[#F2A7A7] pb-4 transition-all"
                            />
                            <PenTool className="absolute right-0 top-1/2 -translate-y-1/2 text-[#3B241A]/10 opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                        </div>

                        {/* The Editor */}
                        <div className="bg-white rounded-[32px] border border-[#3B241A]/5 shadow-sm min-h-[500px] md:min-h-[600px] overflow-hidden relative">
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(content) => setFormData({...formData, content})}
                                modules={modules}
                                className="h-full"
                            />
                        </div>
                    </div>

                    {/* --- RIGHT: METADATA SIDEBAR (4 Cols) --- */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Details Card */}
                        <div className="bg-white p-6 rounded-[32px] border border-[#3B241A]/5 shadow-sm space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/40 mb-2">Story Details</h3>

                            {/* Excerpt */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#3B241A]/60"><AlignLeft size={12}/> Excerpt</label>
                                <textarea
                                    rows={4}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                                    className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all resize-none placeholder:text-[#3B241A]/20"
                                    placeholder="A brief teaser for the card view..."
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#3B241A]/60"><Tag size={12}/> Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all placeholder:text-[#3B241A]/20"
                                    placeholder="e.g. Technology"
                                />
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#3B241A]/60"><Type size={12}/> Tags</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                    className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all placeholder:text-[#3B241A]/20"
                                    placeholder="react, tutorial, code"
                                />
                            </div>

                            {/* Read Time */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#3B241A]/60"><Clock size={12}/> Read Time</label>
                                <input
                                    type="text"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                                    className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all placeholder:text-[#3B241A]/20"
                                    placeholder="e.g. 5 min read"
                                />
                            </div>
                        </div>

                        {/* Cover Media Card */}
                        <div className="bg-white p-6 rounded-[32px] border border-[#3B241A]/5 shadow-sm space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/40 mb-2">Cover Assets</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#3B241A]/60"><ImageIcon size={12}/> Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all placeholder:text-[#3B241A]/20"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Visual Preview */}
                            <div className="relative w-full h-40 bg-[#FAF0E6] rounded-xl overflow-hidden border border-[#3B241A]/10 flex items-center justify-center">
                                {formData.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-[#3B241A]/20">
                                        <ImageIcon size={24} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* CUSTOM STYLING FOR QUILL EDITOR TO MATCH THEME */}
            <style jsx global>{`
                .quill {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .ql-toolbar {
                    border: none !important;
                    border-bottom: 1px solid rgba(59, 36, 26, 0.05) !important;
                    background: #FAF0E6;
                    padding: 12px !important;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .ql-container {
                    border: none !important;
                    flex: 1;
                    font-family: inherit;
                    font-size: 1.1rem;
                    color: #3B241A;
                    overflow-y: auto;
                }
                .ql-editor {
                    padding: 32px;
                    min-height: 500px;
                    line-height: 1.8;
                }
                .ql-editor.ql-blank::before {
                    color: rgba(59, 36, 26, 0.2);
                    font-style: italic;
                    font-size: 1.1rem;
                }

                /* Toolbar Icons Color */
                .ql-snow .ql-stroke {
                    stroke: #3B241A !important;
                    opacity: 0.6;
                }
                .ql-snow .ql-fill {
                    fill: #3B241A !important;
                    opacity: 0.6;
                }
                .ql-snow .ql-picker {
                    color: #3B241A !important;
                }
                .ql-snow .ql-active .ql-stroke {
                    stroke: #F2A7A7 !important;
                    opacity: 1;
                }
                /* Dropdown fix for Quill on mobile */
                .ql-picker-options {
                    background-color: white !important;
                    border: 1px solid rgba(59, 36, 26, 0.1) !important;
                    border-radius: 8px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </div>
    );
}

