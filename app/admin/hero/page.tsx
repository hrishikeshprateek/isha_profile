"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Save, Sparkles, Type, AlignLeft, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import MediaSelector from '@/components/MediaSelector';

interface HeroData {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    ctaSecondaryText: string;
    ctaSecondaryLink: string;
    backgroundImage: string;
    profileImage: string;
}

export default function AdminHeroPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showBgMediaSelector, setShowBgMediaSelector] = useState(false);
    const [showProfileMediaSelector, setShowProfileMediaSelector] = useState(false);

    const [formData, setFormData] = useState<HeroData>({
        title: '',
        subtitle: '',
        description: '',
        ctaText: '',
        ctaLink: '',
        ctaSecondaryText: '',
        ctaSecondaryLink: '',
        backgroundImage: '',
        profileImage: '',
    });

    const getAuthHeaders = useCallback(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }, []);

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

    // Fetch hero data
    const fetchHeroData = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/hero', {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.success && data.data) {
                setFormData(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch hero data:', err);
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        if (isAuthorized) {
            fetchHeroData();
        }
    }, [isAuthorized, fetchHeroData]);

    // Save hero data
    async function handleSave() {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/admin/hero', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Hero section updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to update hero section');
            }
        } catch (err) {
            console.error('Save error:', err);
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
        }
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
                <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Page Sections</p>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Hero Section</h1>
                    <p className="text-sm text-[#3B241A]/60 mt-1">Manage homepage hero section content</p>
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

                {/* Form */}
                <div className="space-y-6">

                    {/* Title */}
                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]">
                            <Type size={16} /> Main Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
                            placeholder="e.g. Isha Rani"
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]">
                                <Type size={16} /> Subtitle / Roles (Typing Effect)
                            </label>
                            <p className="text-xs text-[#A68B7E] mt-1">
                                Add multiple roles separated by commas for typing animation
                            </p>
                        </div>
                        <input
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
                            placeholder="e.g. Content Creator, Travel Vlogger, UI/UX Designer"
                        />
                    </div>

                    {/* Description */}
                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]">
                            <AlignLeft size={16} /> Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all resize-none"
                            placeholder="Brief description..."
                        />
                    </div>

                    {/* CTA Buttons */}
                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-6">
                        <h3 className="text-sm font-bold text-[#3B241A]">Call-to-Action Buttons</h3>

                        {/* Primary CTA */}
                        <div className="space-y-4 p-4 bg-[#FAF0E6]/30 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/80">Primary Button (Filled)</p>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-[#3B241A]/60">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.ctaText}
                                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                    className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
                                    placeholder="e.g. Explore My Journey"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-[#3B241A]/60">
                                    <LinkIcon size={12} /> Button Link
                                </label>
                                <input
                                    type="text"
                                    value={formData.ctaLink}
                                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                    className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
                                    placeholder="e.g. /my_journey"
                                />
                            </div>
                        </div>

                        {/* Secondary CTA */}
                        <div className="space-y-4 p-4 bg-[#3B241A]/5 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/80">Secondary Button (Outline)</p>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-[#3B241A]/60">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.ctaSecondaryText}
                                    onChange={(e) => setFormData({ ...formData, ctaSecondaryText: e.target.value })}
                                    className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
                                    placeholder="e.g. Download CV"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-[#3B241A]/60">
                                    <LinkIcon size={12} /> Button Link
                                </label>
                                <input
                                    type="text"
                                    value={formData.ctaSecondaryLink}
                                    onChange={(e) => setFormData({ ...formData, ctaSecondaryLink: e.target.value })}
                                    className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
                                    placeholder="e.g. /assets/cv.pdf"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Background Image */}
                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]">
                                <ImageIcon size={16} /> Background Image (Optional)
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowBgMediaSelector(true)}
                                type="button"
                                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/60 hover:bg-[#F2A7A7]/20 hover:text-[#F2A7A7] transition-colors"
                            >
                                📁 From Library
                            </motion.button>
                        </div>
                        <CloudinaryUpload
                            currentImage={formData.backgroundImage}
                            onUploadComplete={(url) => setFormData({ ...formData, backgroundImage: url })}
                            folder="hero"
                        />
                    </div>

                    {/* Profile Image */}
                    <div className="bg-white p-6 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]">
                                <ImageIcon size={16} /> Profile Image (Optional)
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowProfileMediaSelector(true)}
                                type="button"
                                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/60 hover:bg-[#F2A7A7]/20 hover:text-[#F2A7A7] transition-colors"
                            >
                                📁 From Library
                            </motion.button>
                        </div>
                        <CloudinaryUpload
                            currentImage={formData.profileImage}
                            onUploadComplete={(url) => setFormData({ ...formData, profileImage: url })}
                            folder="hero"
                        />
                    </div>

                    {/* Save Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#3B241A] text-[#FAF0E6] font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {saving ? (
                            <>
                                <Sparkles className="animate-spin" size={18} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </motion.button>

                </div>

                {/* Media Selector Modals */}
                <MediaSelector
                    isOpen={showBgMediaSelector}
                    onClose={() => setShowBgMediaSelector(false)}
                    onSelect={(url) => setFormData({ ...formData, backgroundImage: url })}
                    type="image"
                />
                <MediaSelector
                    isOpen={showProfileMediaSelector}
                    onClose={() => setShowProfileMediaSelector(false)}
                    onSelect={(url) => setFormData({ ...formData, profileImage: url })}
                    type="image"
                />
            </div>
        </div>
    );
}

