import React from 'react';
import AdminShell from '@/components/AdminShell';
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin - Isha Rani',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Layout for all admin routes EXCEPT /admin/login (which has its own root layout)
  // Do NOT wrap in html/body here - let child layouts handle that
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
