"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Save, Sparkles, Type, AlignLeft, Tag, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import MediaSelector from '@/components/MediaSelector';

interface RoleEntry {
  label: string;
  icon: 'Video' | 'PenTool' | 'Monitor' | 'Camera';
}

interface ProfileData {
  name: string;
  title: string;
  image: string;
}

interface AboutFormData {
  badge: string;
  heading: string;
  rolesIntro: string;
  detailText: string;
  tags: string[];
  roles: RoleEntry[];
  profile: ProfileData;
}

const DEFAULT_FORM: AboutFormData = {
  badge: 'About Me',
  heading: '"Merging creative vision with strategic design to tell compelling visual stories."',
  rolesIntro: 'I bridge the gap between visual storytelling and functional design, crafting cohesive digital experiences across four key areas:',
  detailText: 'I transform complex concepts into clean, engaging narratives. Whether capturing a moment through a lens or designing an interface, my goal is always the same: to create work that resonates.',
  tags: ['Clarity', 'Consistency', 'Usability'],
  roles: [
    { label: 'Content Creator', icon: 'Video' },
    { label: 'Designer', icon: 'PenTool' },
    { label: 'UI / UX', icon: 'Monitor' },
    { label: 'Photographer', icon: 'Camera' },
  ],
  profile: {
    name: 'Isha Rani',
    title: 'UX & Content',
    image: '/isha_a.png',
  },
};

export default function AdminAboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showProfileMediaSelector, setShowProfileMediaSelector] = useState(false);

  const [formData, setFormData] = useState<AboutFormData>(DEFAULT_FORM);

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

  // Load existing about data
  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch('/api/admin/about', { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && data?.success && data.data) {
          setFormData({ ...DEFAULT_FORM, ...data.data });
        }
      } catch (err) {
        console.error('Failed to load about data', err);
      }
    }
    if (isAuthorized) loadAbout();
  }, [isAuthorized, getAuthHeaders]);

  const updateTag = (value: string, index: number) => {
    const next = [...formData.tags];
    next[index] = value;
    setFormData({ ...formData, tags: next });
  };

  const addTag = () => setFormData({ ...formData, tags: [...formData.tags, 'New Tag'] });
  const removeTag = (index: number) => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });

  const updateRole = (index: number, updates: Partial<RoleEntry>) => {
    const next = [...formData.roles];
    next[index] = { ...next[index], ...updates } as RoleEntry;
    setFormData({ ...formData, roles: next });
  };

  const addRole = () => setFormData({ ...formData, roles: [...formData.roles, { label: 'New Role', icon: 'PenTool' }] });
  const removeRole = (index: number) => setFormData({ ...formData, roles: formData.roles.filter((_, i) => i !== index) });

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('About section updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update about section');
      }
    } catch (err) {
      console.error('Save about error', err);
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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Page Sections</p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">About Section</h1>
          <p className="text-sm text-[#3B241A]/60 mt-1">Edit content displayed in AboutSection (user UI unchanged).</p>
        </div>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-green-100">
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wide border border-red-100">
            {error}
          </motion.div>
        )}

        {/* Heading & Badge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><Type size={16}/> Badge</label>
            <input
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
            />
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><Type size={16}/> Heading</label>
            <textarea
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              rows={3}
              className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
            />
          </div>
        </div>

        {/* Roles Intro & Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><AlignLeft size={16}/> Roles Intro</label>
            <textarea
              value={formData.rolesIntro}
              onChange={(e) => setFormData({ ...formData, rolesIntro: e.target.value })}
              rows={4}
              className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
            />
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><AlignLeft size={16}/> Detail Text</label>
            <textarea
              value={formData.detailText}
              onChange={(e) => setFormData({ ...formData, detailText: e.target.value })}
              rows={4}
              className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><Tag size={16}/> Tags</label>
            <button onClick={addTag} className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/70 hover:bg-[#F2A7A7]/20 hover:text-[#3B241A]">Add</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formData.tags.map((tag, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#FAF0E6]/50 rounded-xl p-3 border border-[#3B241A]/5">
                <input
                  value={tag}
                  onChange={(e) => updateTag(e.target.value, i)}
                  className="flex-1 bg-transparent outline-none text-sm text-[#3B241A]"
                />
                <button onClick={() => removeTag(i)} className="text-red-500 hover:text-red-600"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><Type size={16}/> Roles</label>
            <button onClick={addRole} className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/70 hover:bg-[#F2A7A7]/20 hover:text-[#3B241A]">Add</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.roles.map((role, i) => (
              <div key={i} className="bg-[#FAF0E6]/50 rounded-xl p-3 border border-[#3B241A]/5 space-y-2">
                <input
                  value={role.label}
                  onChange={(e) => updateRole(i, { label: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm text-[#3B241A] border-b border-[#3B241A]/10 pb-1"
                  placeholder="Role label"
                />
                <select
                  value={role.icon}
                  onChange={(e) => updateRole(i, { icon: e.target.value as RoleEntry['icon'] })}
                  className="w-full bg-white rounded-lg p-2 text-sm border border-[#3B241A]/10"
                >
                  {['Video','PenTool','Monitor','Camera'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <button onClick={() => removeRole(i)} className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"><Trash2 size={14}/> Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><Type size={16}/> Name</label>
            <input
              value={formData.profile.name}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, name: e.target.value } })}
              className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
            />
            <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><Type size={16}/> Title</label>
            <input
              value={formData.profile.title}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, title: e.target.value } })}
              className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-base border border-[#3B241A]/5 focus:bg-white focus:border-[#F2A7A7] outline-none transition-all"
            />
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-[#3B241A]"><ImageIcon size={16}/> Profile Image</label>
              <button onClick={() => setShowProfileMediaSelector(true)} className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/70 hover:bg-[#F2A7A7]/20 hover:text-[#3B241A]">📁 From Library</button>
            </div>
            <CloudinaryUpload
              currentImage={formData.profile.image}
              onUploadComplete={(url) => setFormData({ ...formData, profile: { ...formData.profile, image: url } })}
              folder="about"
            />
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#3B241A] text-[#FAF0E6] font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {saving ? (<><Sparkles className="animate-spin" size={18}/> Saving...</>) : (<><Save size={18}/> Save Changes</>)}
        </motion.button>
      </div>

      <MediaSelector
        isOpen={showProfileMediaSelector}
        onClose={() => setShowProfileMediaSelector(false)}
        onSelect={(url) => setFormData({ ...formData, profile: { ...formData.profile, image: url } })}
        type="image"
      />
    </div>
  );
}

