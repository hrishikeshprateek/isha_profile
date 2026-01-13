"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    MessageCircle,
    Grid,
    Play,
    Bookmark,
    MoreHorizontal,
    Send,
    Smile,
    User,
    Settings,
    ChevronDown,
    BadgeCheck,
    Clapperboard
} from "lucide-react";

// --- DATA ---
const POSTS = [
    { id: "1", type: "image", src: "/isha_a.png", likes: 1204, comments: 45 },
    { id: "2", type: "video", src: "https://videos.pexels.com/video-files/3045163/3045163-sd_640_360_30fps.mp4", likes: 3500, comments: 120 },
    { id: "3", type: "image", src: "/isha_a.png", likes: 900, comments: 32 },
    { id: "4", type: "image", src: "/isha_a.png", likes: 4500, comments: 310 },
    { id: "5", type: "video", src: "https://videos.pexels.com/video-files/3045163/3045163-sd_640_360_30fps.mp4", likes: 1200, comments: 88 },
    { id: "6", type: "image", src: "/isha_a.png", likes: 2100, comments: 150 },
    { id: "7", type: "image", src: "/isha_a.png", likes: 3300, comments: 200 },
    { id: "8", type: "image", src: "/isha_a.png", likes: 1800, comments: 90 },
    { id: "9", type: "image", src: "/isha_a.png", likes: 5000, comments: 400 },
];

const HIGHLIGHTS = [
    { id: 1, title: "UI Design", src: "/isha_a.png" },
    { id: 2, title: "Travel", src: "/isha_a.png" },
    { id: 3, title: "Process", src: "/isha_a.png" },
    { id: 4, title: "Clients", src: "/isha_a.png" },
];

