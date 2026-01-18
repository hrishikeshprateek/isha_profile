"use client";

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Save,
    RefreshCw,
    Plus,
    X,
    User,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    Globe,
    Image as ImageIcon,
    Sparkles,
    Link as LinkIcon,
    Layers,
    Share2,
    Activity,
    ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- TYPES & INTERFACES ---

interface VCardData {
    profile: {
        name: string;
        role: string;
        email: string;
        phone: string;
        location: string;
        websiteDisplay: string;
        websiteUrl: string;
        avatar: string;
        status: string;
        yearsExp: string;
    };
    services: string[];
    tools: Array<{ name: string; color: string }>;
    latestProject: {
        title: string;
        subtitle: string;
        image: string;
        link: string;
    };
    socials: Array<{
        id: string; // This will now be selected via dropdown
        url: string;
        label: string;
    }>;
}

// Interface for the Helper Component
interface InputGroupProps {
    icon: React.ElementType;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    placeholder?: string;
    type?: string;
    options?: string[];
}

const SOCIAL_PLATFORMS = [
    "instagram",
    "linkedin",
    "github",
    "twitter",
    "youtube",
    "facebook",
    "behance",
    "dribbble",
    "website",
    "whatsapp",
    "email"
];

export default function VCardAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [vcard, setVcard] = useState<VCardData | null>(null);

    // --- AUTH & DATA FETCHING ---
    useEffect(() => {
        if (!auth) {
            router.push('/auth/login');
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser) {
                    setIsAuthorized(false);
                    setLoading(false);
                    router.push('/auth/login');
                    return;
                }
                const idTokenResult = await firebaseUser.getIdTokenResult();
                if (!idTokenResult.claims.admin) {
                    setIsAuthorized(false);
                    setLoading(false);
                    router.push('/auth/login');
                    return;
                }
                localStorage.setItem('admin_token', idTokenResult.token);
                setIsAuthorized(true);

                try {
                    const response = await fetch('/api/vcard');
                    const data = await response.json();
                    if (response.ok && data.success && data.data) {
                        setVcard(data.data);
                    } else {
                        setVcard(getDefaultVCard());
                    }
                } catch (err) {
                    console.error('Failed to fetch vcard:', err);
                    setVcard(getDefaultVCard());
                }
                setLoading(false);
            } catch (err) {
                console.error('Auth error:', err);
                setIsAuthorized(false);
                setLoading(false);
                router.push('/auth/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    async function fetchVCard() {
        try {
            setError('');
            const res = await fetch('/api/vcard');
            const data = await res.json();
            if (res.ok && data.success && data.data) {
                setVcard(data.data);
            } else {
                setVcard(getDefaultVCard());
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setVcard(getDefaultVCard());
            setError('Failed to load vcard - using defaults');
        }
    }

    function getDefaultVCard(): VCardData {
        return {
            profile: {
                name: 'Isha Rani',
                role: 'Digital Creator & Designer',
                email: 'me@isharani.in',
                phone: '+91 98765 43210',
                location: 'Patna, India',
                websiteDisplay: 'isharani.in',
                websiteUrl: 'https://isharani.in',
                avatar: '/isha_a.png',
                status: 'Available',
                yearsExp: '5+',
            },
            services: ['UI/UX Design', 'Brand Identity', 'Web Development'],
            tools: [
                { name: 'Figma', color: 'bg-[#1E1E1E]' },
                { name: 'Photoshop', color: 'bg-[#31A8FF]' },
            ],
            latestProject: {
                title: 'Neon Brand Identity',
                subtitle: 'Rebranding • 2026',
                image: '/isha_a.png',
                link: '#',
            },
            socials: [
                { id: 'instagram', url: '#', label: 'Instagram' },
                { id: 'linkedin', url: '#', label: 'LinkedIn' },
            ],
        };
    }

    async function handleSave() {
        if (!vcard) return;
        try {
            setSaving(true);
            setError('');
            setSuccess('');
            const res = await fetch('/api/vcard', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vcard),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess('VCard updated successfully!');
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setError(data.error || 'Failed to save vcard');
            }
        } catch {
            setError('Failed to save vcard');
        } finally {
            setSaving(false);
        }
    }

    // --- HELPER COMPONENT ---
    const InputGroup = ({ icon: Icon, label, value, onChange, placeholder, type = "text", options }: InputGroupProps) => (
        <div className="relative group">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[#3B241A]/40 mb-1.5 block ml-1">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B241A]/30 group-focus-within:text-[#F2A7A7] transition-colors pointer-events-none z-10">
                    <Icon size={16} />
                </div>

                {type === 'select' && options ? (
                    <div className="relative">
                        <select
                            value={value}
                            onChange={onChange}
                            className="w-full bg-[#FAF0E6]/50 border border-[#3B241A]/10 rounded-xl py-3 pl-10 pr-10 text-[#3B241A] text-sm font-medium focus:outline-none focus:bg-white focus:border-[#F2A7A7] focus:ring-4 focus:ring-[#F2A7A7]/10 transition-all appearance-none cursor-pointer"
                        >
                            {options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3B241A]/30 pointer-events-none">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full bg-[#FAF0E6]/50 border border-[#3B241A]/10 rounded-xl py-3 pl-10 pr-4 text-[#3B241A] text-sm font-medium focus:outline-none focus:bg-white focus:border-[#F2A7A7] focus:ring-4 focus:ring-[#F2A7A7]/10 transition-all placeholder:text-[#3B241A]/20"
                    />
                )}
            </div>
        </div>
    );

    // --- RENDER ---
    if (loading) return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center flex-col gap-4">
            <Sparkles className="animate-spin text-[#3B241A]" />
            <span className="text-[#3B241A] font-bold tracking-widest text-xs uppercase">Authenticating Studio...</span>
        </div>
    );
    if (!isAuthorized) return null;
    if (!vcard) return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center flex-col gap-4">
            <Sparkles className="animate-spin text-[#3B241A]" />
            <span className="text-[#3B241A] font-bold tracking-widest text-xs uppercase">Loading Profile Data...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#3B241A] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A] pb-20">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* FLOATING HEADER */}
            <div className="fixed md:sticky top-0 left-0 w-full z-40 bg-[#FAF0E6]/95 backdrop-blur-md border-b border-[#3B241A]/5 px-6 py-4 mb-8 shadow-sm transition-all">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3B241A] text-[#FAF0E6] flex items-center justify-center">
                            <span className="font-serif font-bold text-xl">V</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-serif font-bold leading-none">VCard Studio</h1>
                            <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold mt-1">Profile Configuration</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {error && <span className="text-red-500 text-xs font-bold px-3 py-1 bg-red-50 rounded-full animate-pulse">{error}</span>}
                        {success && <span className="text-green-600 text-xs font-bold px-3 py-1 bg-green-50 rounded-full">{success}</span>}

                        <button onClick={fetchVCard} className="p-2 rounded-full hover:bg-[#3B241A]/5 text-[#3B241A]/60 hover:text-[#3B241A] transition-colors" title="Reset">
                            <RefreshCw size={18}/>
                        </button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            disabled={saving}
                            className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3B241A] text-[#FAF0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#F2A7A7] hover:text-[#3B241A] disabled:opacity-50 shadow-lg shadow-[#3B241A]/10 transition-colors"
                        >
                            <Save size={14}/> {saving ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="max-w-6xl mx-auto px-6 relative z-10 pt-28 md:pt-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT COLUMN: MAIN PROFILE --- */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 1. Identity Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 border border-[#3B241A]/5 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A7A7]/10 rounded-bl-full pointer-events-none"/>

                            <div className="flex items-center gap-2 mb-6 text-[#3B241A]/50">
                                <User size={18} />
                                <h2 className="text-sm font-bold uppercase tracking-widest">Personal Identity</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup icon={User} label="Full Name" value={vcard.profile.name} onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, name: e.target.value } })} placeholder="e.g. Isha Rani" />
                                <InputGroup icon={Briefcase} label="Job Title" value={vcard.profile.role} onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, role: e.target.value } })} placeholder="e.g. Creator" />
                                <InputGroup icon={Mail} label="Email Address" value={vcard.profile.email} onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, email: e.target.value } })} placeholder="hello@example.com" />
                                <InputGroup icon={Phone} label="Phone Number" value={vcard.profile.phone} onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, phone: e.target.value } })} placeholder="+91..." />
                                <InputGroup icon={MapPin} label="Base Location" value={vcard.profile.location} onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, location: e.target.value } })} placeholder="City, Country" />

                                {/* Status Dropdown */}
                                <InputGroup
                                    icon={Activity}
                                    label="Status"
                                    type="select"
                                    value={vcard.profile.status}
                                    options={["Available for Work", "Busy / Do Not Disturb", "Open to Collaborations", "Offline"]}
                                    onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, status: e.target.value } })}
                                    placeholder=""
                                />
                            </div>
                        </motion.div>

                        {/* 2. Web Presence */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-[#3B241A]/5 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-6 text-[#3B241A]/50">
                                <Globe size={18} />
                                <h2 className="text-sm font-bold uppercase tracking-widest">Web Presence & Assets</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup icon={LinkIcon} label="Website Display Text" value={vcard.profile.websiteDisplay} onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, websiteDisplay: e.target.value } })} placeholder="isharani.in" />
                                <InputGroup icon={Globe} label="Website URL" value={vcard.profile.websiteUrl} onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, websiteUrl: e.target.value } })} placeholder="https://..." />
                                <div className="md:col-span-2">
                                    <InputGroup icon={ImageIcon} label="Profile Avatar URL" value={vcard.profile.avatar} onChange={(e) => setVcard({ ...vcard, profile: { ...vcard.profile, avatar: e.target.value } })} placeholder="https://..." />
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Latest Drop */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-[#3B241A] text-[#FAF0E6] rounded-3xl p-8 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2A7A7]/10 rounded-full blur-3xl pointer-events-none"/>

                            <div className="flex items-center gap-2 mb-6 text-[#FAF0E6]/50">
                                <Sparkles size={18} />
                                <h2 className="text-sm font-bold uppercase tracking-widest">Feature Project (Latest Drop)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FAF0E6]/40 mb-1 block">Project Title</label>
                                        <input type="text" value={vcard.latestProject.title} onChange={(e) => setVcard({ ...vcard, latestProject: { ...vcard.latestProject, title: e.target.value } })} className="w-full bg-[#FAF0E6]/10 border-none rounded-xl py-3 px-4 text-[#FAF0E6] focus:bg-[#FAF0E6]/20 transition-all placeholder:text-[#FAF0E6]/20" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FAF0E6]/40 mb-1 block">Subtitle / Tagline</label>
                                        <input type="text" value={vcard.latestProject.subtitle} onChange={(e) => setVcard({ ...vcard, latestProject: { ...vcard.latestProject, subtitle: e.target.value } })} className="w-full bg-[#FAF0E6]/10 border-none rounded-xl py-3 px-4 text-[#FAF0E6] focus:bg-[#FAF0E6]/20 transition-all placeholder:text-[#FAF0E6]/20" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FAF0E6]/40 mb-1 block">Project Link</label>
                                        <input type="text" value={vcard.latestProject.link} onChange={(e) => setVcard({ ...vcard, latestProject: { ...vcard.latestProject, link: e.target.value } })} className="w-full bg-[#FAF0E6]/10 border-none rounded-xl py-3 px-4 text-[#FAF0E6] focus:bg-[#FAF0E6]/20 transition-all placeholder:text-[#FAF0E6]/20" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FAF0E6]/40 mb-1 block">Cover Image URL</label>
                                        <input type="text" value={vcard.latestProject.image} onChange={(e) => setVcard({ ...vcard, latestProject: { ...vcard.latestProject, image: e.target.value } })} className="w-full bg-[#FAF0E6]/10 border-none rounded-xl py-3 px-4 text-[#FAF0E6] focus:bg-[#FAF0E6]/20 transition-all placeholder:text-[#FAF0E6]/20" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- RIGHT COLUMN: LISTS --- */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Services */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-6 border border-[#3B241A]/5 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2 text-[#3B241A]/50">
                                    <Layers size={18} />
                                    <h2 className="text-sm font-bold uppercase tracking-widest">Services</h2>
                                </div>
                                <button onClick={() => setVcard({ ...vcard, services: [...vcard.services, ''] })} className="p-1.5 bg-[#FAF0E6] rounded-lg hover:bg-[#F2A7A7] text-[#3B241A] transition-colors"><Plus size={14}/></button>
                            </div>

                            <div className="space-y-3">
                                {vcard.services.map((service, i) => (
                                    <div key={i} className="flex gap-2 group">
                                        <input
                                            type="text"
                                            value={service}
                                            onChange={(e) => {
                                                const newServices = [...vcard.services];
                                                newServices[i] = e.target.value;
                                                setVcard({ ...vcard, services: newServices });
                                            }}
                                            className="flex-1 px-4 py-2 bg-[#FAF0E6]/30 border border-transparent focus:bg-white focus:border-[#F2A7A7] rounded-xl text-sm transition-all"
                                            placeholder="Service Name"
                                        />
                                        <button onClick={() => setVcard({ ...vcard, services: vcard.services.filter((_, idx) => idx !== i) })} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"><X size={14}/></button>
                                    </div>
                                ))}
                                {vcard.services.length === 0 && <p className="text-xs text-[#3B241A]/40 italic text-center py-4">No services added.</p>}
                            </div>
                        </motion.div>

                        {/* Tools/Stack */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                            className="bg-white rounded-3xl p-6 border border-[#3B241A]/5 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2 text-[#3B241A]/50">
                                    <Layers size={18} />
                                    <h2 className="text-sm font-bold uppercase tracking-widest">My Stack</h2>
                                </div>
                                <button onClick={() => setVcard({ ...vcard, tools: [...vcard.tools, { name: '', color: 'bg-[#1E1E1E]' }] })} className="p-1.5 bg-[#FAF0E6] rounded-lg hover:bg-[#F2A7A7] text-[#3B241A] transition-colors"><Plus size={14}/></button>
                            </div>

                            <div className="space-y-3">
                                {vcard.tools.map((tool, i) => (
                                    <div key={i} className="flex gap-2 group">
                                        <input
                                            type="text"
                                            value={tool.name}
                                            onChange={(e) => {
                                                const newTools = [...vcard.tools];
                                                newTools[i] = { ...tool, name: e.target.value };
                                                setVcard({ ...vcard, tools: newTools });
                                            }}
                                            className="flex-1 px-4 py-2 bg-[#FAF0E6]/30 border border-transparent focus:bg-white focus:border-[#F2A7A7] rounded-xl text-sm transition-all"
                                            placeholder="Tool Name (e.g. Figma)"
                                        />
                                        <input
                                            type="color"
                                            value={tool.color.replace('bg-[', '').replace(']', '') || '#1E1E1E'}
                                            onChange={(e) => {
                                                const newTools = [...vcard.tools];
                                                newTools[i] = { ...tool, color: `bg-[${e.target.value}]` };
                                                setVcard({ ...vcard, tools: newTools });
                                            }}
                                            className="w-12 h-10 rounded-lg border border-[#3B241A]/10 cursor-pointer"
                                        />
                                        <button onClick={() => setVcard({ ...vcard, tools: vcard.tools.filter((_, idx) => idx !== i) })} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"><X size={14}/></button>
                                    </div>
                                ))}
                                {vcard.tools.length === 0 && <p className="text-xs text-[#3B241A]/40 italic text-center py-4">No tools added.</p>}
                            </div>
                        </motion.div>

                        {/* ...existing code... */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                            className="bg-white rounded-3xl p-6 border border-[#3B241A]/5 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2 text-[#3B241A]/50">
                                    <Share2 size={18} />
                                    <h2 className="text-sm font-bold uppercase tracking-widest">Social Links</h2>
                                </div>
                                <button onClick={() => setVcard({ ...vcard, socials: [...vcard.socials, { id: 'instagram', url: '', label: '' }] })} className="p-1.5 bg-[#FAF0E6] rounded-lg hover:bg-[#F2A7A7] text-[#3B241A] transition-colors"><Plus size={14}/></button>
                            </div>

                            <div className="space-y-4">
                                {vcard.socials.map((social, i) => (
                                    <div key={i} className="p-3 bg-[#FAF0E6]/30 rounded-2xl border border-[#3B241A]/5 group hover:border-[#F2A7A7]/30 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Link #{i+1}</span>
                                            <button onClick={() => setVcard({ ...vcard, socials: vcard.socials.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600"><X size={12}/></button>
                                        </div>
                                        <div className="space-y-2">

                                            {/* PLATFORM DROPDOWN */}
                                            <div className="relative">
                                                <select
                                                    value={social.id}
                                                    onChange={(e) => {
                                                        const newSocials = [...vcard.socials];
                                                        newSocials[i] = { ...social, id: e.target.value };
                                                        setVcard({ ...vcard, socials: newSocials });
                                                    }}
                                                    className="w-full px-3 py-2 bg-white border border-[#3B241A]/5 rounded-lg text-xs appearance-none cursor-pointer focus:outline-none focus:border-[#F2A7A7]"
                                                >
                                                    {SOCIAL_PLATFORMS.map(platform => (
                                                        <option key={platform} value={platform}>
                                                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                    <ChevronDown size={12} />
                                                </div>
                                            </div>

                                            <input
                                                type="text"
                                                placeholder="Full URL (e.g. https://instagram.com/...)"
                                                value={social.url}
                                                onChange={(e) => {
                                                    const newSocials = [...vcard.socials];
                                                    newSocials[i] = { ...social, url: e.target.value };
                                                    setVcard({ ...vcard, socials: newSocials });
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-[#3B241A]/5 rounded-lg text-xs focus:outline-none focus:border-[#F2A7A7]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Mobile Save Button (Fixed Bottom) */}
                        <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex justify-center items-center gap-2 px-6 py-4 rounded-2xl bg-[#3B241A] text-[#FAF0E6] font-bold shadow-2xl"
                            >
                                <Save size={18}/> {saving ? 'Saving...' : 'Save Updates'}
                            </motion.button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}