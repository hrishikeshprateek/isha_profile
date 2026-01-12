"use client";

import { motion } from "framer-motion";
import {
    Video,
    Camera,
    Palette,
    Type,
    ArrowUpRight,
    Layers
} from "lucide-react";

const services = [
    {
        id: "01",
        title: "Content Writing",
        description: "Compelling narratives that define your voice. From blog posts to social captions, I write copy that converts.",
        icon: Type,
        tags: ["Copywriting", "Blogs", "Scriptwriting", "Social Captions"]
    },
    {
        id: "02",
        title: "Graphic & UI/UX",
        description: "Visuals that stick. I design intuitive interfaces and stunning graphics that merge aesthetics with functionality.",
        icon: Palette,
        tags: ["Web Design", "App UI", "Social Graphics", "Posters"]
    },
    {
        id: "03",
        title: "Video Editing",
        description: "Turning raw footage into cinematic stories. specialized in fast-paced social edits and long-form storytelling.",
        icon: Video,
        tags: ["Reels/Shorts", "YouTube", "Color Grading", "Motion Graphics"]
    },
    {
        id: "04",
        title: "Photography",
        description: "Capturing moments with a unique perspective. Professional shooting for products, portraits, and events.",
        icon: Camera,
        tags: ["Portrait", "Product", "Event", "Street"]
    },
    {
        id: "05",
        title: "Branding",
        description: "More than just a logo. I build cohesive brand identities that resonate with your target audience.",
        icon: Layers,
        tags: ["Logo Design", "Brand Strategy", "Guidelines", "Tone of Voice"]
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

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
        }
    }
};

export default function ServicesSection() {
    return (
        <section className="py-16 bg-[#FAF0E6] relative overflow-hidden">

            {/* Background Texture/Gradient */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F2A7A7]/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3B241A]/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3B241A] mb-6 leading-tight">
                        Crafting digital experiences <br />
                        with <span className="text-[#F2A7A7] italic">purpose.</span>
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
                            className="group relative bg-[#FAFAFA] rounded-[2rem] p-8 border border-[#3B241A]/5 hover:border-[#F2A7A7]/40 transition-all duration-500 hover:shadow-xl hover:shadow-[#F2A7A7]/10 flex flex-col h-full"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-[#F2E4D8]/50 rounded-2xl group-hover:bg-[#F2A7A7]/20 transition-colors duration-500 text-[#3B241A]">
                                    <service.icon size={32} strokeWidth={1.5} />
                                </div>
                                <span className="text-4xl font-serif font-bold text-[#F2E4D8] group-hover:text-[#F2A7A7]/40 transition-colors duration-500 select-none">
                                    {service.id}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-serif font-bold text-[#3B241A] mb-3 group-hover:text-[#DC7C7C] transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-[#6E5045] leading-relaxed">
                                    {service.description}
                                </p>
                            </div>

                            {/* Tags / Divider - Pushed to bottom */}
                            <div className="mt-auto">
                                <div className="w-full h-[1px] bg-[#3B241A]/10 mb-4 group-hover:bg-[#F2A7A7]/40 transition-colors" />
                                <div className="flex flex-wrap gap-2">
                                    {service.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-[11px] font-bold uppercase tracking-wider text-[#6E5045]/70 bg-[#3B241A]/5 px-2 py-1 rounded-md group-hover:bg-[#F2A7A7]/10 group-hover:text-[#3B241A] transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hover Action Arrow */}
                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ArrowUpRight className="text-[#F2A7A7]" />
                            </div>

                        </motion.div>
                    ))}

                    {/* CTA Card (The 6th slot to balance the grid) */}
                    <motion.div
                        variants={cardVariants}
                        className="group relative bg-[#3B241A] rounded-[2rem] p-8 flex flex-col justify-center items-center text-center overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-full h-full bg-[#F2A7A7] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />

                        <div className="relative z-10">
                            <h3 className="text-3xl font-serif font-bold text-[#F2E4D8] mb-4">
                                Have a specific idea?
                            </h3>
                            <p className="text-white/70 mb-8 max-w-xs mx-auto">
                                I create custom packages tailored to your unique needs.
                            </p>
                            <button className="px-8 py-3 bg-[#F2A7A7] text-[#3B241A] font-bold rounded-full hover:bg-[#FAF0E6] transition-colors duration-300">
                                Let&#39;s Talk
                            </button>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};