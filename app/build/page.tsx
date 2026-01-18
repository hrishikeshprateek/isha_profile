"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Monitor,
    Video,
    Sparkles,
    Zap,
    Code,
    MessageSquare,
    Layers,
    X,
    Wrench
} from "lucide-react";

// --- CONFIGURATION ---
const STEPS = [
    { id: 1, title: "The Goal" },
    { id: 2, title: "The Vibe" },
    { id: 3, title: "The Details" },
    { id: 4, title: "Final Touch" },
];

const CATEGORIES = [
    { id: "design", label: "UI/UX Design", icon: Monitor, desc: "Websites, App Interfaces" },
    { id: "dev", label: "Development", icon: Code, desc: "Next.js, React, Full Stack" },
    { id: "content", label: "Content Creation", icon: Video, desc: "Reels, Scripts, UGC" },
    { id: "branding", label: "Brand Identity", icon: Sparkles, desc: "Logo, Strategy, Colors" },
    { id: "graphics", label: "Graphic Design", icon: Layers, desc: "Social Posts, Posters" },
    { id: "consult", label: "Consultation", icon: MessageSquare, desc: "Strategy, Audits, Ideas" },
    { id: "custom", label: "Custom Project", icon: Wrench, desc: "MVPs, Unique Ideas, SaaS" },
];

const VIBES = ["Minimalist", "Bold", "Playful", "Corporate", "Luxury", "Futuristic", "Retro", "Friendly", "Techy", "Organic"];
const BUDGETS = ["< ₹25k", "₹25k - ₹50k", "₹50k - ₹1L", "₹1L - ₹3L", "₹3L+"];

