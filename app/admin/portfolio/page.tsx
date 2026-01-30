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
    Image as ImageIcon,
    Video,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import MediaSelector from '@/components/MediaSelector';

interface PortfolioItem {
    id: string;
    type: 'video' | 'image';
    category: string;
    src: string;
    thumb: string;
    title: string;
    client: string;
    desc: string;
    published?: boolean;
}

const CATEGORIES = ['Reels', 'Photography', 'Branding', 'Design', 'Other'];

export default function AdminWallPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [showMediaSelector, setShowMediaSelector] = useState<string | null>(null);
    const [mediaFieldType, setMediaFieldType] = useState<'src' | 'thumb'>('src');

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

    // Fetch portfolio items
    async function fetchItems() {
        try {
            const response = await fetch('/api/admin/wall-items', {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.success && Array.isArray(data.items)) {
                setItems(data.items);
            }
        } catch (err) {
            console.error('Failed to fetch portfolio items:', err);
            setError('Failed to load portfolio items');
        }
    }

    useEffect(() => {
        if (isAuthorized) {
            fetchItems();
        }
    }, [isAuthorized, getAuthHeaders]);

    // Add item
    function addItem() {
        const newItem: PortfolioItem = {
            id: Date.now().toString(),
            type: 'image',
            category: 'Photography',
            src: '',
            thumb: '',
            title: 'New Portfolio Item',
            client: '',
            desc: 'Add description here...',
            published: true,
        };
        setItems([...items, newItem]);
        setExpandedId(newItem.id);
    }

    // Delete item
    function deleteItem(id: string) {
        setItems(items.filter(item => item.id !== id));
        setExpandedId(null);
    }

    // Update item
    function updateItem(id: string, updates: Partial<PortfolioItem>) {
        setItems(
            items.map(item => item.id === id ? { ...item, ...updates } : item)
        );
    }

    // Reorder items
    function moveItem(id: string, direction: 'up' | 'down') {
        const index = items.findIndex(item => item.id === id);
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;

        const newItems = [...items];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

        setItems(newItems);
    }

    // Handle media selection
    function handleMediaSelect(itemId: string, field: 'src' | 'thumb') {
        setMediaFieldType(field);
        setShowMediaSelector(itemId);
    }

    // Save all items
    async function handleSave() {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/admin/wall-items', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ items }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Portfolio updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to update portfolio');
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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-sm text-[#A68B7E] hover:text-[#3B241A] mb-4"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Gallery</p>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold">Portfolio Gallery</h1>
                        <p className="text-sm text-[#A68B7E] mt-2">Manage your work showcase (images & videos)</p>
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

                {/* Portfolio Items Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Content</p>
                            <h2 className="text-lg md:text-xl font-serif font-bold">Portfolio Items</h2>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addItem}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors"
                        >
                            <Plus size={16} /> Add Item
                        </motion.button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                        <AnimatePresence>
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-2xl border border-[#3B241A]/10 shadow-sm overflow-hidden"
                                >
                                    {/* Header */}
                                    <button
                                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                        className="w-full p-6 flex items-center justify-between hover:bg-[#FAF0E6]/30 transition-colors"
                                    >
                                        <div className="text-left flex-1 flex items-center gap-4">
                                            {item.type === 'video' ? (
                                                <Video size={24} className="text-[#F2A7A7]" />
                                            ) : (
                                                <ImageIcon size={24} className="text-[#F2A7A7]" />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">{item.category}</p>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F2A7A7]/10 text-[#F2A7A7]">{item.type}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-[#3B241A] mt-1">{item.title}</h3>
                                                <p className="text-sm text-[#A68B7E] mt-1">{item.client}</p>
                                            </div>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                                            className="text-[#3B241A]/60 ml-4"
                                        >
                                            <ChevronDown size={20} />
                                        </motion.div>
                                    </button>

                                    {/* Content */}
                                    <AnimatePresence>
                                        {expandedId === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="border-t border-[#3B241A]/10 p-6 space-y-6 bg-[#FAF0E6]/10"
                                            >
                                                {/* Type */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Type *</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                value="image"
                                                                checked={item.type === 'image'}
                                                                onChange={(e) => updateItem(item.id, { type: e.target.value as 'image' | 'video' })}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">Image</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                value="video"
                                                                checked={item.type === 'video'}
                                                                onChange={(e) => updateItem(item.id, { type: e.target.value as 'image' | 'video' })}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">Video</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Category */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Category *</label>
                                                    <select
                                                        value={item.category}
                                                        onChange={(e) => updateItem(item.id, { category: e.target.value })}
                                                        className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:border-[#F2A7A7] outline-none transition-all"
                                                    >
                                                        {CATEGORIES.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Title */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Title *</label>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                                        className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:border-[#F2A7A7] outline-none transition-all"
                                                    />
                                                </div>

                                                {/* Client */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Client</label>
                                                    <input
                                                        type="text"
                                                        value={item.client}
                                                        onChange={(e) => updateItem(item.id, { client: e.target.value })}
                                                        className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:border-[#F2A7A7] outline-none transition-all"
                                                        placeholder="e.g., Vogue, Urban Outfitters"
                                                    />
                                                </div>

                                                {/* Description */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Description *</label>
                                                    <textarea
                                                        value={item.desc}
                                                        onChange={(e) => updateItem(item.id, { desc: e.target.value })}
                                                        rows={3}
                                                        className="w-full bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5 focus:border-[#F2A7A7] outline-none transition-all resize-none"
                                                    />
                                                </div>

                                                {/* Source URL */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">
                                                            {item.type === 'video' ? 'Video URL *' : 'Image URL *'}
                                                        </label>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleMediaSelect(item.id, 'src')}
                                                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/60 hover:bg-[#F2A7A7]/20 hover:text-[#F2A7A7] transition-colors"
                                                        >
                                                            📁 Gallery
                                                        </motion.button>
                                                    </div>
                                                    <CloudinaryUpload
                                                        currentImage={item.src}
                                                        onUploadComplete={(url) => updateItem(item.id, { src: url })}
                                                        folder="portfolio"
                                                    />
                                                </div>

                                                {/* Thumbnail URL */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Thumbnail URL *</label>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleMediaSelect(item.id, 'thumb')}
                                                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/60 hover:bg-[#F2A7A7]/20 hover:text-[#F2A7A7] transition-colors"
                                                        >
                                                            📁 Gallery
                                                        </motion.button>
                                                    </div>
                                                    <CloudinaryUpload
                                                        currentImage={item.thumb}
                                                        onUploadComplete={(url) => updateItem(item.id, { thumb: url })}
                                                        folder="portfolio/thumbs"
                                                    />
                                                </div>

                                                {/* Published Status */}
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.published !== false}
                                                        onChange={(e) => updateItem(item.id, { published: e.target.checked })}
                                                        className="w-4 h-4 rounded"
                                                    />
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Publish to Wall</label>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-4 border-t border-[#3B241A]/5">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => moveItem(item.id, 'up')}
                                                        disabled={index === 0}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#3B241A]/60 bg-[#FAF0E6] rounded-lg hover:bg-[#3B241A]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <ChevronUp size={14} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => moveItem(item.id, 'down')}
                                                        disabled={index === items.length - 1}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#3B241A]/60 bg-[#FAF0E6] rounded-lg hover:bg-[#3B241A]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <ChevronDown size={14} />
                                                    </motion.button>
                                                    <div className="flex-1" />
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => deleteItem(item.id)}
                                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Media Selector Modal */}
                                    {showMediaSelector === item.id && (
                                        <MediaSelector
                                            isOpen={true}
                                            onClose={() => setShowMediaSelector(null)}
                                            onSelect={(url) => {
                                                updateItem(item.id, { [mediaFieldType]: url });
                                                setShowMediaSelector(null);
                                            }}
                                            type={item.type === 'video' ? 'video' : 'image'}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {items.length === 0 && (
                        <div className="text-center py-12">
                            <ImageIcon className="mx-auto mb-4 text-[#A68B7E]/30" size={48} />
                            <p className="text-[#A68B7E] font-serif mb-4">No portfolio items yet</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={addItem}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B241A] text-[#FAF0E6] text-sm font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors"
                            >
                                <Plus size={18} /> Add First Item
                            </motion.button>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                {items.length > 0 && (
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
                                    Save Portfolio
                                </>
                            )}
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
}

