"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Save,
    Plus,
    Trash2,
    ArrowLeft,
    Image as ImageIcon,
    Video,
    Eye,
    EyeOff,
    X,
    Loader2,
    FolderOpen,
    Play,
    Check,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import MediaSelector from '@/components/MediaSelector';

// --- Types ---
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

const CATEGORIES = ['Reels', 'Photography', 'Branding', 'Design', 'Video', 'Other'];

export default function AdminWallPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Data State
    const [items, setItems] = useState<PortfolioItem[]>([]);

    // UI State
    const [selectedItem, setSelectedItem] = useState<string | null>(null); // For Drawer
    const [showMediaSelector, setShowMediaSelector] = useState<string | null>(null); // ID of item requesting media
    const [mediaFieldType, setMediaFieldType] = useState<'src' | 'thumb'>('src');

    const getAuthHeaders = useCallback(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }, []);

    // --- Auth Check ---
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

    // --- Fetch Data ---
    async function fetchItems() {
        try {
            const response = await fetch('/api/admin/wall-items', { headers: getAuthHeaders() });
            const data = await response.json();
            if (data.success && Array.isArray(data.items)) {
                setItems(data.items);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load portfolio.');
        }
    }

    useEffect(() => {
        if (isAuthorized) fetchItems();
    }, [isAuthorized, getAuthHeaders]);

    // --- Actions ---
    function addItem() {
        const newItem: PortfolioItem = {
            id: Date.now().toString(),
            type: 'image',
            category: 'Photography',
            src: '',
            thumb: '',
            title: '',
            client: '',
            desc: '',
            published: true,
        };
        setItems([newItem, ...items]);
        setSelectedItem(newItem.id); // Open drawer immediately
    }

    function deleteItem(id: string) {
        if (!window.confirm("Delete this portfolio item?")) return;
        setItems(prev => prev.filter(item => item.id !== id));
        if (selectedItem === id) setSelectedItem(null);
    }

    function updateItem(id: string, updates: Partial<PortfolioItem>) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    }

    function moveItem(index: number, direction: 'prev' | 'next') {
        if ((direction === 'prev' && index === 0) || (direction === 'next' && index === items.length - 1)) return;
        const newItems = [...items];
        const targetIndex = direction === 'prev' ? index - 1 : index + 1;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setItems(newItems);
    }

    function handleMediaSelect(itemId: string, field: 'src' | 'thumb') {
        setMediaFieldType(field);
        setShowMediaSelector(itemId);
    }

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
                setSuccess('Gallery updated successfully.');
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setError(data.error || 'Failed to save');
            }
        } catch (err) {
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    }

    const activeItem = items.find(i => i.id === selectedItem);

    if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A] font-serif animate-pulse">Loading Studio...</div>;
    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A]">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* --- HEADER --- */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-[#FAF0E6]/95 backdrop-blur-md border-b border-[#3B241A]/5 px-6 py-4">
                <div className="w-full flex flex-wrap items-start gap-3 justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => router.back()} className="p-2 hover:bg-[#3B241A]/5 rounded-full transition-colors text-[#3B241A]/60 hover:text-[#3B241A]">
                            <ArrowLeft size={20}/>
                        </button>
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-xl font-bold font-serif text-[#3B241A] uppercase tracking-wide">Gallery Wall</h1>
                            <span className="text-xs font-bold text-[#3B241A]/40 bg-[#3B241A]/5 px-2 py-0.5 rounded-md">{items.length} Items</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 justify-end flex-1 min-w-[220px]">
                        <AnimatePresence>
                            {success && (
                                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                    <Check size={12}/> Saved
                                </motion.span>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={addItem}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold uppercase tracking-widest hover:bg-[#FAF0E6] transition-colors"
                        >
                            <Plus size={14}/> Add New
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="hidden sm:flex items-center gap-2 px-6 py-2 rounded-lg bg-[#3B241A] text-[#FAF0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors disabled:opacity-50 shadow-lg"
                        >
                            {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>}
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- GRID CONTENT --- */}
            <div className="w-full px-6 pt-[120px] sm:pt-[110px] md:pt-24 pb-28 sm:pb-20 relative z-10">
                {error && <div className="mb-8 text-center bg-red-50 text-red-600 py-2 rounded-lg text-sm font-bold border border-red-100 max-w-xl mx-auto">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* Add Button (Mobile) */}
                    <button
                        onClick={addItem}
                        className="md:hidden min-h-[200px] rounded-2xl border-2 border-dashed border-[#3B241A]/10 flex flex-col items-center justify-center gap-3 text-[#3B241A]/40 hover:text-[#3B241A] hover:bg-[#FAF0E6] transition-colors"
                    >
                        <Plus size={24}/> <span className="text-sm font-bold uppercase tracking-widest">Add Item</span>
                    </button>

                    <AnimatePresence mode='popLayout'>
                        {items.map((item, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={item.id}
                                onClick={() => setSelectedItem(item.id)}
                                className={`group relative bg-white rounded-2xl border cursor-pointer hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                                    selectedItem === item.id
                                        ? 'border-[#3B241A] ring-1 ring-[#3B241A] shadow-2xl'
                                        : 'border-[#3B241A]/5 shadow-sm hover:shadow-lg'
                                }`}
                            >
                                {/* Thumbnail Area */}
                                <div className="relative aspect-[4/3] bg-[#FAF0E6] overflow-hidden">
                                    {item.thumb || item.src ? (
                                        <Image
                                            src={item.thumb || item.src}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[#3B241A]/20">
                                            {item.type === 'video' ? <Video size={32}/> : <ImageIcon size={32}/>}
                                        </div>
                                    )}

                                    {/* Type Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest text-[#3B241A] flex items-center gap-1 shadow-sm">
                                            {item.type === 'video' ? <Video size={10}/> : <ImageIcon size={10}/>} {item.category}
                                        </span>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ring-2 ring-white ${item.published ? 'bg-green-500' : 'bg-gray-300'}`} />

                                    {/* Edit Overlay */}
                                    <div className="absolute inset-0 bg-[#3B241A]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <span className="bg-white px-4 py-2 rounded-full text-xs font-bold text-[#3B241A] shadow-md">Edit Details</span>
                                    </div>
                                </div>

                                {/* Info Area */}
                                <div className="p-4">
                                    <h3 className="font-bold text-[#3B241A] text-sm truncate">{item.title || 'Untitled Project'}</h3>
                                    <p className="text-xs text-[#A68B7E] mt-0.5 truncate">{item.client || 'No Client'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- SLIDE-OVER EDIT DRAWER --- */}
            <AnimatePresence>
                {selectedItem && activeItem && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="fixed inset-0 bg-[#3B241A]/20 backdrop-blur-sm z-50"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] bg-[#FAF0E6] z-50 shadow-2xl border-l border-[#3B241A]/10 flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[#3B241A]/5 bg-[#FAF0E6]/95 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-[#3B241A]">Edit Item</h2>
                                    <p className="text-[10px] uppercase tracking-widest text-[#A68B7E]">Portfolio Details</p>
                                </div>
                                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-[#3B241A]/5 rounded-full text-[#3B241A]/40 hover:text-[#3B241A] transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">

                                {/* 1. Visibility & Type */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-[#3B241A]/5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] mb-2 block">Format</label>
                                        <div className="flex gap-2">
                                            {['image', 'video'].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => updateItem(activeItem.id, { type: type as 'image' | 'video' })}
                                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                                                        activeItem.type === type ? 'bg-[#3B241A] text-white' : 'bg-[#FAF0E6] text-[#3B241A]/60'
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-[#3B241A]/5 flex flex-col justify-between">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] block">Status</label>
                                        <button
                                            onClick={() => updateItem(activeItem.id, { published: !activeItem.published })}
                                            className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                                                activeItem.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}
                                        >
                                            {activeItem.published ? <><Eye size={12}/> Live</> : <><EyeOff size={12}/> Draft</>}
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Media Uploads */}
                                <div className="space-y-4">
                                    {/* Main Source */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E]">
                                                {activeItem.type === 'video' ? 'Video Source URL' : 'Main Image URL'}
                                            </label>
                                            <button onClick={() => handleMediaSelect(activeItem.id, 'src')} className="text-[10px] font-bold text-[#F2A7A7] hover:text-[#3B241A] flex items-center gap-1">
                                                <FolderOpen size={10}/> Open Gallery
                                            </button>
                                        </div>
                                        <div className="bg-white p-2 rounded-xl border border-[#3B241A]/10">
                                            <CloudinaryUpload
                                                currentImage={activeItem.src}
                                                onUploadComplete={(url) => updateItem(activeItem.id, { src: url })}
                                                folder="portfolio"
                                            />
                                        </div>
                                    </div>

                                    {/* Thumbnail (Video Only) */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E]">
                                                Thumbnail / Cover
                                            </label>
                                            <button onClick={() => handleMediaSelect(activeItem.id, 'thumb')} className="text-[10px] font-bold text-[#F2A7A7] hover:text-[#3B241A] flex items-center gap-1">
                                                <FolderOpen size={10}/> Open Gallery
                                            </button>
                                        </div>
                                        <div className="bg-white p-2 rounded-xl border border-[#3B241A]/10">
                                            <CloudinaryUpload
                                                currentImage={activeItem.thumb}
                                                onUploadComplete={(url) => updateItem(activeItem.id, { thumb: url })}
                                                folder="portfolio/thumbs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Text Details */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] ml-1">Title</label>
                                            <input
                                                type="text"
                                                value={activeItem.title}
                                                onChange={(e) => updateItem(activeItem.id, { title: e.target.value })}
                                                className="w-full bg-white border border-[#3B241A]/10 rounded-xl px-4 py-3 text-sm font-bold text-[#3B241A] outline-none focus:border-[#F2A7A7] transition-all"
                                                placeholder="Project Name"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] ml-1">Client</label>
                                            <input
                                                type="text"
                                                value={activeItem.client}
                                                onChange={(e) => updateItem(activeItem.id, { client: e.target.value })}
                                                className="w-full bg-white border border-[#3B241A]/10 rounded-xl px-4 py-3 text-sm text-[#3B241A] outline-none focus:border-[#F2A7A7] transition-all"
                                                placeholder="Client Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] ml-1">Category</label>
                                        <div className="relative">
                                            <select
                                                value={activeItem.category}
                                                onChange={(e) => updateItem(activeItem.id, { category: e.target.value })}
                                                className="w-full bg-white border border-[#3B241A]/10 rounded-xl px-4 py-3 text-sm text-[#3B241A] outline-none focus:border-[#F2A7A7] appearance-none"
                                            >
                                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-50">▼</div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#A68B7E] ml-1">Description</label>
                                        <textarea
                                            value={activeItem.desc}
                                            onChange={(e) => updateItem(activeItem.id, { desc: e.target.value })}
                                            rows={4}
                                            className="w-full bg-white border border-[#3B241A]/10 rounded-xl px-4 py-3 text-sm text-[#3B241A] outline-none focus:border-[#F2A7A7] transition-all resize-none leading-relaxed"
                                            placeholder="Brief description about the project..."
                                        />
                                    </div>
                                </div>

                                {/* Media Selector Overlay (Inside Drawer) */}
                                {showMediaSelector === activeItem.id && (
                                    <div className="relative z-50">
                                        <MediaSelector
                                            isOpen={true}
                                            onClose={() => setShowMediaSelector(null)}
                                            onSelect={(url) => {
                                                updateItem(activeItem.id, { [mediaFieldType]: url });
                                                setShowMediaSelector(null);
                                            }}
                                            type={activeItem.type === 'video' ? 'video' : 'image'}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 border-t border-[#3B241A]/5 bg-white flex justify-between items-center gap-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const idx = items.findIndex(i => i.id === activeItem.id);
                                            moveItem(idx, 'prev');
                                        }}
                                        className="p-2.5 rounded-xl border border-[#3B241A]/10 hover:bg-[#FAF0E6] text-[#3B241A] transition-colors"
                                    >
                                        <ArrowUp size={16}/>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const idx = items.findIndex(i => i.id === activeItem.id);
                                            moveItem(idx, 'next');
                                        }}
                                        className="p-2.5 rounded-xl border border-[#3B241A]/10 hover:bg-[#FAF0E6] text-[#3B241A] transition-colors"
                                    >
                                        <ArrowDown size={16}/>
                                    </button>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => deleteItem(activeItem.id)}
                                        className="p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={20}/>
                                    </button>
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="px-8 py-3 bg-[#3B241A] text-[#FAF0E6] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-lg"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Action Bar */}
            <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-[#FAF0E6]/98 backdrop-blur-md border-t border-[#3B241A]/10 shadow-2xl p-4 flex items-center gap-3">
                <button
                    onClick={addItem}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold uppercase tracking-widest hover:bg-[#FAF0E6] transition-colors"
                >
                    <Plus size={14}/> Add
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#3B241A] text-[#FAF0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors disabled:opacity-50 shadow-lg"
                >
                    {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>

         </div>
     );
 }
