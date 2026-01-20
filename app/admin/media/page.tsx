"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Plus,
    Trash2,
    Copy,
    Download,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    Sparkles,
    Image as ImageIcon,
    Play,
    Grid,
    List,
    Loader2,
    Upload,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryUpload from '@/components/CloudinaryUpload';

interface MediaFile {
    id: string;
    url: string;
    type: 'image' | 'video';
    name: string;
    size: number;
    uploadedAt: string;
    publicId: string;
}

const ITEMS_PER_PAGE = 12;

export default function AdminMediaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [uploading, setUploading] = useState(false);
    const [selectedForCopy, setSelectedForCopy] = useState<string | null>(null);
    const [showUploader, setShowUploader] = useState(false);

    // Filter media based on search
    const filteredMedia = media.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMedia = filteredMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

    // Fetch stored media from localStorage (in production, use database)
    useEffect(() => {
        if (isAuthorized) {
            const stored = localStorage.getItem('admin_media_library');
            if (stored) {
                try {
                    setMedia(JSON.parse(stored));
                } catch {
                    setMedia([]);
                }
            }

            // Listen for storage changes from other tabs/windows or components
            const handleStorageChange = () => {
                const updated = localStorage.getItem('admin_media_library');
                if (updated) {
                    try {
                        setMedia(JSON.parse(updated));
                    } catch {
                        setMedia([]);
                    }
                }
            };

            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, [isAuthorized]);

    // Handle upload complete
    const handleUploadComplete = (url: string) => {
        if (!url) return;

        const newMedia: MediaFile = {
            id: `media_${Date.now()}`,
            url,
            type: url.includes('video') ? 'video' : 'image',
            name: `Media - ${new Date().toLocaleString()}`,
            size: 0,
            uploadedAt: new Date().toISOString(),
            publicId: url
        };

        const updatedMedia = [newMedia, ...media];
        setMedia(updatedMedia);
        localStorage.setItem('admin_media_library', JSON.stringify(updatedMedia));
        setSuccess('Media uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
        setShowUploader(false);
    };

    // Delete media
    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this media file?')) return;

        const updatedMedia = media.filter(item => item.id !== id);
        setMedia(updatedMedia);
        localStorage.setItem('admin_media_library', JSON.stringify(updatedMedia));
        setSuccess('Media deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    // Copy URL to clipboard
    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setSelectedForCopy(url);
        setTimeout(() => setSelectedForCopy(null), 2000);
    };

    // Download media
    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
            <div className="text-center">
                <Sparkles className="animate-spin text-[#3B241A] mx-auto mb-4" size={40} />
                <p className="text-[#3B241A] font-serif">Loading Media Library...</p>
            </div>
        </div>
    );

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] p-4 pt-24 md:p-10">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Library</p>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Media Gallery</h1>
                        <p className="text-sm text-[#3B241A]/60 mt-1">Upload and manage images & videos</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowUploader(!showUploader)}
                            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors shadow-lg"
                        >
                            <Upload size={16} /> <span className="hidden md:inline">Upload New</span><span className="md:hidden">Upload</span>
                        </motion.button>
                    </div>
                </div>

                {/* Upload Section */}
                <AnimatePresence>
                    {showUploader && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 p-6 bg-white rounded-2xl border border-[#3B241A]/10 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-[#3B241A]">Upload Media</h2>
                                <button
                                    onClick={() => setShowUploader(false)}
                                    className="p-2 hover:bg-[#3B241A]/5 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-[#3B241A]/60" />
                                </button>
                            </div>
                            <CloudinaryUpload
                                onUploadComplete={handleUploadComplete}
                                folder="media"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wide border border-red-100"
                    >
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-green-100"
                    >
                        {success}
                    </motion.div>
                )}

                {/* Search and View Controls */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                    {/* Search */}
                    <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#3B241A]/10">
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
                                className="p-1 hover:bg-[#3B241A]/5 rounded-lg transition-colors"
                            >
                                <X size={16} className="text-[#A68B7E]" />
                            </button>
                        )}
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-[#3B241A]/10 p-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-[#3B241A] text-[#FAF0E6]'
                                    : 'text-[#3B241A]/60 hover:bg-[#3B241A]/5'
                            }`}
                            title="Grid view"
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-[#3B241A] text-[#FAF0E6]'
                                    : 'text-[#3B241A]/60 hover:bg-[#3B241A]/5'
                            }`}
                            title="List view"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Media Grid/List */}
                {paginatedMedia.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[#3B241A]/10">
                        <ImageIcon size={48} className="mx-auto mb-4 text-[#3B241A]/20" />
                        <p className="text-[#3B241A]/60 font-medium">No media files yet</p>
                        <button
                            onClick={() => setShowUploader(true)}
                            className="mt-4 text-[#F2A7A7] font-bold text-sm hover:text-[#3B241A]"
                        >
                            Upload your first media →
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {paginatedMedia.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group bg-white rounded-xl border border-[#3B241A]/10 overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-square bg-[#3B241A]/5 overflow-hidden">
                                    {item.type === 'image' ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.url}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B241A]/10 to-[#F2A7A7]/10">
                                            <Play size={48} className="text-[#3B241A]/30 fill-[#3B241A]/30" />
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCopyUrl(item.url)}
                                            className="p-2 rounded-full bg-white text-[#3B241A] shadow-lg hover:bg-[#F2A7A7]"
                                            title="Copy URL"
                                        >
                                            {selectedForCopy === item.url ? (
                                                <Check size={18} />
                                            ) : (
                                                <Copy size={18} />
                                            )}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDownload(item.url, item.name)}
                                            className="p-2 rounded-full bg-white text-[#3B241A] shadow-lg hover:bg-[#F2A7A7]"
                                            title="Download"
                                        >
                                            <Download size={18} />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3 space-y-2">
                                    <p className="text-xs font-bold text-[#3B241A] line-clamp-1">{item.name}</p>
                                    <p className="text-[10px] text-[#A68B7E]">
                                        {new Date(item.uploadedAt).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3 mb-8">
                        {paginatedMedia.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#3B241A]/10 hover:shadow-md transition-shadow group"
                            >
                                {/* Thumbnail */}
                                <div className="w-16 h-16 rounded-lg bg-[#3B241A]/5 overflow-hidden flex-shrink-0">
                                    {item.type === 'image' ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B241A]/10 to-[#F2A7A7]/10">
                                            <Play size={24} className="text-[#3B241A]/30 fill-[#3B241A]/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <p className="font-bold text-[#3B241A] text-sm">{item.name}</p>
                                    <p className="text-xs text-[#A68B7E]">
                                        {item.type.toUpperCase()} • {new Date(item.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => handleCopyUrl(item.url)}
                                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                        title="Copy URL"
                                    >
                                        {selectedForCopy === item.url ? (
                                            <Check size={16} />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => handleDownload(item.url, item.name)}
                                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                                        title="Download"
                                    >
                                        <Download size={16} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {filteredMedia.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-white rounded-2xl border border-[#3B241A]/5">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">
                            Showing {filteredMedia.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredMedia.length)} of {filteredMedia.length}
                            {searchQuery && ' (filtered)'} | Page {currentPage} of {totalPages}
                        </p>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={14} /> Prev
                                </motion.button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                                        <motion.button
                                            key={page}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
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
                                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#FAF0E6] border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next <ChevronRight size={14} />
                                </motion.button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

