import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Isha Rani',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Auth pages (login, register) should not have admin sidebar
  return <>{children}</>;
}

