"use client";

import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children, onSearch }: { children: React.ReactNode; onSearch?: () => void }) {
  return (
    <div className="min-h-screen bg-[#FAF0E6] flex">
      <AdminSidebar onSearch={onSearch} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

