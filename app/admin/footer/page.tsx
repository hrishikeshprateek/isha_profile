"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toolbar from '@/components/Toolbar';
import Footer from '@/components/Footer';

type FooterLink = { id?: string; label: string; href: string; order?: number; external?: boolean };
type NavItem = { title: string; href: string };

export default function AdminFooterPage() {
  const router = useRouter();
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const tokenLocal = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
        const [resFooter, resNav] = await Promise.all([
          fetch('/api/admin/footer', { headers: { Authorization: `Bearer ${tokenLocal || ''}` } }),
          fetch('/api/admin/navigation', { headers: { Authorization: `Bearer ${tokenLocal || ''}` } })
        ]);

        // If unauthenticated or forbidden, show login prompt instead of silent redirect
        if (resFooter.status === 401 || resFooter.status === 403 || resNav.status === 401 || resNav.status === 403) {
          setAuthorized(false);
          setLinks([]);
          setNavItems([]);
          return;
        }

        const dataFooter = await resFooter.json();
        const dataNav = await resNav.json();

        if (resFooter.ok && dataFooter.success) setLinks(dataFooter.links || []);
        else setLinks([]);
        if (resNav.ok && dataNav.success) setNavItems(dataNav.items || []);
        else setNavItems([]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Failed to load footer or navigation data', msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function updateLink(idx: number, patch: Partial<FooterLink>) {
    setLinks((s) => s.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function addLink() {
    setLinks((s) => [...s, { label: 'New Link', href: '', order: s.length + 1, external: false }]);
  }

  function removeLink(idx: number) {
    setLinks((s) => s.filter((_, i) => i !== idx));
  }

  function moveUp(idx: number) {
    if (idx <= 0) return;
    setLinks((s) => {
      const copy = [...s];
      const tmp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = tmp;
      return copy.map((c, i) => ({ ...c, order: i + 1 }));
    });
  }

  function moveDown(idx: number) {
    setLinks((s) => {
      if (idx >= s.length - 1) return s;
      const copy = [...s];
      const tmp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = tmp;
      return copy.map((c, i) => ({ ...c, order: i + 1 }));
    });
  }

  async function save() {
    try {
      const tokenLocal = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const res = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenLocal || ''}` },
        body: JSON.stringify({ links })
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Save failed: ' + (data?.error || 'Unknown'));
        return;
      }
      alert('Saved');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Failed to save footer links', msg);
      alert('Failed to save: ' + msg);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A]">
      <Toolbar title="Footer Links" showBackButton={true} backHref="/admin" navItems={["Home", "Services", "Work", "Contact"]} />

      <main className="max-w-4xl mx-auto p-6 pt-28">
        <h2 className="text-2xl font-serif font-bold mb-4">Footer Links</h2>

        <div className="mb-4 flex gap-2">
          <button className="px-4 py-2 rounded-full bg-[#3B241A] text-white" onClick={addLink}>Add link</button>
          <button className="px-4 py-2 rounded-full bg-[#F2A7A7] text-[#3B241A]" onClick={save}>Save changes</button>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : !authorized ? (
          <div className="p-6 bg-white rounded-lg text-center">
            <p className="text-[#6E5045] mb-4">You are not authorized to view this page. Please login as an admin.</p>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => router.push('/auth/login')} className="px-4 py-2 rounded bg-[#3B241A] text-white">Go to Login</button>
            </div>
          </div>
        ) : (
          <div>
            {links.length === 0 ? (
              <div className="p-6 bg-white rounded-lg text-center text-[#6E5045]">No footer links yet. Use &quot;Add link&quot; to create.</div>
            ) : (
              <div className="space-y-3">
                {links.map((it, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg flex items-center gap-3">
                 <div className="flex-1">
                   <div className="flex gap-2 mb-2">
                     <input className="flex-1 p-2 border rounded" value={it.label} onChange={(e) => updateLink(idx, { label: e.target.value })} />
                     <select value={it.href || ''} onChange={(e) => {
                         const v = e.target.value;
                         if (v === '__custom') {
                           // set href to empty so the custom input appears
                           updateLink(idx, { href: '' });
                           return;
                         }

                         // find nav item title to optionally set label
                         const nav = navItems.find(n => n.href === v);

                         // Update using functional setter to access current state and decide label auto-fill
                         setLinks((current) => current.map((item, i) => {
                           if (i !== idx) return item;
                           const shouldAutoFill = !!nav && (item.label === '' || item.label === item.href);
                           return {
                             ...item,
                             href: v,
                             label: shouldAutoFill ? nav!.title : item.label,
                           };
                         }));
                       }} className="p-2 border rounded w-48">
                       <option value="">-- choose or enter --</option>
                       {navItems.map((n, i) => (
                         <option key={i} value={n.href}>{n.title} ({n.href})</option>
                       ))}
                       <option value="__custom">Custom URL...</option>
                     </select>
                   </div>

                   {/* Show custom input when href is empty (we use empty string to indicate custom) */}
                   {it.href === '' ? (
                     <input className="w-full p-2 border rounded" placeholder="/my-page or https://..." value={it.href} onChange={(e) => updateLink(idx, { href: e.target.value })} />
                   ) : (
                     <input className="w-full p-2 border rounded" value={it.href} onChange={(e) => updateLink(idx, { href: e.target.value })} />
                   )}

                   <div className="flex items-center gap-3 mt-2 text-sm">
                     <label className="flex items-center gap-2"><input type="checkbox" checked={!!it.external} onChange={(e) => updateLink(idx, { external: e.target.checked })} /> External</label>
                     <span className="text-xs text-[#A68B7E]">Order: {it.order || idx + 1}</span>
                   </div>
                 </div>

                 <div className="flex flex-col gap-2">
                   <button className="px-3 py-1 rounded bg-[#FAF0E6]" onClick={() => moveUp(idx)}>↑</button>
                   <button className="px-3 py-1 rounded bg-[#FAF0E6]" onClick={() => moveDown(idx)}>↓</button>
                   <button className="px-3 py-1 rounded bg-[#F2A7A7]" onClick={() => removeLink(idx)}>Delete</button>
                 </div>
               </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
