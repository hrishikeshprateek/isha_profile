'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Save, Sparkles, Link as LinkIcon, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface InstagramPost {
  id: string;
  url: string;
}

interface InstagramData {
  profileUrl: string;
  profileHandle: string;
  posts: InstagramPost[];
}

export default function AdminInstagramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<InstagramData>({
    profileUrl: '',
    profileHandle: '',
    posts: [],
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

  // Fetch Instagram data
  const fetchInstagramData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/instagram', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (data.success && data.data) {
        setFormData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch Instagram data:', err);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (isAuthorized) {
      fetchInstagramData();
    }
  }, [isAuthorized, fetchInstagramData]);

  // Save Instagram data
  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/instagram', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Instagram section updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update Instagram section');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  }

  const handleAddPost = () => {
    setFormData({
      ...formData,
      posts: [...formData.posts, { id: `post_${Date.now()}`, url: '' }],
    });
  };

  const handleRemovePost = (index: number) => {
    setFormData({
      ...formData,
      posts: formData.posts.filter((_, i) => i !== index),
    });
  };

  const handlePostUrlChange = (index: number, url: string) => {
    const updatedPosts = [...formData.posts];
    updatedPosts[index].url = url;
    setFormData({
      ...formData,
      posts: updatedPosts,
    });
  };

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
          <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Instagram Section</h1>
          <p className="text-sm text-[#3B241A]/60 mt-1">Manage Instagram profile and posts integration</p>
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
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-red-100"
          >
            {error}
          </motion.div>
        )}

        {/* Form Content */}
        <div className="bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg p-8 space-y-8">

          {/* Profile Section */}
          <div className="space-y-6">
            <div className="border-b border-[#DC7C7C]/20 pb-4">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <LinkIcon size={20} className="text-[#DC7C7C]" />
                Instagram Profile
              </h2>
            </div>

            {/* Profile Handle */}
            <div>
              <label className="block text-sm font-bold text-[#3B241A] mb-2 uppercase tracking-wide">
                Profile Handle
              </label>
              <input
                type="text"
                placeholder="e.g., moreofisha._"
                value={formData.profileHandle}
                onChange={(e) => setFormData({ ...formData, profileHandle: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-[#DC7C7C]/20 text-[#3B241A] placeholder-[#A68B7E]/50 focus:outline-none focus:border-[#DC7C7C]/40 focus:ring-2 focus:ring-[#DC7C7C]/10"
              />
              <p className="text-xs text-[#A68B7E] mt-1">Your Instagram username without @</p>
            </div>

            {/* Profile URL */}
            <div>
              <label className="block text-sm font-bold text-[#3B241A] mb-2 uppercase tracking-wide">
                Profile URL
              </label>
              <input
                type="url"
                placeholder="https://www.instagram.com/moreofisha._/"
                value={formData.profileUrl}
                onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-[#DC7C7C]/20 text-[#3B241A] placeholder-[#A68B7E]/50 focus:outline-none focus:border-[#DC7C7C]/40 focus:ring-2 focus:ring-[#DC7C7C]/10"
              />
              <p className="text-xs text-[#A68B7E] mt-1">Full Instagram profile URL</p>
            </div>
          </div>

          {/* Posts Section */}
          <div className="space-y-6">
            <div className="border-b border-[#DC7C7C]/20 pb-4 flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <LinkIcon size={20} className="text-[#DC7C7C]" />
                Instagram Posts ({formData.posts.length})
              </h2>
              <button
                onClick={handleAddPost}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#DC7C7C]/20 hover:bg-[#DC7C7C]/30 text-[#DC7C7C] font-semibold text-sm transition-colors"
              >
                <Plus size={16} />
                Add Post
              </button>
            </div>

            {formData.posts.length === 0 ? (
              <p className="text-[#A68B7E] text-center py-8">No posts added yet. Click &quot;Add Post&quot; to get started.</p>
            ) : (
              <div className="space-y-4">
                {formData.posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-3"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-[#3B241A] mb-2 uppercase tracking-wide">
                        Post {index + 1} URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.instagram.com/p/..."
                        value={post.url}
                        onChange={(e) => handlePostUrlChange(index, e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/50 border border-[#DC7C7C]/20 text-[#3B241A] placeholder-[#A68B7E]/50 focus:outline-none focus:border-[#DC7C7C]/40 focus:ring-2 focus:ring-[#DC7C7C]/10"
                      />
                    </div>
                    <button
                      onClick={() => handleRemovePost(index)}
                      className="p-3 rounded-lg bg-red-50/50 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#DC7C7C] hover:bg-[#C66B6B] text-white font-bold uppercase tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}

