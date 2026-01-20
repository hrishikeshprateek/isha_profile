"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Command, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// All searchable items in the admin panel
const SEARCHABLE_ITEMS = [
  // Dashboard
  { title: 'Dashboard', description: 'Admin overview', href: '/admin', category: 'Main' },

  // Editorial Content
  { title: 'Journal & Blogs', description: 'Manage blog posts', href: '/admin/blogs', category: 'Content' },
  { title: 'Create New Blog', description: 'Write a new story', href: '/admin/blogs/create', category: 'Content' },
  { title: 'Quotes Archive', description: 'Manage quotes', href: '/admin/quotes', category: 'Content' },

  // Projects & Build
  { title: 'Build Requests', description: 'Manage project enquiries', href: '/admin/build', category: 'Content' },

  // Page Sections
  { title: 'Hero Section', description: 'Edit homepage hero', href: '/admin/hero', category: 'Sections' },
  { title: 'About Me', description: 'Update about section', href: '/admin/about', category: 'Sections' },
  { title: 'Services', description: 'Manage services', href: '/admin/services', category: 'Sections' },
  { title: 'Expertise', description: 'Edit expertise section', href: '/admin/expertise', category: 'Sections' },
  { title: 'Contact Info', description: 'Update contact details', href: '/admin/contact', category: 'Sections' },

  // Standalone Pages
  { title: 'My Journey', description: 'Edit journey page', href: '/admin/my-journey', category: 'Pages' },
  { title: 'Build / Projects', description: 'Manage projects', href: '/admin/build', category: 'Pages' },
  { title: 'Wall of Love', description: 'Gallery & portfolio items', href: '/admin/wall', category: 'Pages' },
  { title: 'Digital VCard', description: 'Edit vCard', href: '/admin/vcard', category: 'Pages' },

  // Media
  { title: 'Gallery Assets', description: 'Media library', href: '/admin/media', category: 'Media' },

  // Community
  { title: 'Testimonials', description: 'Manage client reviews', href: '/admin/testimonials', category: 'Community' },
  { title: 'Create Testimonial', description: 'Add new testimonial', href: '/admin/testimonials/create', category: 'Community' },
  { title: 'Enquiries', description: 'View contact submissions', href: '/admin/enquiries', category: 'Community' },
  { title: 'Subscribers', description: 'Newsletter subscribers', href: '/admin/subscribers', category: 'Community' },

  // Configuration
  { title: 'Main Navigation', description: 'Edit nav menu', href: '/admin/navigation', category: 'Settings' },
  { title: 'Footer Links', description: 'Manage footer', href: '/admin/footer', category: 'Settings' },
  { title: 'Global Settings', description: 'Site configuration', href: '/admin/settings', category: 'Settings' },

  // Public Pages (for quick access)
  { title: 'View Homepage', description: 'Visit public site', href: '/', category: 'Public' },
  { title: 'View Blogs', description: 'Public blog listing', href: '/blogs', category: 'Public' },
  { title: 'View Journey', description: 'Public journey page', href: '/my_journey', category: 'Public' },
  { title: 'View Wall', description: 'Public testimonials', href: '/wall', category: 'Public' },
  { title: 'View VCard', description: 'Public vCard', href: '/vcard', category: 'Public' },
];

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter results based on query
  const results = query.trim() === ''
    ? SEARCHABLE_ITEMS.slice(0, 8) // Show first 8 when no query
    : SEARCHABLE_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex].href);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Search Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#3B241A]/10">
            <Search size={20} className="text-[#A68B7E]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, sections, settings..."
              className="flex-1 bg-transparent text-[#3B241A] placeholder-[#A68B7E] focus:outline-none text-base"
            />
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#FAF0E6] rounded-lg transition-colors"
            >
              <X size={18} className="text-[#A68B7E]" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-[#A68B7E]">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((item, index) => (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between gap-4 px-6 py-3 transition-colors ${
                      index === selectedIndex
                        ? 'bg-[#FAF0E6]'
                        : 'hover:bg-[#FAF0E6]/50'
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#3B241A]">{item.title}</h4>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3B241A]/5 text-[#A68B7E] font-bold">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#A68B7E] mt-0.5">{item.description}</p>
                    </div>
                    <ArrowRight size={16} className="text-[#A68B7E] flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-[#FAF0E6]/30 border-t border-[#3B241A]/10 flex items-center justify-between text-xs text-[#A68B7E]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white rounded border border-[#3B241A]/10 font-mono text-[10px]">↑</kbd>
                <kbd className="px-2 py-1 bg-white rounded border border-[#3B241A]/10 font-mono text-[10px]">↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white rounded border border-[#3B241A]/10 font-mono text-[10px]">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white rounded border border-[#3B241A]/10 font-mono text-[10px]">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Command size={12} />
              <span>Spotlight Search</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

