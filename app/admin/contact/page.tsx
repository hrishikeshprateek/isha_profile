"use client";

import React from 'react';
import { Mail } from 'lucide-react';

export default function AdminContactPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F2A7A7] to-[#9999FF] flex items-center justify-center shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#3B241A]">Contact Info</h1>
            <p className="text-[#6E5045]">Manage contact information</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-[#3B241A]/10">
          <p className="text-[#6E5045] text-center py-12">
            Contact information management coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

