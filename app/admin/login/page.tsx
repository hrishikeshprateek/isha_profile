"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@isharani.in');
  const [password, setPassword] = useState('AdminPass123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!auth) {
      setError('Firebase not initialized. Please refresh the page.');
      setLoading(false);
      return;
    }

    try {
      // Sign in with Firebase to get an ID token
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idTokenResult = await credential.user.getIdTokenResult();
      const firebaseToken = idTokenResult.token;

      // Check if user has admin claim
      if (!idTokenResult.claims.admin) {
        setError('You do not have admin privileges');
        setLoading(false);
        return;
      }

      // Store token in localStorage for authenticated API calls
      localStorage.setItem('admin_token', firebaseToken);

      // Optionally, sync with backend (create session) - can be optional with client-side token
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firebaseToken }),
        });

        if (!res.ok) {
          console.warn('Backend sync failed, proceeding with client token');
        }
      } catch (syncErr) {
        console.warn('Backend sync error, proceeding with client token', syncErr);
      }

      // Navigate to admin dashboard
      router.push('/admin');
      return;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err) || 'An error occurred';

      // Provide user-friendly error messages
      if (message.includes('auth/user-not-found')) {
        setError('User not found');
      } else if (message.includes('auth/wrong-password')) {
        setError('Invalid password');
      } else if (message.includes('auth/invalid-email')) {
        setError('Invalid email address');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-center bg-no-repeat bg-cover py-20">
      <main className="max-w-md mx-auto mt-24 glass rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-[#3B241A] mb-2">Admin Login</h1>
        <p className="text-sm text-[#A68B7E] mb-6">Manage posts, users and settings</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col text-sm">
            <span className="text-xs text-[#A68B7E]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-3 rounded-xl border border-[#E7D8D0] bg-white/60"
              required
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-xs text-[#A68B7E]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-3 rounded-xl border border-[#E7D8D0] bg-white/60"
              required
            />
          </label>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            className="mt-2 bg-[#3B241A] text-white py-3 rounded-xl font-medium hover:bg-[#2f1b14] transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-xs text-[#A68B7E]">
          Use the admin console to manage content. This panel uses secure httpOnly cookies.
        </div>
      </main>
    </div>
  );
}
