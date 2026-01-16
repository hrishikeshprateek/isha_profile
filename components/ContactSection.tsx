"use client";

import Link from "next/link";
import { Mail, ArrowRight, Zap, ArrowUpRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
    return (
        <section className="py-16 bg-[#FAF0E6] relative overflow-hidden flex items-center justify-center">

            {/* Background Ambience (Subtle) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#F2A7A7]/10 rounded-full blur-[100px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#3B241A]/5 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">

                <div className="grid md:grid-cols-12 gap-6 items-stretch">

                    {/* LEFT: Quick Message Form (Compact) */}
                    <div className="md:col-span-7 bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl shadow-[#3B241A]/5 flex flex-col justify-center">
                        <div className="mb-6">
                            <h2 className="text-3xl font-serif font-bold text-[#3B241A]">
                                Quick <span className="text-[#F2A7A7] italic">Chat</span>
                            </h2>
                            <p className="text-[#6E5045] text-sm mt-2">
                                For general inquiries, speaking, or just saying hi.
                            </p>
                        </div>

                        <form className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="group relative">
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="peer w-full bg-transparent border-b border-[#3B241A]/20 py-2 text-base text-[#3B241A] font-medium placeholder-transparent focus:outline-none focus:border-[#F2A7A7] transition-all"
                                        placeholder="Name"
                                    />
                                    <label htmlFor="name" className="absolute left-0 -top-2.5 text-[10px] font-bold text-[#3B241A]/50 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#3B241A]/50 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#F2A7A7]">
                                        Name
                                    </label>
                                </div>
                                <div className="group relative">
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="peer w-full bg-transparent border-b border-[#3B241A]/20 py-2 text-base text-[#3B241A] font-medium placeholder-transparent focus:outline-none focus:border-[#F2A7A7] transition-all"
                                        placeholder="Email"
                                    />
                                    <label htmlFor="email" className="absolute left-0 -top-2.5 text-[10px] font-bold text-[#3B241A]/50 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#3B241A]/50 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#F2A7A7]">
                                        Email
                                    </label>
                                </div>
                            </div>

                            <div className="group relative">
                                <textarea
                                    id="message"
                                    rows={2}
                                    required
                                    className="peer w-full bg-transparent border-b border-[#3B241A]/20 py-2 text-base text-[#3B241A] font-medium placeholder-transparent focus:outline-none focus:border-[#F2A7A7] transition-all resize-none"
                                    placeholder="Message"
                                />
                                <label htmlFor="message" className="absolute left-0 -top-2.5 text-[10px] font-bold text-[#3B241A]/50 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#3B241A]/50 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#F2A7A7]">
                                    Message
                                </label>
                            </div>

                            <div className="pt-2">
                                <Button className="w-full sm:w-auto bg-[#3B241A] hover:bg-[#F2A7A7] hover:text-[#3B241A] text-[#FAF0E6] rounded-full px-6 py-2 h-10 text-sm font-bold transition-all duration-300 shadow-lg group">
                                    Send Message
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: The "Project Launcher" Stack */}
                    <div className="md:col-span-5 flex flex-col gap-4">

                        {/* 1. The Build Card */}
                        <div className="flex-1 bg-[#3B241A] rounded-3xl p-6 text-[#FAF0E6] relative overflow-hidden group flex flex-col justify-between min-h-[220px]">
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A7A7]/20 rounded-full blur-[40px] group-hover:bg-[#F2A7A7]/30 transition-all duration-500" />

                            <div className="flex justify-between items-start">
                                <h3 className="text-2xl font-serif font-bold leading-tight">
                                    Ready to <br/> <span className="text-[#F2A7A7]">Start?</span>
                                </h3>
                                <div className="w-10 h-10 rounded-full bg-[#F2A7A7] flex items-center justify-center text-[#3B241A] shadow-lg shadow-[#F2A7A7]/20 group-hover:scale-110 transition-transform duration-500">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-[#FAF0E6]/70 text-xs leading-relaxed mb-6">
                                    Skip the small talk. Fill out the project planner so we can hit the ground running.
                                </p>

                                <Link
                                    href="/build"
                                    className="group/btn flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 hover:bg-[#F2A7A7] hover:border-[#F2A7A7] transition-all duration-300"
                                >
                                    <span className="font-bold text-[#FAF0E6] text-sm group-hover/btn:text-[#3B241A] pl-2">
                                        Open Project Planner
                                    </span>
                                    <ArrowUpRight size={16} className="text-[#FAF0E6] group-hover/btn:text-[#3B241A]" />
                                </Link>
                            </div>
                        </div>

                        {/* 2. Direct Email Card */}
                        <div className="bg-white/60 rounded-3xl p-5 border border-white flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#3B241A]/50 mb-0.5">Direct Email</p>
                                <a href="mailto:hello@isharani.com" className="text-base font-bold text-[#3B241A] hover:text-[#F2A7A7] transition-colors">
                                    me@isharani.in
                                </a>
                            </div>
                            <button
                                className="p-2.5 bg-[#FAF0E6] hover:bg-[#3B241A] hover:text-[#FAF0E6] rounded-full text-[#3B241A] transition-colors"
                                title="Copy Email"
                            >
                                <Copy size={16} />
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;