"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Save,
    ArrowLeft,
    Sparkles,
    Loader
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FormData {
    text: string;
    author: string;
    category: string;
}

const CATEGORIES = ['Inspiration', 'Wisdom', 'Motivation', 'Life', 'Travel', 'General'];

export default function EditQuotePage() {
    const router = useRouter();
    const params = useParams();
    const quoteId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState<FormData>({
        text: '',
        author: '',
        category: 'General'
    });

    // Fetch existing quote
    useEffect(() => {
        async function fetchQuote() {
            try {
                const token = localStorage.getItem('admin_token');
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const res = await fetch(`/api/admin/quotes?id=${quoteId}`, { headers });
                const data = await res.json();
                if (data.success && data.quotes && data.quotes.length > 0) {
                    const quote = data.quotes[0];
                    setFormData({
                        text: quote.text,
                        author: quote.author,
                        category: quote.category || 'General'
                    });
                }
            } catch (err) {
                setError('Failed to load quote');
                console.error('Fetch quote error:', err);
            }
        }

        if (quoteId) {
            fetchQuote();
        }
    }, [quoteId]);

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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        if (!formData.text || !formData.author) {
            setError('Quote text and author are required');
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

            const res = await fetch('/api/admin/quotes', {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    id: quoteId,
                    ...formData,
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSuccess('Quote updated successfully!');
                setTimeout(() => {
                    router.push('/admin/quotes');
                }, 1500);
            } else {
                setError(data.error || 'Failed to update quote');
            }
        } catch (err) {
            setError('An error occurred while saving.');
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
                        <h1 className="text-3xl font-serif font-bold">Update Quote</h1>
                    </div>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Quote Text */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">
                            Quote Text *
                        </label>
                        <textarea
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            placeholder="Enter the quote text..."
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-[#3B241A]/10 bg-white text-[#3B241A] placeholder-[#A68B7E] focus:outline-none focus:border-[#F2A7A7] font-serif text-base"
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">
                            Author *
                        </label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            placeholder="Quote author..."
                            className="w-full px-4 py-3 rounded-lg border border-[#3B241A]/10 bg-white text-[#3B241A] placeholder-[#A68B7E] focus:outline-none focus:border-[#F2A7A7]"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-[#3B241A] mb-2">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-[#3B241A]/10 bg-white text-[#3B241A] focus:outline-none focus:border-[#F2A7A7]"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

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

                    {/* Submit Button */}
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
                                Update Quote
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
}

