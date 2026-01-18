"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOut, Download, RefreshCw, Mail } from 'lucide-react';

interface Subscriber {
  email: string;
  source?: string;
  createdAt?: string;
}

export default function SubscribersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!auth) {
      setTimeout(() => setLoading(false), 0);
      router.push('/auth/login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setIsAuthorized(false);
          setLoading(false);
          router.push('/auth/login');
          return;
        }
        const idTokenResult = await firebaseUser.getIdTokenResult();
        if (!idTokenResult.claims.admin) {
          setIsAuthorized(false);
          setLoading(false);
          router.push('/auth/login');
          return;
        }
        localStorage.setItem('admin_token', idTokenResult.token);
        setIsAuthorized(true);
        setLoading(false);
      } catch {
        setIsAuthorized(false);
        setLoading(false);
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function fetchSubscribers() {
    try {
      // setFetching(true);
      setError('');
      const res = await fetch('/api/subscribers', {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers(data.subscribers || []);
      } else {
        setError(data.error || 'Failed to load subscribers');
      }
    } catch {
      setError('Failed to load subscribers');
    } finally {
      // setFetching(false);
    }
  }

  useEffect(() => {
    if (isAuthorized) fetchSubscribers();
  }, [isAuthorized]);

  async function handleLogout() {
    try {
      if (auth) await signOut(auth);
      localStorage.removeItem('admin_token');
      router.push('/auth/login');
    } catch {
      router.push('/auth/login');
    }
  }

  function downloadCSV() {
    const header = 'email,source,createdAt\n';
    const rows = subscribers
      .map((s) => `${s.email},${s.source || ''},${s.createdAt || ''}`)
      .join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center text-[#3B241A]">Loading...</div>;
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A]">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Subscribers</p>
            <h1 className="text-3xl font-serif font-bold">Newsletter List</h1>
            <p className="text-sm text-[#A68B7E] mt-2">{subscribers.length} total subscriber{subscribers.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchSubscribers} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#3B241A]/10 hover:border-[#3B241A]/30 text-sm">
              <RefreshCw size={14}/> Refresh
            </button>
            <button onClick={downloadCSV} disabled={subscribers.length === 0} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#3B241A] text-[#FAF0E6] text-sm hover:bg-[#F2A7A7] hover:text-[#3B241A] disabled:opacity-50">
              <Download size={14}/> Export CSV
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg bg-white border border-[#3B241A]/10 text-[#3B241A] hover:border-[#3B241A]/30">
              <LogOut size={16}/>
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</p>}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="w-full px-4 py-3 rounded-lg border border-[#3B241A]/10 bg-white focus:outline-none focus:border-[#3B241A]/30 text-sm"
          />
        </div>

        <div className="bg-white rounded-2xl border border-[#3B241A]/10 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#A68B7E] border-b border-[#3B241A]/10">
            <span className="col-span-6">Email</span>
            <span className="col-span-3">Source</span>
            <span className="col-span-3">Subscribed</span>
          </div>
          <div className="divide-y divide-[#3B241A]/10">
            {(() => {
              const filtered = subscribers.filter(s => s.email.includes(searchTerm));
              return filtered.length === 0 ? (
                <div className="p-6 text-sm text-[#A68B7E]">{searchTerm ? 'No matching subscribers.' : 'No subscribers yet.'}</div>
              ) : (
                filtered.map((s, i) => (
                  <div key={`${s.email}-${i}`} className="grid grid-cols-12 px-4 py-3 text-sm text-[#3B241A] hover:bg-[#FAF0E6]/50 transition">
                    <div className="col-span-6 flex items-center gap-2">
                      <Mail size={14} className="text-[#A68B7E]"/>
                      <span className="truncate">{s.email}</span>
                    </div>
                    <div className="col-span-3 text-[#A68B7E] text-xs">{s.source || 'unknown'}</div>
                    <div className="col-span-3 text-[#A68B7E] text-xs">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</div>
                  </div>
                ))
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
