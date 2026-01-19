"use client";

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import type { Metadata } from 'next';
import '../globals.css';
import SpotlightSearch from '@/components/SpotlightSearch';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <SpotlightSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AdminShell onSearch={() => setSearchOpen(true)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              searchOpen,
              setSearchOpen,
            } as any);
          }
          return child;
        })}
      </AdminShell>
    </>
  );
}
