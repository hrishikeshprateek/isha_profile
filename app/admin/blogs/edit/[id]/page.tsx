"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getQuillModulesWithCloudinary } from '@/lib/cloudinary-helpers';
import {
  Save,
  ArrowLeft,
  Tag,
  Type,
  AlignLeft,
  Clock,
  Sparkles,
  PenTool
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import MediaSelector from '@/components/MediaSelector';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-[#FAF0E6]/20 animate-pulse rounded-3xl flex items-center justify-center">
      <span className="text-[#3B241A]/20 font-serif italic">Loading Editor...</span>
    </div>
  )
});

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  tags: string;
  readTime: string;
  author: string;
  published?: boolean;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);

  // Get Quill modules with Cloudinary integration
  const quillModules = getQuillModulesWithCloudinary('blogs');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    image: '',
    tags: '',
    readTime: '',
    author: 'Isha Rani',
    published: true
  });

  // Auth check
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

  // Load existing blog
  useEffect(() => {
    async function loadBlog() {
      try {
        const res = await fetch(`/api/admin/blogs?id=${blogId}`);
        const data = await res.json();
        if (res.ok && data.success && data.blogs?.length) {
          const blog = data.blogs[0];
          setFormData({
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            category: blog.category || 'General',
            image: blog.image || '',
            tags: (blog.tags || []).join(', '),
            readTime: blog.readTime || '',
            author: blog.author || 'Isha Rani',
            published: blog.published !== false,
          });
        } else {
          setError('Unable to load blog.');
        }
      } catch (err) {
        setError('Failed to load blog.');
        console.error('Load blog error:', err);
      }
    }

    if (blogId) loadBlog();
  }, [blogId]);

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
        id: blogId,
        ...formData,
        tags: formData.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      };

      const res = await fetch('/api/admin/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/blogs');
      } else {
        setError(data.error || 'Failed to update blog');
      }
    } catch (err) {
      setError('An error occurred while saving.');
      console.error('Save error:', err);
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

      {/* HEADER */}
      <div className="fixed md:sticky top-0 left-0 w-full z-50 bg-[#FAF0E6]/95 backdrop-blur-md border-b border-[#3B241A]/5 px-4 md:px-6 py-3 md:py-4 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-[#3B241A]/5 rounded-full transition-colors text-[#3B241A]/60 hover:text-[#3B241A]">
              <ArrowLeft size={20}/>
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold hidden md:block">Journal</p>
              <h1 className="text-lg md:text-2xl font-serif font-bold leading-none mt-0 md:mt-1">Edit Story</h1>
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
              <Save size={14}/> {saving ? 'Saving...' : 'Update'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
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
                modules={quillModules}
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/40">Cover Image</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMediaSelectorOpen(true)}
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/60 hover:bg-[#F2A7A7]/20 hover:text-[#F2A7A7] transition-colors"
                >
                  📁 From Library
                </motion.button>
              </div>

              <CloudinaryUpload
                currentImage={formData.image}
                onUploadComplete={(url) => setFormData({...formData, image: url})}
                folder="blogs"
              />

              {/* Alternative: Manual URL Input (optional) */}
              <div className="pt-4 border-t border-[#3B241A]/5">
                <details className="group">
                  <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/40 hover:text-[#3B241A]/60 transition-colors list-none flex items-center gap-2">
                    <span>Or paste URL manually</span>
                    <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all placeholder:text-[#3B241A]/20"
                      placeholder="https://..."
                    />
                  </div>
                </details>
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

      {/* Media Selector Modal */}
      <MediaSelector
        isOpen={mediaSelectorOpen}
        onClose={() => setMediaSelectorOpen(false)}
        onSelect={(url) => setFormData({...formData, image: url})}
        type="image"
      />
    </div>
  );
}

