"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Toolbar from '@/components/Toolbar';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Firebase must be initialized on client side
    if (!auth) {
      setLoading(false);
      router.push('/admin/login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setIsAuthorized(false);
          setLoading(false);
          router.push('/admin/login');
          return;
        }

        // Get ID token claims to check admin status
        const idTokenResult = await firebaseUser.getIdTokenResult();

        if (!idTokenResult.claims.admin) {
          setIsAuthorized(false);
          setLoading(false);
          router.push('/admin/login');
          return;
        }

        // Store token for authenticated API calls
        localStorage.setItem('admin_token', idTokenResult.token);
        setUser(firebaseUser);
        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAuthorized(false);
        setLoading(false);
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    try {
      // Sign out from Firebase only if auth is initialized
      if (auth) {
        await signOut(auth);
      }
      localStorage.removeItem('admin_token');

      // Call logout API to clear session
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        console.warn('Logout API call failed:', err);
      }

      // Redirect to login
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login even if error occurs
      router.push('/admin/login');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
        <div className="text-[#3B241A]">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#FFF8F6]">
      <Toolbar title="Admin Panel" showBackButton={true} backHref="/" navItems={["Home", "Blogs", "Contact"]} />

      <main className="max-w-4xl mx-auto mt-24 p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3B241A]">Admin Dashboard</h1>
            <p className="text-sm text-[#A68B7E] mt-2">Welcome back, {user?.displayName || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#3B241A] text-white px-4 py-2 rounded-lg hover:bg-[#2f1b14] transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/blogs" className="glass p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <div className="text-xl font-semibold text-[#3B241A]">Blogs</div>
            <div className="text-xs text-[#A68B7E] mt-1">Create, edit and manage blog posts</div>
          </a>
          <a href="/admin/users" className="glass p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <div className="text-xl font-semibold text-[#3B241A]">Users</div>
            <div className="text-xs text-[#A68B7E] mt-1">Manage registered users</div>
          </a>
          <a href="/admin/settings" className="glass p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <div className="text-xl font-semibold text-[#3B241A]">Settings</div>
            <div className="text-xs text-[#A68B7E] mt-1">Site configuration and keys</div>
          </a>
        </section>
      </main>
    </div>
  );
}