// --- MAIN CONTENT COMPONENT ---
function ProjectPlannerContent() {
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);

    // Initialize state with lazy initialization function to avoid setState in effect
    const [formData, setFormData] = useState(() => {
        const urlCategory = searchParams.get("category") || "";
        return {
            category: urlCategory,
            vibe: [] as string[],
            description: "",
            budget: "",
            deadline: "",
            name: "",
            email: "",
        };
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleNext = async () => {
        if (currentStep === 4) {
            // Submit form to API
            setSubmitting(true);
            setSubmitError("");

            try {
                const response = await fetch('/api/build', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setSubmitSuccess(true);
                    // Reset form after success
                    setTimeout(() => {
                        setFormData({
                            category: "",
                            vibe: [],
                            description: "",
                            budget: "",
                            deadline: "",
                            name: "",
                            email: "",
                        });
                        setCurrentStep(1);
                        setSubmitSuccess(false);
                    }, 2000);
                } else {
                    setSubmitError(data.error || 'Failed to submit proposal');
                }
            } catch (error) {
                setSubmitError('Error submitting proposal. Please try again.');
                console.error('Submission error:', error);
            } finally {
                setSubmitting(false);
            }
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const toggleVibe = (vibe: string) => {
        setFormData(prev => ({
            ...prev,
            vibe: prev.vibe.includes(vibe)
                ? prev.vibe.filter(v => v !== vibe)
                : [...prev.vibe, vibe]
        }));
    };

    const progress = (currentStep / STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex flex-col lg:flex-row font-sans text-[#3B241A] overflow-x-hidden">

            {/* --- MOBILE TOP BAR --- */}
            <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-[#FAF0E6]/90 backdrop-blur-md border-b border-[#3B241A]/10 px-4 py-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 hover:bg-[#3B241A]/5 rounded-full transition-colors">
                            <X size={20} className="text-[#3B241A]" />
                        </Link>
                        <span className="font-serif font-bold text-[#3B241A]">ISHA RANI</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/50">
                        Step {currentStep}/{STEPS.length}
                    </span>
                </div>
                <div className="w-full h-1 bg-[#3B241A]/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#F2A7A7]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* --- LEFT PANEL (Desktop Sidebar) --- */}
            <div className="hidden lg:flex lg:w-1/3 bg-[#3B241A] text-[#FAF0E6] p-12 flex-col justify-between overflow-hidden h-screen sticky top-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2A7A7]/10 rounded-full blur-[80px]" />

                <div>
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 rounded-full bg-[#F2A7A7] flex items-center justify-center text-[#3B241A]">
                            <Zap size={16} fill="currentColor" />
                        </div>
                        <span className="font-serif font-bold tracking-wide">ISHA RANI</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-serif font-bold leading-tight">
                            Let&#39;s build <br/>
                            <span className="text-[#F2A7A7] italic">your vision.</span>
                        </h1>
                        <p className="text-[#FAF0E6]/70 text-lg leading-relaxed max-w-sm">
                            {currentStep === 1 && "Start by choosing a discipline. What are we creating?"}
                            {currentStep === 2 && "Aesthetics matter. Define the mood and feel."}
                            {currentStep === 3 && "Let's align on the practical details to ensure success."}
                            {currentStep === 4 && "The final step. Tell me where to send the plan."}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex items-center gap-4">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                                ${currentStep >= step.id ? "bg-[#F2A7A7] text-[#3B241A]" : "bg-white/10 text-white/30"}
                            `}>
                                {currentStep > step.id ? <Check size={14} /> : step.id}
                            </div>
                            <span className={`text-sm uppercase tracking-widest font-bold transition-colors duration-500 ${currentStep >= step.id ? "text-[#FAF0E6]" : "text-[#FAF0E6]/30"}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>


            {/* --- RIGHT PANEL: Form & Footer --- */}
            <div className="lg:w-2/3 flex flex-col min-h-screen relative">

                {/* Desktop Exit Button */}
                <div className="hidden lg:block absolute top-8 right-8 z-50">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-[#3B241A] hover:text-[#FAF0E6] transition-all duration-300 group"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider">Close</span>
                        <X size={16} />
                    </Link>
                </div>

                {/* Form Content */}
                <div className="flex-grow p-6 pt-28 lg:p-20 flex flex-col">
                    <div className="max-w-4xl w-full mx-auto flex-grow flex flex-col justify-center">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: Categories */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#3B241A]">Select a Category</h2>
                                    <p className="text-[#6E5045] mb-8">What type of project are you looking to start?</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setFormData({ ...formData, category: cat.id })}
                                                className={`
                                                    p-5 rounded-2xl border-2 text-left transition-all duration-300 group
                                                    ${formData.category === cat.id
                                                    ? "border-[#F2A7A7] bg-white shadow-md ring-1 ring-[#F2A7A7]"
                                                    : "border-[#3B241A]/5 bg-white/40 hover:bg-white hover:border-[#F2A7A7]/50"}
                                                    ${cat.id === 'custom' ? 'sm:col-span-2 md:col-span-1 lg:col-span-1' : ''} 
                                                `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${formData.category === cat.id ? "bg-[#F2A7A7] text-[#3B241A]" : "bg-[#3B241A]/5 text-[#3B241A] group-hover:bg-[#F2A7A7]/20"}`}>
                                                        <cat.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-base md:text-lg leading-tight">{cat.label}</h3>
                                                        <p className="text-xs text-[#6E5045] mt-1">{cat.desc}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2 */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#3B241A]">The Aesthetic</h2>
                                    <p className="text-[#6E5045] mb-8">Select keywords that match your vision.</p>

                                    <div className="mb-8">
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {VIBES.map((v) => (
                                                <button
                                                    key={v}
                                                    onClick={() => toggleVibe(v)}
                                                    className={`
                                                        px-4 py-2 rounded-full text-xs md:text-sm font-bold border transition-all
                                                        ${formData.vibe.includes(v)
                                                        ? "bg-[#3B241A] text-[#FAF0E6] border-[#3B241A]"
                                                        : "bg-white border-[#3B241A]/10 hover:border-[#F2A7A7] text-[#3B241A]"}
                                                    `}
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider text-[#3B241A]/50 mb-3">
                                            Additional Details
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-white/60 border-2 border-[#3B241A]/10 rounded-2xl p-4 focus:outline-none focus:border-[#F2A7A7] text-base md:text-lg placeholder:text-[#3B241A]/30 resize-none"
                                            placeholder={formData.category === 'custom' ? "Describe your unique idea..." : "I want it to look like..."}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3 */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#3B241A]">Logistics</h2>
                                    <p className="text-[#6E5045] mb-8">Timeline and Budget expectations.</p>

                                    <div className="mb-10">
                                        <label className="block text-sm font-bold uppercase tracking-wider text-[#3B241A]/50 mb-4">
                                            Estimated Budget (INR)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                            {BUDGETS.map((b) => (
                                                <button
                                                    key={b}
                                                    onClick={() => setFormData({...formData, budget: b})}
                                                    className={`
                                                        py-3 px-2 rounded-xl text-sm font-bold border transition-all text-center
                                                        ${formData.budget === b
                                                        ? "bg-[#F2A7A7] text-[#3B241A] border-[#F2A7A7]"
                                                        : "bg-white border-[#3B241A]/10 hover:border-[#F2A7A7]"}
                                                    `}
                                                >
                                                    {b}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider text-[#3B241A]/50 mb-4">
                                            Timeline
                                        </label>
                                        <select
                                            className="w-full bg-white/60 border-2 border-[#3B241A]/10 rounded-xl p-4 focus:outline-none focus:border-[#F2A7A7] text-base md:text-lg appearance-none cursor-pointer"
                                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                        >
                                            <option>No rush</option>
                                            <option>ASAP (1-2 weeks)</option>
                                            <option>1 Month</option>
                                            <option>3 Months</option>
                                        </select>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4 */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center"
                                >
                                    <div className="w-20 h-20 bg-[#F2A7A7] rounded-full flex items-center justify-center text-[#3B241A] mx-auto mb-6 shadow-xl shadow-[#F2A7A7]/30">
                                        <Sparkles size={32} />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#3B241A]">
                                        Ready to launch?
                                    </h2>
                                    <p className="text-[#6E5045] mb-8">
                                        Leave your details and I&#39;ll send over a proposal within 24 hours.
                                    </p>

                                    <div className="space-y-4 max-w-md mx-auto">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-white border-2 border-[#3B241A]/10 rounded-xl p-4 focus:outline-none focus:border-[#F2A7A7] text-center text-lg"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-white border-2 border-[#3B241A]/10 rounded-xl p-4 focus:outline-none focus:border-[#F2A7A7] text-center text-lg"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* --- NAVIGATION BUTTONS --- */}
                        <div className="mt-12 pt-6 border-t border-[#3B241A]/10 flex justify-between items-center">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`flex items-center gap-2 font-bold uppercase tracking-wider text-xs md:text-sm transition-opacity ${currentStep === 1 ? "opacity-0 pointer-events-none" : "opacity-50 hover:opacity-100"}`}
                            >
                                <ArrowLeft size={16} /> Back
                            </button>

                            <button
                                onClick={handleNext}
                                className="bg-[#3B241A] text-[#FAF0E6] px-6 md:px-8 py-3 md:py-4 rounded-full font-bold shadow-xl shadow-[#3B241A]/20 hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-all flex items-center gap-2 group text-sm md:text-base"
                            >
                                {currentStep === 4 ? "Send Request" : "Next Step"}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Minimalist Strip Footer */}
                <div className="mt-auto w-full bg-[#3B241A] text-[#FAF0E6]/60 py-6 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        <p>© {new Date().getFullYear()} Isha Rani. All Rights Reserved.</p>

                        <div className="flex items-center gap-6">
                            <Link href="#" className="hover:text-[#F2A7A7] transition-colors">Instagram</Link>
                            <Link href="#" className="hover:text-[#F2A7A7] transition-colors">LinkedIn</Link>
                            <Link href="mailto:hello@isharani.com" className="hover:text-[#F2A7A7] transition-colors">Email</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- EXPORT WRAPPED IN SUSPENSE ---
export default function ProjectPlanner() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAF0E6]"></div>}>
            <ProjectPlannerContent />
        </Suspense>
    );
}