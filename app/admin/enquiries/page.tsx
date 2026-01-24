"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt?: string;
}

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    if (!auth) { router.push('/admin/login'); return; }
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) { router.push('/admin/login'); return; }
      const tokenResult = await firebaseUser.getIdTokenResult();
      if (!tokenResult.claims.admin) { router.push('/admin/login'); return; }
      localStorage.setItem('admin_token', tokenResult.token);
      fetchEnquiries(1, search);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function fetchEnquiries(nextPage = 1, nextSearch = '') {
    try {
      setError('');
      const params = new URLSearchParams({ page: `${nextPage}`, limit: `${limit}` });
      if (nextSearch.trim()) params.set('search', nextSearch.trim());
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/enquiries?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to load');
      setEnquiries(data.enquiries || []);
      setTotal(data.total || 0);
      setPage(data.page || nextPage);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load enquiries';
      setError(msg);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      setStatusUpdating(id);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to update');
      await fetchEnquiries(page, search);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      setError(msg);
    } finally {
      setStatusUpdating(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0E6] via-[#FCEBE2] to-[#F6D7C4] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="rounded-3xl bg-white/60 backdrop-blur-lg border border-white/70 shadow-lg shadow-[#3B241A]/5 p-5 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A68B7E]">Inbox</p>
            <h1 className="text-3xl font-bold text-[#3B241A] flex items-center gap-2">
              Enquiries
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#3B241A]/5 text-[#3B241A]">
                {total} total
              </span>
            </h1>
            <p className="text-sm text-[#6E5045]">Messages from the Quick Chat form.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#A68B7E] absolute left-3 top-2.5" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchEnquiries(1, e.currentTarget.value)}
                placeholder="Search name, email, message"
                className="w-full pl-9 pr-3 py-2.5 rounded-full border border-[#3B241A]/10 bg-white/80 text-sm text-[#3B241A] focus:outline-none focus:border-[#DC7C7C] shadow-sm"
              />
            </div>
            <button
              onClick={() => fetchEnquiries(1, search)}
              className="px-4 py-2.5 rounded-full bg-[#3B241A] text-white text-sm font-semibold hover:bg-[#DC7C7C] transition shadow-md"
            >
              Search
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/70 shadow-xl shadow-[#3B241A]/5 p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-[#6E5045] gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading enquiries...
            </div>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : enquiries.length === 0 ? (
            <p className="text-sm text-[#6E5045]">No enquiries yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {enquiries.map((item) => (
                <div
                  key={item._id}
                  className="p-4 sm:p-5 rounded-2xl border border-[#3B241A]/10 bg-gradient-to-br from-white to-[#FFF6EF] shadow-md hover:shadow-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#DC7C7C]/15 text-[#DC7C7C] font-bold flex items-center justify-center uppercase">
                          {item.name?.charAt(0) || 'Q'}
                        </div>
                        <div>
                          <div className="font-semibold text-[#3B241A] text-lg leading-tight">{item.name}</div>
                          <div className="text-xs text-[#A68B7E]">{item.email}</div>
                        </div>
                      </div>
                      <div className="text-xs text-[#A68B7E]">
                        {item.createdAt ? dayjs(item.createdAt).format('MMM D, YYYY h:mm A') : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F2A7A7]/40 text-[#3B241A] capitalize">
                        {item.status || 'open'}
                      </span>
                      <select
                        disabled={statusUpdating === item._id}
                        value={item.status || 'open'}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                        className="text-sm border border-[#3B241A]/20 rounded-full px-3 py-1 bg-white shadow-sm"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-[#3B241A] leading-relaxed bg-white/60 rounded-2xl p-3 border border-[#3B241A]/5">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {enquiries.length > 0 && (
            <div className="flex items-center justify-between mt-6 text-sm text-[#3B241A]">
              <button
                onClick={() => page > 1 && fetchEnquiries(page - 1, search)}
                className="flex items-center gap-1 px-3 py-2 rounded-full border border-[#3B241A]/10 bg-white/70 hover:border-[#DC7C7C] disabled:opacity-50 shadow-sm"
                disabled={page <= 1}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <div className="px-3 py-2 rounded-full bg-[#3B241A]/5 border border-[#3B241A]/10">
                Page {page} of {totalPages}
              </div>
              <button
                onClick={() => page < totalPages && fetchEnquiries(page + 1, search)}
                className="flex items-center gap-1 px-3 py-2 rounded-full border border-[#3B241A]/10 bg-white/70 hover:border-[#DC7C7C] disabled:opacity-50 shadow-sm"
                disabled={page >= totalPages}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
