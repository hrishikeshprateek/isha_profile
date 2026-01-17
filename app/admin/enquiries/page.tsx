"use client";

import React from 'react';
import Link from 'next/link';

export default function AdminEnquiriesPage() {
  return (
    <div className="min-h-screen bg-[#FAF0E6] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#3B241A]">Enquiries</h1>
          <Link href="/admin" className="text-sm text-[#A68B7E]">Back to dashboard</Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3B241A]/5">
          <p className="text-sm text-[#6E5045] mb-4">No enquiries yet — they will appear here.</p>

          {/* Example list item */}
          <div className="space-y-3">
            <div className="p-4 border rounded-md hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[#3B241A]">Rahul Verma</div>
                  <div className="text-xs text-[#A68B7E]">rahul@example.com • 2 hours ago</div>
                </div>
                <div className="text-xs text-[#3B241A]/40">Open</div>
              </div>
              <p className="mt-2 text-sm text-[#3B241A]">Hi, I'd love to discuss a collaboration...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

