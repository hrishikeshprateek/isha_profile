"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOut, Plus, Trash2, Eye, Check, X, Calendar, Mail, Briefcase, Eye as EyeIcon, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface BuildSubmission {
  id?: string;
  _id?: string;
  category: string;
  vibe: string[];
  description: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
  submittedAt?: string;
  status?: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminBuildPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState<BuildSubmission[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<BuildSubmission | null>(null);

  // Pagination
  const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubmissions = submissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Fetch submissions
  async function fetchSubmissions() {
    try {
      setSubmissionLoading(true);
      setError('');
      const res = await fetch('/api/build');
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch {
      setError('Failed to load submissions');
    } finally {
      setSubmissionLoading(false);
    }
  }

  // Delete submission
  async function handleDelete(id: string) {
    if (!window.confirm('Delete this submission?')) return;
    try {
      const res = await fetch(`/api/build?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Submission deleted');
        fetchSubmissions();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('Failed to delete submission');
    }
  }

  // Update status
  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch('/api/build', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Status updated');
        fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch {
      setError('Failed to update status');
    }
  }

  // Auth
  useEffect(() => {
    if (!auth) { router.push('/auth/login'); return; }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser || !(await firebaseUser.getIdTokenResult()).claims.admin) {
          router.push('/auth/login');
          return;
        }
        localStorage.setItem('admin_token', (await firebaseUser.getIdTokenResult()).token);
        setIsAuthorized(true);
        setLoading(false);
        fetchSubmissions();
      } catch {
        router.push('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    if (auth) await auth.signOut();
    localStorage.removeItem('admin_token');
    router.push('/auth/login');
  }

  if (loading) return <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">Loading...</div>;
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] pt-24 px-4 md:px-10 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B7E] font-bold">Enquiries</p>
            <h1 className="text-3xl font-serif font-bold">Build Requests</h1>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-full bg-white border border-[#3B241A]/10 text-[#3B241A] hover:bg-[#F2A7A7]">
            <LogOut size={18} />
          </button>
        </div>

        {/* Messages */}
        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}

        {/* Submissions Grid */}
        <div className="bg-white rounded-2xl border border-[#3B241A]/10 overflow-hidden">
          {submissionLoading ? (
            <div className="p-12 flex items-center justify-center gap-3">
              <Loader size={20} className="animate-spin text-[#A68B7E]" />
              <p className="text-sm text-[#A68B7E]">Loading submissions...</p>
            </div>
          ) : paginatedSubmissions.length === 0 ? (
            <div className="p-12 text-center text-[#3B241A]/40">
              <p className="text-sm">No build requests yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3B241A]/5">
              {paginatedSubmissions.map((submission) => (
                <div
                  key={submission.id || submission._id}
                  className="p-5 md:p-6 hover:bg-[#FAF0E6]/20 transition-colors"
                >
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {/* Main Info */}
                    <div>
                      <p className="text-xs uppercase text-[#A68B7E] font-bold mb-1">Name</p>
                      <p className="font-bold text-sm">{submission.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-[#A68B7E] font-bold mb-1">Category</p>
                      <p className="font-bold text-sm">{submission.category}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-[#A68B7E] font-bold mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          submission.status === 'completed' ? 'bg-green-100 text-green-700' :
                          submission.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {submission.status || 'new'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mb-4 p-3 bg-[#FAF0E6]/30 rounded-lg">
                    <p className="text-xs font-bold text-[#A68B7E] mb-2">DESCRIPTION</p>
                    <p className="text-sm text-[#3B241A] line-clamp-2">{submission.description}</p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 mb-4 text-xs text-[#A68B7E]">
                    {submission.email && (
                      <div className="flex items-center gap-1">
                        <Mail size={14} /> {submission.email}
                      </div>
                    )}
                    {submission.budget && (
                      <div className="flex items-center gap-1">
                        <Briefcase size={14} /> {submission.budget}
                      </div>
                    )}
                    {submission.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} /> {submission.deadline}
                      </div>
                    )}
                  </div>

                  {/* Vibes */}
                  {submission.vibe && submission.vibe.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {submission.vibe.map((v) => (
                        <span key={v} className="px-2 py-1 bg-[#3B241A]/5 text-[#3B241A] text-xs rounded font-bold">
                          {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#FAF0E6] text-[#3B241A] text-xs font-bold hover:bg-[#3B241A] hover:text-[#FAF0E6] transition"
                    >
                      <EyeIcon size={14} /> View
                    </button>
                    <select
                      value={submission.status || 'new'}
                      onChange={(e) => updateStatus(submission.id || submission._id || '', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#3B241A]/10 text-xs font-bold focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(submission.id || submission._id || '')}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !submissionLoading && (
            <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-[#3B241A]/5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === p ? 'bg-[#3B241A] text-[#FAF0E6]' : 'bg-white border border-[#3B241A]/10'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">{selectedSubmission.name}</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-[#A68B7E] font-bold mb-2">Category</p>
                <p className="text-sm">{selectedSubmission.category}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#A68B7E] font-bold mb-2">Email</p>
                <p className="text-sm">{selectedSubmission.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#A68B7E] font-bold mb-2">Budget</p>
                <p className="text-sm">{selectedSubmission.budget || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#A68B7E] font-bold mb-2">Deadline</p>
                <p className="text-sm">{selectedSubmission.deadline || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#A68B7E] font-bold mb-2">Description</p>
                <p className="text-sm">{selectedSubmission.description}</p>
              </div>
              {selectedSubmission.vibe && selectedSubmission.vibe.length > 0 && (
                <div>
                  <p className="text-xs uppercase text-[#A68B7E] font-bold mb-2">Vibes</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubmission.vibe.map((v) => (
                      <span key={v} className="px-3 py-1 bg-[#3B241A]/5 text-[#3B241A] text-xs rounded font-bold">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs uppercase text-[#A68B7E] font-bold mb-2">Submitted</p>
                <p className="text-sm">
                  {new Date(selectedSubmission.submittedAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t flex gap-2">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="flex-1 px-4 py-2 border border-[#3B241A]/10 rounded-lg text-sm font-bold hover:bg-[#FAF0E6]"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedSubmission.id || selectedSubmission._id || '')}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