export default function InstagramExact() {
    const [activeTab, setActiveTab] = useState("posts");
    const [selectedPost, setSelectedPost] = useState<any>(null);

    return (
        <div className="min-h-screen bg-[#FAF0E6] text-[#262626] font-sans pb-10">

            {/* CONTAINER */}
            <div className="max-w-[935px] mx-auto pt-8 px-5 md:px-0">

                {/* --- HEADER SECTION --- */}
                <header className="flex flex-col md:flex-row mb-10 md:mb-16">

                    {/* PROFILE PICTURE (Mobile: Left, Desktop: Big Left) */}
                    <div className="flex md:block md:mx-0 md:mr-24 mb-6 md:mb-0 shrink-0">
                        {/* Mobile Layout Wrapper */}
                        <div className="flex items-center w-full md:w-auto">

                            {/* The Ring */}
                            <div className="relative w-[77px] h-[77px] md:w-[150px] md:h-[150px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 shrink-0 cursor-pointer">
                                <div className="w-full h-full rounded-full border-[2px] border-[#FAF0E6] bg-white relative overflow-hidden">
                                    <Image src="/isha_a.png" alt="Isha" fill className="object-cover" />
                                </div>
                            </div>

                            {/* Mobile Stats (Right of Pic) */}
                            <div className="flex md:hidden flex-1 justify-around ml-4">
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-[#3B241A]">1,250</span>
                                    <span className="text-xs text-[#3B241A]/70">Posts</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-[#3B241A]">45.2K</span>
                                    <span className="text-xs text-[#3B241A]/70">Followers</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-[#3B241A]">543</span>
                                    <span className="text-xs text-[#3B241A]/70">Following</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PROFILE INFO (Right Side) */}
                    <div className="flex-1">

                        {/* Row 1: Handle & Buttons */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl md:text-2xl font-normal text-[#3B241A]">isha_designs</h2>
                                <BadgeCheck size={18} className="text-[#0095f6] fill-[#0095f6] text-white" />
                            </div>

                            <div className="flex gap-2">
                                <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-5 py-[7px] rounded-lg font-semibold text-sm transition-colors">
                                    Follow
                                </button>
                                <button className="bg-[#EFEFEF] hover:bg-[#dbdbdb] text-[#3B241A] px-4 py-[7px] rounded-lg font-semibold text-sm transition-colors">
                                    Message
                                </button>
                                <button className="bg-[#EFEFEF] hover:bg-[#dbdbdb] text-[#3B241A] p-[7px] rounded-lg transition-colors">
                                    <User size={20} strokeWidth={1.5} />
                                </button>
                            </div>

                            <Settings size={24} className="hidden md:block ml-2 cursor-pointer text-[#3B241A]" strokeWidth={1.5} />
                            <MoreHorizontal size={24} className="md:hidden absolute top-4 right-4 text-[#3B241A]" />
                        </div>

                        {/* Row 2: Desktop Stats (Hidden on Mobile) */}
                        <div className="hidden md:flex gap-10 mb-5 text-[#3B241A] text-base">
                            <span><strong className="font-semibold">1,250</strong> posts</span>
                            <span><strong className="font-semibold">45.2K</strong> followers</span>
                            <span><strong className="font-semibold">543</strong> following</span>
                        </div>

                        {/* Row 3: Bio */}
                        <div className="text-sm text-[#3B241A]">
                            <div className="font-semibold">Isha Rani</div>
                            <div className="whitespace-pre-line text-[#3B241A]/90">
                                🎨 Digital Creator<br/>
                                ✨ Designing aesthetic experiences<br/>
                                📍 India<br/>
                                👇 Check out my latest work!
                            </div>
                            <a href="#" className="font-semibold text-[#00376b] hover:underline">www.isha-portfolio.com</a>
                        </div>
                    </div>
                </header>

                {/* --- HIGHLIGHTS --- */}
                <div className="flex gap-4 md:gap-10 overflow-x-auto pb-4 mb-6 md:mb-12 scrollbar-hide">
                    {HIGHLIGHTS.map((h) => (
                        <div key={h.id} className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
                            <div className="w-16 h-16 md:w-[77px] md:h-[77px] rounded-full p-[2px] border border-[#3B241A]/10 bg-white">
                                <div className="w-full h-full rounded-full border border-white relative overflow-hidden bg-[#3B241A]/5">
                                    <Image src={h.src} alt={h.title} fill className="object-cover" />
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-[#3B241A]">{h.title}</span>
                        </div>
                    ))}
                </div>

                {/* --- TAB NAVIGATION (Sticky) --- */}
                <div className="border-t border-[#3B241A]/15 flex justify-around md:justify-center md:gap-14 text-xs font-semibold tracking-widest uppercase">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex items-center gap-1.5 py-4 border-t border-transparent transition-all ${activeTab === 'posts' ? 'border-[#3B241A] text-[#3B241A]' : 'text-[#3B241A]/40'}`}
                    >
                        <Grid size={12} strokeWidth={activeTab === 'posts' ? 3 : 1.5} />
                        <span className="hidden md:inline">Posts</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("reels")}
                        className={`flex items-center gap-1.5 py-4 border-t border-transparent transition-all ${activeTab === 'reels' ? 'border-[#3B241A] text-[#3B241A]' : 'text-[#3B241A]/40'}`}
                    >
                        <Clapperboard size={12} strokeWidth={activeTab === 'reels' ? 3 : 1.5} />
                        <span className="hidden md:inline">Reels</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("tagged")}
                        className={`flex items-center gap-1.5 py-4 border-t border-transparent transition-all ${activeTab === 'tagged' ? 'border-[#3B241A] text-[#3B241A]' : 'text-[#3B241A]/40'}`}
                    >
                        <User size={12} strokeWidth={activeTab === 'tagged' ? 3 : 1.5} />
                        <span className="hidden md:inline">Tagged</span>
                    </button>
                </div>

                {/* --- GRID LAYOUT --- */}
                <div className="grid grid-cols-3 gap-1 md:gap-7">
                    {POSTS.map((post) => (
                        <motion.div
                            key={post.id}
                            layoutId={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="relative aspect-square cursor-pointer group bg-[#3B241A]/5"
                        >
                            {/* Media */}
                            {post.type === "image" ? (
                                <Image src={post.src} alt="Post" fill className="object-cover" />
                            ) : (
                                <video src={post.src} className="w-full h-full object-cover" />
                            )}

                            {/* Type Indicator */}
                            {post.type === "video" && (
                                <div className="absolute top-2 right-2">
                                    <Clapperboard size={16} fill="white" stroke="white" className="drop-shadow-md" />
                                </div>
                            )}

                            {/* Desktop Hover Overlay */}
                            <div className="absolute inset-0 bg-black/30 hidden md:flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="flex items-center gap-1.5 text-white font-bold">
                                    <Heart size={22} fill="white" /> {post.likes}
                                </div>
                                <div className="flex items-center gap-1.5 text-white font-bold">
                                    <MessageCircle size={22} fill="white" /> {post.comments}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* --- MODAL OVERLAY --- */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPost(null)}
                        className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 md:p-8 backdrop-blur-sm"
                    >
                        <motion.div
                            layoutId={selectedPost.id}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white max-w-[1000px] w-full max-h-[90vh] rounded-[4px] overflow-hidden flex flex-col md:flex-row shadow-2xl"
                        >
                            {/* LEFT: Media */}
                            <div className="bg-black w-full md:w-[60%] aspect-square md:aspect-auto relative flex items-center justify-center">
                                {selectedPost.type === "image" ? (
                                    <Image src={selectedPost.src} alt="Post" fill className="object-contain" />
                                ) : (
                                    <video src={selectedPost.src} controls autoPlay className="w-full h-full object-contain" />
                                )}
                            </div>

                            {/* RIGHT: Comments & Info */}
                            <div className="w-full md:w-[40%] bg-white flex flex-col h-full md:h-auto min-h-[400px]">

                                {/* Header */}
                                <div className="p-4 border-b border-[#3B241A]/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full relative overflow-hidden border border-[#3B241A]/10">
                                            <Image src="/isha_a.png" alt="Isha" fill className="object-cover" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold text-[#262626] mr-1 hover:opacity-50 cursor-pointer">isha_designs</span>
                                            <span className="font-semibold text-[#0095f6] hover:text-[#00376b] cursor-pointer">Follow</span>
                                        </div>
                                    </div>
                                    <MoreHorizontal size={20} className="cursor-pointer" />
                                </div>

                                {/* Comments Area */}
                                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-4">
                                    {/* Caption */}
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full relative overflow-hidden shrink-0">
                                            <Image src="/isha_a.png" alt="Isha" fill className="object-cover" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold text-[#262626] mr-2">isha_designs</span>
                                            <span className="text-[#262626]">
                                                Doing what I love most! ✨ <span className="text-[#00376b]">#design</span> <span className="text-[#00376b]">#creative</span>
                                            </span>
                                            <div className="text-xs text-gray-500 mt-2">2h</div>
                                        </div>
                                    </div>

                                    {/* Dummy Comments */}
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                                            <div className="text-sm">
                                                <span className="font-semibold text-[#262626] mr-2">user_{i}</span>
                                                <span className="text-[#262626]">This is absolutely stunning! 😍</span>
                                                <div className="flex gap-3 text-xs text-gray-500 mt-1 font-semibold">
                                                    <span>1h</span>
                                                    <span>12 likes</span>
                                                    <span>Reply</span>
                                                </div>
                                            </div>
                                            <Heart size={12} className="ml-auto mt-1 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                        </div>
                                    ))}
                                </div>

                                {/* Interaction Footer */}
                                <div className="border-t border-[#3B241A]/10 p-4">
                                    <div className="flex justify-between mb-3">
                                        <div className="flex gap-4">
                                            <Heart size={24} strokeWidth={1.5} className="hover:text-gray-500 cursor-pointer transition-colors" />
                                            <MessageCircle size={24} strokeWidth={1.5} className="hover:text-gray-500 cursor-pointer transition-colors" />
                                            <Send size={24} strokeWidth={1.5} className="hover:text-gray-500 cursor-pointer transition-colors" />
                                        </div>
                                        <Bookmark size={24} strokeWidth={1.5} className="hover:text-gray-500 cursor-pointer transition-colors" />
                                    </div>
                                    <div className="font-semibold text-sm mb-1">{selectedPost.likes.toLocaleString()} likes</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-4">2 HOURS AGO</div>

                                    <div className="flex items-center gap-3 pt-3 border-t border-[#3B241A]/10">
                                        <Smile size={24} strokeWidth={1.5} className="text-[#262626]" />
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            className="flex-1 outline-none text-sm bg-transparent placeholder-gray-500"
                                        />
                                        <button className="text-[#0095f6] font-semibold text-sm disabled:opacity-50">Post</button>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}