"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Save,
    Sparkles,
    Plus,
    Trash2,
    ArrowLeft,
    Type,
    AlignLeft,
    Image as ImageIcon,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import MediaSelector from '@/components/MediaSelector';

interface Chapter {
    id: string;
    year: string;
    title: string;
    text: string;
    image: string;
    icon?: string;
}

interface JourneyData {
    title: string;
    subtitle: string;
    description: string;
    chapters: Chapter[];
}

export default function AdminMyJourneyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
    const [showMediaSelector, setShowMediaSelector] = useState<string | null>(null);

    const [formData, setFormData] = useState<JourneyData>({
        title: 'My Journey',
        subtitle: 'A story of growth, learning, and digital creation',
        description: 'Discover how I evolved from a photographer to a digital creator',
        chapters: [
            {
                id: '1',
                year: 'The Beginning',
                title: 'It started with a lens',
                text: 'I didn\'t start as a designer. I started as an observer.',
                image: '',
                icon: 'Camera'
            }
        ]
    });

    const getAuthHeaders = useCallback(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }, []);

    // Load existing journey data once authorized
    useEffect(() => {
        async function loadJourney() {
            try {
                const res = await fetch('/api/admin/my-journey', { headers: getAuthHeaders() });
                const data = await res.json();
                if (res.ok && data?.success && data.data) {
                    setFormData({
                        title: data.data.title || 'My Journey',
                        subtitle: data.data.subtitle || '',
                        description: data.data.description || '',
                        chapters: Array.isArray(data.data.chapters) ? data.data.chapters.map((ch: Chapter) => ({
                            ...ch,
                            image: ch.image || '',
                        })) : [],
                    });
                }
            } catch (err) {
                console.error('Failed to load journey data', err);
            }
        }
        if (isAuthorized) {
            loadJourney();
        }
    }, [isAuthorized, getAuthHeaders]);

    // Auth check
    useEffect(() => {
        if (!auth) { router.push('/admin/login'); return; }
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser || !(await firebaseUser.getIdTokenResult()).claims.admin) {
                router.push('/admin/login');
                return;
            }
            localStorage.setItem('admin_token', (await firebaseUser.getIdTokenResult()).token);
            setIsAuthorized(true);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    // Save journey data
    async function handleSave() {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/admin/my-journey', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('My Journey updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to update journey');
            }
        } catch (err) {
            console.error('Save error:', err);
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    }

    // Add chapter
    function addChapter() {
        const newChapter: Chapter = {
            id: Date.now().toString(),
            year: `Year ${formData.chapters.length + 1}`,
            title: 'New Chapter',
            text: 'Add your story here...',
            image: '',
        };
        setFormData({
            ...formData,
            chapters: [...formData.chapters, newChapter],
        });
        setExpandedChapter(newChapter.id);
    }

    // Delete chapter
    function deleteChapter(id: string) {
        if (formData.chapters.length === 1) {
            setError('You must have at least one chapter');
            return;
        }
        setFormData({
            ...formData,
            chapters: formData.chapters.filter(ch => ch.id !== id),
        });
        setExpandedChapter(null);
    }

    // Reorder chapters
    function moveChapter(id: string, direction: 'up' | 'down') {
        const index = formData.chapters.findIndex(ch => ch.id === id);
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === formData.chapters.length - 1)) return;

        const newChapters = [...formData.chapters];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newChapters[index], newChapters[newIndex]] = [newChapters[newIndex], newChapters[index]];

        setFormData({ ...formData, chapters: newChapters });
    }

    // Update chapter
    function updateChapter(id: string, updates: Partial<Chapter>) {
        setFormData({
            ...formData,
            chapters: formData.chapters.map(ch => ch.id === id ? { ...ch, ...updates } : ch),
        });
    }

    if (loading) return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
            <div className="text-center">
                <Sparkles className="animate-spin text-[#3B241A] mx-auto mb-4" size={40} />
                <p className="text-[#3B241A] font-serif">Loading...</p>
            </div>
        </div>
    );

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] p-4 pt-24 md:p-10">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-sm text-[#A68B7E] hover:text-[#3B241A] mb-4"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Page</p>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold">My Journey</h1>
                    </div>
                </div>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-green-100"
                    >
                        {success}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wide border border-red-100"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Page Header Section */}
                <div className="space-y-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]">
                            <Type size={16} /> Page Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]">
                            <Type size={16} /> Subtitle
                        </label>
                        <input
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]">
                            <AlignLeft size={16} /> Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Chapters Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Content</p>
                            <h2 className="text-lg md:text-xl font-serif font-bold">Journey Chapters</h2>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addChapter}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors"
                        >
                            <Plus size={16} /> Add Chapter
                        </motion.button>
                    </div>

                    {/* Chapters List */}
                    <div className="space-y-3">
                        <AnimatePresence>
                            {formData.chapters.map((chapter, index) => (
                                <motion.div
                                    key={chapter.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-2xl border border-[#3B241A]/10 shadow-sm overflow-hidden"
                                >
                                    {/* Chapter Header */}
                                    <button
                                        onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                                        className="w-full p-6 flex items-center justify-between hover:bg-[#FAF0E6]/30 transition-colors"
                                    >
                                        <div className="text-left flex-1">
                                            <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">{chapter.year}</p>
                                            <h3 className="text-lg font-bold text-[#3B241A] mt-1">{chapter.title}</h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: expandedChapter === chapter.id ? 180 : 0 }}
                                            className="text-[#3B241A]/60 ml-4"
                                        >
                                            <ChevronDown size={20} />
                                        </motion.div>
                                    </button>

                                    {/* Chapter Content */}
                                    <AnimatePresence>
                                        {expandedChapter === chapter.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="border-t border-[#3B241A]/10 p-6 space-y-6 bg-[#FAF0E6]/10"
                                            >
                                                {/* Year */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Year / Period</label>
                                                    <input
                                                        type="text"
                                                        value={chapter.year}
                                                        onChange={(e) => updateChapter(chapter.id, { year: e.target.value })}
                                                        className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:border-[#F2A7A7] outline-none transition-all"
                                                    />
                                                </div>

                                                {/* Title */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Chapter Title</label>
                                                    <input
                                                        type="text"
                                                        value={chapter.title}
                                                        onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                                                        className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:border-[#F2A7A7] outline-none transition-all"
                                                    />
                                                </div>

                                                {/* Text */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Story Text</label>
                                                    <textarea
                                                        value={chapter.text}
                                                        onChange={(e) => updateChapter(chapter.id, { text: e.target.value })}
                                                        rows={4}
                                                        className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:border-[#F2A7A7] outline-none transition-all resize-none"
                                                    />
                                                </div>

                                                {/* Image */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60 flex items-center gap-2">
                                                            <ImageIcon size={12} /> Chapter Image
                                                        </label>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setShowMediaSelector(chapter.id)}
                                                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/60 hover:bg-[#F2A7A7]/20 hover:text-[#F2A7A7] transition-colors"
                                                        >
                                                            📁 Gallery
                                                        </motion.button>
                                                    </div>
                                                    <CloudinaryUpload
                                                        currentImage={chapter.image}
                                                        onUploadComplete={(url) => updateChapter(chapter.id, { image: url })}
                                                        folder="my-journey"
                                                    />
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-4 border-t border-[#3B241A]/5">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => moveChapter(chapter.id, 'up')}
                                                        disabled={index === 0}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#3B241A]/60 bg-[#FAF0E6] rounded-lg hover:bg-[#3B241A]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <ChevronUp size={14} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => moveChapter(chapter.id, 'down')}
                                                        disabled={index === formData.chapters.length - 1}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#3B241A]/60 bg-[#FAF0E6] rounded-lg hover:bg-[#3B241A]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <ChevronDown size={14} />
                                                    </motion.button>
                                                    <div className="flex-1" />
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => deleteChapter(chapter.id)}
                                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Media Selector Modal */}
                                    <MediaSelector
                                        isOpen={showMediaSelector === chapter.id}
                                        onClose={() => setShowMediaSelector(null)}
                                        onSelect={(url) => {
                                            updateChapter(chapter.id, { image: url });
                                            setShowMediaSelector(null);
                                        }}
                                        type="image"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-12 flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#3B241A] text-[#FAF0E6] font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {saving ? (
                            <>
                                <Sparkles className="animate-spin" size={18} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Journey
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
