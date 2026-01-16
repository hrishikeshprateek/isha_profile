"use client";

import { motion } from "framer-motion";
import {
    Video,
    Camera,
    Palette,
    Type,
    ArrowRight,
    Layers
} from "lucide-react";

const services = [
    {
        id: "01",
        title: "Content Writing",
        description: "Compelling narratives that define your voice. From blog posts to social captions, I write copy that converts.",
        icon: Type,
        tags: ["Copywriting", "Blogs", "Scriptwriting"]
    },
    {
        id: "02",
        title: "Graphic & UI/UX",
        description: "Visuals that stick. I design intuitive interfaces and stunning graphics that merge aesthetics with functionality.",
        icon: Palette,
        tags: ["Web Design", "App UI", "Social Graphics"]
    },
    {
        id: "03",
        title: "Video Editing",
        description: "Turning raw footage into cinematic stories. specialized in fast-paced social edits and long-form storytelling.",
        icon: Video,
        tags: ["Reels/Shorts", "YouTube", "Color Grading"]
    },
    {
        id: "04",
        title: "Photography",
        description: "Capturing moments with a unique perspective. Professional shooting for products, portraits, and events.",
        icon: Camera,
        tags: ["Portrait", "Product", "Event"]
    },
    {
        id: "05",
        title: "Branding",
        description: "More than just a logo. I build cohesive brand identities that resonate with your target audience.",
        icon: Layers,
        tags: ["Logo Design", "Strategy", "Tone of Voice"]
    }
];

// Animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

// --- FIX IS HERE ---
const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            // We use 'as const' here to tell TypeScript this is exactly [n, n, n, n]
            // and not just a generic number array.
            ease: [0.4, 0, 0.2, 1] as const
        }
    }
};

export default function ServicesSection() {
    return (
        <section className="py-12 bg-[#FAF0E6] relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F2A7A7]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#DC7C7C]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#3B241A] mb-6">
                        Crafting digital experiences <br />
                        with <span className="text-[#DC7C7C] italic">purpose.</span>
                    </h2>
                    <p className="text-[#6E5045] text-lg leading-relaxed">
                        A multi-disciplinary approach to digital creation. I combine strategy with artistry to deliver complete creative solutions.
                    </p>
                </div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="group relative h-full flex flex-col justify-between
                            bg-white/40 backdrop-blur-sm border border-[#F2A7A7]/20
                            rounded-3xl p-8
                            hover:shadow-xl hover:shadow-[#F2A7A7]/10 hover:-translate-y-2
                            transition-all duration-500"
                        >
                            <div>
                                {/* Card Header: Icon & ID */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center text-[#DC7C7C] shadow-sm group-hover:bg-[#DC7C7C] group-hover:text-white transition-all duration-500">
                                        <service.icon size={26} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-4xl font-bold text-[#3B241A]/5 group-hover:text-[#F2A7A7]/20 transition-colors duration-500 select-none">
                                        {service.id}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-[#3B241A] mb-3 group-hover:text-[#DC7C7C] transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-[#6E5045] text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>

                            {/* Footer: Tags & Arrow */}
                            <div className="mt-auto">
                                <div className="w-full h-[1px] bg-[#3B241A]/5 mb-4 group-hover:bg-[#F2A7A7]/30 transition-colors" />

                                <div className="flex justify-between items-end">
                                    <div className="flex flex-wrap gap-2 max-w-[80%]">
                                        {service.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] font-semibold uppercase tracking-wider text-[#3B241A]/60 bg-white/50 px-2.5 py-1 rounded-full border border-transparent group-hover:border-[#F2A7A7]/30 transition-all"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className="transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#DC7C7C]">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* CTA Card (6th Slot) */}
                    <motion.div
                        variants={cardVariants}
                        className="group relative bg-[#3B241A] rounded-3xl p-8 flex flex-col justify-center items-center text-center overflow-hidden h-full"
                    >
                        {/* Decorative Background Circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC7C7C]/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F2A7A7]/20 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10 space-y-6">
                            <h3 className="text-3xl font-bold text-[#FAF0E6] leading-tight">
                                Have a specific <br />
                                <span className="text-[#DC7C7C]">idea?</span>
                            </h3>
                            <p className="text-[#FAF0E6]/70 text-sm max-w-[200px] mx-auto">
                                I create custom packages tailored to your unique needs.
                            </p>

                            <button className="px-8 py-3 rounded-full bg-[#FAF0E6] text-[#3B241A] font-semibold hover:bg-[#DC7C7C] hover:text-white transition-all duration-300 shadow-lg active:scale-95">
                                Let&#39;s Talk
                            </button>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};