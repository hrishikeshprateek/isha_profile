"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, Upload, Grid, List, ChevronLeft, ChevronRight, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryUpload from '@/components/CloudinaryUpload';

interface MediaFile {
    id: string;
    url: string;
    type: 'image' | 'video';
    name: string;
    uploadedAt: string;
}

interface MediaSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    type?: 'image' | 'video' | 'all';
}

const ITEMS_PER_PAGE = 12;

export default function MediaSelector({ isOpen, onClose, onSelect, type = 'image' }: MediaSelectorProps) {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showUploader, setShowUploader] = useState(false);

    // Load media from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('admin_media_library');
        if (stored) {
            try {
                const parsedMedia = JSON.parse(stored);
                setMedia(parsedMedia);
            } catch {
                setMedia([]);
            }
        }
    }, []);

    // Filter media based on type and search
    let filteredMedia = media;
    if (type !== 'all') {
        filteredMedia = media.filter(item => item.type === type);
    }
    filteredMedia = filteredMedia.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMedia = filteredMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Handle upload
    const handleUploadComplete = (url: string) => {
        if (!url) return;
        const newMedia: MediaFile = {
            id: `media_${Date.now()}`,
            url,
            type: url.includes('video') ? 'video' : 'image',
            name: `Media - ${new Date().toLocaleString()}`,
            uploadedAt: new Date().toISOString(),
        };
        const updatedMedia = [newMedia, ...media];
        setMedia(updatedMedia);
        localStorage.setItem('admin_media_library', JSON.stringify(updatedMedia));
        setShowUploader(false);
    };

    // Handle select
    const handleSelect = (url: string) => {
        onSelect(url);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-4xl max-h-[90vh] bg-[#FAF0E6] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#3B241A]/10">
                        <div>
                            <h2 className="text-2xl font-bold text-[#3B241A]">Select Media</h2>
                            <p className="text-sm text-[#3B241A]/60 mt-1">Choose from your library or upload new</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[#3B241A]/10 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-[#3B241A]" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto flex flex-col">
                        {/* Upload Section */}
                        <AnimatePresence>
                            {showUploader && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-6 border-b border-[#3B241A]/10 bg-white/50"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-[#3B241A]">Upload New Media</h3>
                                        <button
                                            onClick={() => setShowUploader(false)}
                                            className="text-[#3B241A]/60 hover:text-[#3B241A]"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <CloudinaryUpload
                                        onUploadComplete={handleUploadComplete}
                                        folder="media"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Search and Controls */}
                        <div className="p-6 bg-white/30 border-b border-[#3B241A]/10 space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-[#3B241A]/10">
                                    <Search size={18} className="text-[#A68B7E]" />
                                    <input
                                        type="text"
                                        placeholder="Search media..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="flex-1 bg-transparent outline-none text-sm text-[#3B241A] placeholder-[#A68B7E]"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setCurrentPage(1);
                                            }}
                                            className="text-[#A68B7E] hover:text-[#3B241A]"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowUploader(!showUploader)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#3B241A] text-[#FAF0E6] font-bold text-sm hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors whitespace-nowrap"
                                >
                                    <Upload size={16} /> Upload
                                </motion.button>

                                {/* View Toggle */}
                                <div className="flex items-center gap-2 bg-white rounded-lg border border-[#3B241A]/10 p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded transition-colors ${
                                            viewMode === 'grid'
                                                ? 'bg-[#3B241A] text-[#FAF0E6]'
                                                : 'text-[#3B241A]/60 hover:bg-[#3B241A]/5'
                                        }`}
                                    >
                                        <Grid size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded transition-colors ${
                                            viewMode === 'list'
                                                ? 'bg-[#3B241A] text-[#FAF0E6]'
                                                : 'text-[#3B241A]/60 hover:bg-[#3B241A]/5'
                                        }`}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Media Display */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {paginatedMedia.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="text-[#3B241A]/20 mb-4">📁</div>
                                    <p className="text-[#3B241A]/60 font-medium">No media files yet</p>
                                    <button
                                        onClick={() => setShowUploader(true)}
                                        className="mt-4 text-[#F2A7A7] font-bold text-sm hover:text-[#3B241A]"
                                    >
                                        Upload your first media →
                                    </button>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {paginatedMedia.map((item) => (
                                        <motion.button
                                            key={item.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSelect(item.url)}
                                            className="group relative aspect-square rounded-xl overflow-hidden border-2 border-[#3B241A]/10 hover:border-[#F2A7A7] transition-all"
                                        >
                                            {item.type === 'image' ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={item.url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#3B241A]/10 to-[#F2A7A7]/10 flex items-center justify-center">
                                                    <span className="text-2xl">🎬</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <Check size={32} className="text-white" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {paginatedMedia.map((item) => (
                                        <motion.button
                                            key={item.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => handleSelect(item.url)}
                                            className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-[#3B241A]/10 hover:border-[#F2A7A7] hover:bg-[#FAF0E6]/50 transition-all text-left group"
                                        >
                                            <div className="w-16 h-16 rounded-lg bg-[#3B241A]/5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                {item.type === 'image' ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl">🎬</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-[#3B241A] truncate">{item.name}</p>
                                                <p className="text-xs text-[#A68B7E]">
                                                    {item.type.toUpperCase()} • {new Date(item.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Copy size={18} className="text-[#F2A7A7]" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {filteredMedia.length > ITEMS_PER_PAGE && (
                        <div className="flex items-center justify-between gap-4 p-6 border-t border-[#3B241A]/10 bg-white/30">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">
                                {paginatedMedia.length} of {filteredMedia.length}
                            </p>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] disabled:opacity-50"
                                >
                                    <ChevronLeft size={16} />
                                </motion.button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                                        <motion.button
                                            key={page}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                                                currentPage === page
                                                    ? 'bg-[#3B241A] text-[#FAF0E6]'
                                                    : 'bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] hover:bg-white'
                                            }`}
                                        >
                                            {page}
                                        </motion.button>
                                    ))}
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] disabled:opacity-50"
                                >
                                    <ChevronRight size={16} />
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

