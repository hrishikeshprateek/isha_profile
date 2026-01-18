"use client";

import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF0E6] flex">
      <AdminSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

