"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Save,
    ArrowLeft,
    Image as ImageIcon,
    MessageSquare,
    User,
    Sparkles,
    Loader,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FormData {
    name: string;
    designation: string;
    company: string;
    testimonial: string;
    image: string;
    rating: number;
}

export default function EditTestimonialPage() {
    const router = useRouter();
    const params = useParams();
    const testimonialId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState<FormData>({
        name: '',
        designation: '',
        company: '',
        testimonial: '',
        image: '',
        rating: 5
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

    // Load existing testimonial
    useEffect(() => {
        async function loadTestimonial() {
            try {
                const token = localStorage.getItem('admin_token');
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const res = await fetch(`/api/admin/wall?id=${testimonialId}`, { headers });
                const data = await res.json();
                if (res.ok && data.success && data.items?.length) {
                    const item = data.items[0];
                    setFormData({
                        name: item.name || '',
                        designation: item.designation || '',
                        company: item.company || '',
                        testimonial: item.testimonial || '',
                        image: item.image || '',
                        rating: item.rating || 5
                    });
                } else {
                    setError('Unable to load testimonial.');
                }
            } catch (err) {
                setError('Failed to load testimonial.');
                console.error('Load error:', err);
            }
        }

        if (testimonialId) loadTestimonial();
    }, [testimonialId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        if (!formData.name || !formData.testimonial) {
            setError('Name and testimonial text are required');
            setSaving(false);
            return;
        }

        try {
            const token = localStorage.getItem('admin_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const payload = {
                id: testimonialId,
                ...formData,
                date: new Date().toISOString().split('T')[0],
            };

            const res = await fetch('/api/admin/wall', {
                method: 'PUT',
                headers,
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSuccess('Testimonial updated successfully!');
                setTimeout(() => {
                    router.push('/admin/testimonials');
                }, 1200);
            } else {
                setError(data.error || 'Failed to update testimonial');
            }
        } catch (err) {
            setError('An error occurred while saving.');
            console.error('Save error:', err);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="text-[#3B241A]" size={40} />
            </motion.div>
        </div>
    );

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] p-6 pt-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-[#3B241A]/10 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </motion.button>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">Edit</p>
                        <h1 className="text-3xl font-serif font-bold">Update Testimonial</h1>
                    </div>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">Name *</label>
                        <div className="flex items-center gap-2 bg-white border border-[#3B241A]/10 rounded-lg px-3 py-2">
                            <User size={16} className="text-[#A68B7E]" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Person's full name"
                                className="w-full bg-transparent outline-none text-[#3B241A]"
                            />
                        </div>
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">Designation</label>
                        <div className="flex items-center gap-2 bg-white border border-[#3B241A]/10 rounded-lg px-3 py-2">
                            <MessageSquare size={16} className="text-[#A68B7E]" />
                            <input
                                type="text"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                placeholder="e.g., CEO, Photographer"
                                className="w-full bg-transparent outline-none text-[#3B241A]"
                            />
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">Company / Organization</label>
                        <div className="flex items-center gap-2 bg-white border border-[#3B241A]/10 rounded-lg px-3 py-2">
                            <MessageSquare size={16} className="text-[#A68B7E]" />
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="e.g., Brand Name"
                                className="w-full bg-transparent outline-none text-[#3B241A]"
                            />
                        </div>
                    </div>

                    {/* Testimonial Text */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">Testimonial *</label>
                        <div className="flex items-start gap-2 bg-white border border-[#3B241A]/10 rounded-lg px-3 py-2">
                            <MessageSquare size={16} className="text-[#A68B7E] mt-2" />
                            <textarea
                                value={formData.testimonial}
                                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                                placeholder="What do you love about this work?"
                                rows={5}
                                className="w-full bg-transparent outline-none text-[#3B241A] resize-none"
                            />
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">Rating</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="transition-colors"
                                >
                                    <Star
                                        size={24}
                                        className={star <= formData.rating ? 'fill-[#F2A7A7] text-[#F2A7A7]' : 'text-[#3B241A]/20'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">Profile Image URL</label>
                        <div className="flex items-center gap-2 bg-white border border-[#3B241A]/10 rounded-lg px-3 py-2">
                            <ImageIcon size={16} className="text-[#A68B7E]" />
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://..."
                                className="w-full bg-transparent outline-none text-[#3B241A]"
                            />
                        </div>
                    </div>

                    {/* Image Preview */}
                    {formData.image && (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-[#3B241A]/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Messages */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-100"
                        >
                            {success}
                        </motion.div>
                    )}

                    {/* Submit */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#3B241A] text-[#FAF0E6] font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving ? (
                            <>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                    <Loader size={16} />
                                </motion.div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Update Testimonial
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
}


