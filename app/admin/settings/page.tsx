"use client";

import React, { useEffect, useState } from 'react';
import { Settings, ShieldCheck, MessageSquare, Globe, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettingsPage() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Site is under maintenance. We\'ll be back soon!');
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/admin/maintenance');
                const data = await res.json();
                if (data.success) {
                    setMaintenanceMode(data.maintenanceMode);
                    setMessage(data.message);
                }
            } catch (error) {
                console.error('Failed to fetch status:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const handleUpdate = async (newMode: boolean, newMessage: string) => {
        setSaving(true);
        setFeedback(null);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('/api/admin/maintenance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ enabled: newMode, message: newMessage })
            });

            const data = await res.json();
            if (data.success) {
                setMaintenanceMode(newMode);
                setFeedback({ type: 'success', text: 'System settings synced' });
                setTimeout(() => setFeedback(null), 3000);
            }
        } catch (error) {
            setFeedback({ type: 'error', text: 'Sync encountered an error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-[#A68B7E]" />
            <p className="text-sm font-serif italic text-[#A68B7E]">Gathering configurations...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#3B241A] flex items-center justify-center">
                        <Settings className="w-6 h-6 text-[#F2A7A7]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#3B241A]">Portfolio Settings</h1>
                        <p className="text-xs uppercase tracking-widest text-[#A68B7E] font-semibold">Global Controls</p>
                    </div>
                </div>

                {/* Status indicator */}
                <AnimatePresence>
                    {feedback && (
                        <motion.p
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-xs font-bold ${feedback.type === 'success' ? 'text-green-600' : 'text-[#DC7C7C]'}`}
                        >
                            {feedback.text}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Control Card */}
            <div className="bg-white rounded-[2.5rem] border border-[#3B241A]/5 shadow-sm overflow-hidden">
                <div className="p-8">
                    {/* Maintenance Toggle Row */}
                    <div className="flex items-center justify-between group">
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${maintenanceMode ? 'bg-[#DC7C7C]/10 text-[#DC7C7C]' : 'bg-[#FAF0E6] text-[#A68B7E]'}`}>
                                {maintenanceMode ? <Globe className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-[#3B241A]">Maintenance Mode</h3>
                                <p className="text-sm text-[#A68B7E]">Hide site from public view</p>
                            </div>
                        </div>

                        {/* Signature Toggle Switch */}
                        <button
                            onClick={() => handleUpdate(!maintenanceMode, message)}
                            disabled={saving}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-500 flex items-center ${maintenanceMode ? 'bg-[#DC7C7C]' : 'bg-[#FAF0E6]'}`}
                        >
                            <motion.div
                                animate={{ x: maintenanceMode ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-6 h-6 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>

                    {/* Conditional Message Area */}
                    <AnimatePresence>
                        {maintenanceMode && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-8 pt-8 border-t border-[#FAF0E6] space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#6E5045] uppercase tracking-tighter">
                                        <MessageSquare size={14} />
                                        Public Message
                                    </div>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-[#FAF0E6]/50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-[#F2A7A7]/30 text-[#3B241A] placeholder:text-[#A68B7E]/50 resize-none transition-all"
                                        rows={3}
                                    />
                                    <button
                                        onClick={() => handleUpdate(true, message)}
                                        disabled={saving}
                                        className="w-full h-12 rounded-2xl bg-[#3B241A] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#2A1810] transition-colors"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                                        Update Notification
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Secondary Info Footer */}
                <div className="bg-[#FAF0E6]/30 p-6 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#DC7C7C] animate-pulse" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#6E5045]">
                        Admin users will always see the live site regardless of status.
                    </p>
                </div>
            </div>
        </div>
    );
}