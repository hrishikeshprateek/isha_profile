"use client";

import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Save, Sparkles, Type, Palette, Video, Camera, Layers, Trash2, Plus } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: 'Type' | 'Palette' | 'Video' | 'Camera' | 'Layers';
  tags: string[];
}

const DEFAULT: ServiceItem[] = [
  { id: '01', title: 'Content Writing', description: 'Compelling narratives...', icon: 'Type', tags: ['Copywriting','Blogs','Scriptwriting']},
  { id: '02', title: 'Graphic & UI/UX', description: 'Visuals that stick...', icon: 'Palette', tags: ['Web Design','App UI','Social Graphics']},
  { id: '03', title: 'Video Editing', description: 'Turning raw footage...', icon: 'Video', tags: ['Reels/Shorts','YouTube','Color Grading']},
  { id: '04', title: 'Photography', description: 'Capturing moments...', icon: 'Camera', tags: ['Portrait','Product','Event']},
  { id: '05', title: 'Branding', description: 'More than just a logo...', icon: 'Layers', tags: ['Logo Design','Strategy','Tone of Voice']},
];

export default function AdminServicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT);

  const getAuthHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }, []);

  useEffect(() => {
    if (!auth) { router.push('/admin/login'); return; }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser || !(await firebaseUser.getIdTokenResult()).claims.admin) { router.push('/admin/login'); return; }
      localStorage.setItem('admin_token', (await firebaseUser.getIdTokenResult()).token);
      setIsAuthorized(true);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/admin/services', { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && data.success) {
          setServices(Array.isArray(data.data) && data.data.length ? data.data : DEFAULT);
        }
      } catch (err) {
        console.error('Load services error', err);
      }
    }
    if (isAuthorized) loadServices();
  }, [isAuthorized, getAuthHeaders]);

  const updateService = (index: number, updates: Partial<ServiceItem>) => {
    const next = [...services];
    next[index] = { ...next[index], ...updates } as ServiceItem;
    setServices(next);
  };

  const addService = () => setServices([...services, { id: `${(services.length+1).toString().padStart(2,'0')}`, title: 'New Service', description: '', icon: 'Type', tags: [] }]);
  const removeService = (index: number) => setServices(services.filter((_, i) => i !== index));

  const updateTag = (sIdx: number, tIdx: number, value: string) => {
    const next = [...services];
    const tags = [...(next[sIdx].tags || [])];
    tags[tIdx] = value;
    next[sIdx].tags = tags;
    setServices(next);
  };

  const addTag = (sIdx: number) => updateService(sIdx, { tags: [...(services[sIdx].tags || []), 'New Tag'] });
  const removeTag = (sIdx: number, tIdx: number) => updateService(sIdx, { tags: services[sIdx].tags.filter((_, i) => i !== tIdx) });

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/services', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(services) });
      const data = await res.json();
      if (res.ok && data.success) { setSuccess('Services updated!'); setTimeout(() => setSuccess(''), 2500); }
      else { setError(data.error || 'Failed to update services'); }
    } catch (err) {
      console.error('Save services error', err);
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (<div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center"><Sparkles className="animate-spin text-[#3B241A]" size={32}/></div>);
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] p-4 pt-24 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Page Sections</p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Services Section</h1>
            <p className="text-sm text-[#3B241A]/60 mt-1">Edit content shown in ServicesSection (user UI unchanged).</p>
          </div>
          <button onClick={addService} className="px-4 py-2 rounded-lg bg-white border border-[#3B241A]/10 text-[#3B241A] text-xs font-bold uppercase tracking-widest hover:bg-[#FAF0E6]">Add Service</button>
        </div>

        {success && (<div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-green-100">{success}</div>)}
        {error && (<div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wide border border-red-100">{error}</div>)}

        <div className="space-y-4">
          {services.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#3B241A]/10 shadow-sm space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input value={s.id} onChange={(e) => updateService(i, { id: e.target.value })} className="bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5" placeholder="ID" />
                <input value={s.title} onChange={(e) => updateService(i, { title: e.target.value })} className="bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5" placeholder="Title" />
                <select value={s.icon} onChange={(e) => updateService(i, { icon: e.target.value as ServiceItem['icon'] })} className="bg-white rounded-xl p-3 text-sm border border-[#3B241A]/5">
                  {['Type','Palette','Video','Camera','Layers'].map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
                <button onClick={() => removeService(i)} className="text-red-600 hover:bg-red-50 rounded-xl p-3 flex items-center justify-center"><Trash2 size={18}/></button>
              </div>
              <textarea value={s.description} onChange={(e) => updateService(i, { description: e.target.value })} rows={3} className="w-full bg-[#FAF0E6]/50 rounded-xl p-3 text-sm border border-[#3B241A]/5" placeholder="Description" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60">Tags</span>
                  <button onClick={() => addTag(i)} className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[#3B241A]/5 text-[#3B241A]/70 hover:bg-[#F2A7A7]/20">Add</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {(s.tags || []).map((t, ti) => (
                    <div key={ti} className="flex items-center gap-2 bg-[#FAF0E6]/50 rounded-xl p-2 border border-[#3B241A]/5">
                      <input value={t} onChange={(e) => updateTag(i, ti, e.target.value)} className="flex-1 bg-transparent outline-none text-sm text-[#3B241A]" />
                      <button onClick={() => removeTag(i, ti)} className="text-red-500 hover:text-red-600"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#3B241A] text-[#FAF0E6] font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors disabled:opacity-50">
          {saving ? (<><Sparkles className="animate-spin" size={18}/> Saving...</>) : (<><Save size={18}/> Save Changes</>)}
        </motion.button>
      </div>
    </div>
  );
}

