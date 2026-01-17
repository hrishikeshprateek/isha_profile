"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    AlertCircle,
    Lock,
    Key,
    Eye,
    EyeOff
} from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function check() {
            try {
                if (!auth) {
                    if (mounted) setCheckingAuth(false);
                    return;
                }

                const user = auth.currentUser;
                if (!user) {
                    if (mounted) setCheckingAuth(false);
                    return;
                }

                const idTokenResult = await user.getIdTokenResult();
                if (idTokenResult?.claims?.admin) {
                    router.replace('/admin');
                    return;
                }
            } catch (err) {
                console.warn('Auth check failed:', err);
            } finally {
                if (mounted) setCheckingAuth(false);
            }
        }

        check();
        return () => {
            mounted = false;
        };
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!auth) {
            setError('Firebase not initialized. Please refresh the page.');
            setLoading(false);
            return;
        }

        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const idTokenResult = await credential.user.getIdTokenResult();
            const firebaseToken = idTokenResult.token;

            if (!idTokenResult.claims.admin) {
                setError('You do not have admin privileges');
                setLoading(false);
                return;
            }

            localStorage.setItem('admin_token', firebaseToken);

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firebaseToken }),
                });

                if (!res.ok) {
                    console.warn('Backend sync failed, proceeding with client token');
                }
            } catch (syncErr) {
                console.warn('Backend sync error, proceeding with client token', syncErr);
            }

            router.push('/admin');
            return;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err) || 'An error occurred';

            if (message.includes('auth/user-not-found')) {
                setError('User not found');
            } else if (message.includes('auth/wrong-password')) {
                setError('Invalid password');
            } else if (message.includes('auth/invalid-email')) {
                setError('Invalid email address');
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    }

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[#3B241A]">Checking authentication...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen !bg-[#FAF0E6] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:!bg-[#F2A7A7] selection:!text-[#3B241A]">

            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F2A7A7]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3B241A]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-center w-full max-w-[800px]">

                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-30 w-16 md:w-24 h-[480px] rounded-l-2xl rounded-r-md shadow-[10px_0_40px_rgba(59,36,26,0.4)] flex flex-col items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ background: 'linear-gradient(90deg, #2A1510 0%, #3B241A 40%, #4E3025 100%)' }}
                >
                    <div className="absolute top-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay" />
                    <div className="absolute top-8 w-full h-[2px] bg-[#FAF0E6]/20 shadow-sm" />
                    <div className="absolute bottom-8 w-full h-[2px] bg-[#FAF0E6]/20 shadow-sm" />

                    <div className="rotate-180 whitespace-nowrap h-full flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] !text-[#FAF0E6]/60 drop-shadow-md">
                            Isha Rani • Admin
                        </span>
                    </div>

                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 120 }}
                        transition={{ delay: 1.5, duration: 1, type: "spring" }}
                        className="absolute top-0 right-4 w-4 bg-[#F2A7A7] shadow-md rounded-b-md"
                    />
                </motion.div>

                <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.2, type: "spring", bounce: 0.2 }}
                    className="relative z-20 -ml-2 w-full max-w-[420px] !bg-white h-[440px] rounded-r-2xl shadow-2xl border border-[#3B241A]/5 flex flex-col justify-center p-8 md:p-10"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-10" />

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                        className="relative z-20"
                    >
                        <div className="mb-8 pl-4 border-l-2 !border-[#F2A7A7]">
                            <div className="inline-flex items-center gap-2 mb-1 opacity-60">
                                <Lock size={12} className="!text-[#3B241A]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest !text-[#3B241A]">Restricted Area</span>
                            </div>
                            <h1 className="text-3xl font-serif font-bold !text-[#3B241A]">Login.</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full !bg-[#FAF0E6]/30 border-b-2 !border-[#3B241A]/10 py-3 pl-10 pr-4 !text-[#3B241A] text-sm font-medium focus:outline-none focus:!bg-[#FAF0E6]/60 focus:!border-[#F2A7A7] transition-all placeholder:text-[#3B241A]/30"
                                    required
                                />
                                <div className="absolute left-0 top-3 !text-[#3B241A]/30 group-focus-within:!text-[#F2A7A7] transition-colors">
                                    <Key size={16} />
                                </div>
                            </div>

                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full !bg-[#FAF0E6]/30 border-b-2 !border-[#3B241A]/10 py-3 pl-10 pr-10 !text-[#3B241A] text-sm font-medium focus:outline-none focus:!bg-[#FAF0E6]/60 focus:!border-[#F2A7A7] transition-all placeholder:text-[#3B241A]/30"
                                    required
                                />

                                <div className="absolute left-0 top-3 !text-[#3B241A]/30 group-focus-within:!text-[#F2A7A7] transition-colors">
                                    <Lock size={16} />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-3 p-1 !text-[#3B241A]/30 hover:!text-[#3B241A] hover:bg-[#3B241A]/5 rounded-full transition-all focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <div className="flex justify-end -mt-2">
                                <a href="#" className="text-[10px] text-[#3B241A]/40 hover:text-[#F2A7A7] font-bold uppercase tracking-wider transition-colors">
                                    Forgot Password?
                                </a>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="flex items-center gap-2 text-red-600 text-[11px] font-bold bg-red-50 p-3 rounded-lg border border-red-100"
                                >
                                    <AlertCircle size={14} />
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full !bg-[#3B241A] !text-[#FAF0E6] py-3.5 rounded-xl font-bold hover:!bg-[#F2A7A7] hover:!text-[#3B241A] transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[#3B241A]/10 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                            >
                                {loading ? "Authenticating..." : "Unlock Dashboard"}
                                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>

            </div>

            <div className="absolute bottom-6 text-center w-full">
                <p className="text-[10px] !text-[#3B241A]/20 uppercase tracking-widest font-bold">
                    © {new Date().getFullYear()} Secured System
                </p>
            </div>

        </div>
    );
}

