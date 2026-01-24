"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Video,
    Camera,
    Palette,
    Type,
    ArrowRight,
    Layers,
    X,
    Zap,
} from "lucide-react";

type IconName = 'Type' | 'Palette' | 'Video' | 'Camera' | 'Layers';
type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  tags: string[];
};

const iconMap: Record<IconName, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Type,
  Palette,
  Video,
  Camera,
  Layers,
};

// Service Data (defaults)
const defaultServices: ServiceItem[] = [
    {
        id: "01",
        title: "Content Writing",
        description: "From SEO-optimized blogs to compelling copy that converts. I craft narratives that resonate with your audience.",
        icon: 'Type',
        tags: ["Blog Posts", "SEO", "Copywriting"]
    },
    {
        id: "02",
        title: "Video Editing",
        description: "Turning raw footage into cinematic stories. Specialized in fast-paced social edits and long-form storytelling.",
        icon: 'Video',
        tags: ["Reels/Shorts", "YouTube", "Color Grading"]
    },
    {
        id: "03",
        title: "Photography",
        description: "Capturing moments with a unique perspective. Professional shooting for products, portraits, and events.",
        icon: 'Camera',
        tags: ["Portrait", "Product", "Event"]
    },
    {
        id: "04",
        title: "Branding",
        description: "More than just a logo. I build cohesive brand identities that resonate with your target audience.",
        icon: 'Palette',
        tags: ["Logo Design", "Strategy", "Tone of Voice"]
    },
    {
        id: "05",
        title: "Digital Strategy",
        description: "Strategic planning for your digital presence. From market analysis to execution roadmaps.",
        icon: 'Layers',
        tags: ["Planning", "Analytics", "Growth"]
    }
];

// Animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            ease: [0.4, 0, 0.2, 1] as const
        }
    }
};

export default function ServicesSection({ servicesData }: { servicesData?: ServiceItem[] }) {
    const data = Array.isArray(servicesData) && servicesData.length ? servicesData : defaultServices;
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

    // Helper to determine where the "View" button goes
    const getPortfolioLink = (id: string) => {
        if (id === "01") return "/blogs"; // Content Writing -> Blogs
        return "/wall";                   // Others -> Visual Wall
    };

    return (
        <section className="py-12 bg-[#FAF0E6] relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F2A7A7]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#DC7C7C]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#3B241A] mb-6">
                        Crafting digital experiences <br />
                        with <span className="text-[#DC7C7C] italic">purpose.</span>
                    </h2>
                    <p className="text-[#6E5045] text-lg leading-relaxed">
                        A multi-disciplinary approach to digital creation. Click on a service to explore options.
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
                    {data.map((service) => (
                        <motion.div
                            key={service.id}
                            layoutId={`card-${service.id}`}
                            onClick={() => setSelectedService(service)}
                            variants={cardVariants}
                            className="group relative h-full flex flex-col justify-between
                            bg-white/40 backdrop-blur-sm border border-[#F2A7A7]/20
                            rounded-3xl p-8 cursor-pointer
                            hover:shadow-xl hover:shadow-[#F2A7A7]/10 hover:-translate-y-2
                            transition-all duration-500"
                        >
                            <div>
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center text-[#DC7C7C] shadow-sm group-hover:bg-[#DC7C7C] group-hover:text-white transition-all duration-500">
                                        {(() => {
                                          const Icon = iconMap[service.icon] || Type;
                                          return <Icon size={26} strokeWidth={1.5} />;
                                        })()}
                                    </div>
                                    <span className="text-xs font-bold text-[#3B241A]/40 uppercase tracking-wider">
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

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2 max-w-[80%]">
                                    {service.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] font-semibold uppercase tracking-wider text-[#3B241A]/60 bg-white/50 px-2.5 py-1 rounded-full border border-transparent group-hover:border-[#F2A7A7]/30 transition-all">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#DC7C7C]">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* CTA Card - Direct Link to Build */}
                    <Link href="/build?category=custom">
                        <motion.div
                            variants={cardVariants}
                            className="group relative bg-[#3B241A] rounded-3xl p-8 flex flex-col justify-center items-center text-center overflow-hidden h-full cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                        >
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
                                <div className="px-8 py-3 rounded-full bg-[#FAF0E6] text-[#3B241A] font-semibold group-hover:bg-[#DC7C7C] group-hover:text-white transition-all duration-300 shadow-lg">
                                    Let&#39;s Talk
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>
            </div>


            {/* --- INTERACTIVE MODAL / BOTTOM SHEET --- */}
            <AnimatePresence>
                {selectedService && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="fixed inset-0 bg-[#1A0F08]/60 backdrop-blur-sm z-40"
                        />

                        {/* The Popup */}
                        <motion.div
                            layoutId={`card-${selectedService.id}`}
                            className="fixed z-50 bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2
                            w-full md:w-[600px] bg-[#FAF0E6] md:rounded-3xl rounded-t-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2A7A7]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            {/* Header */}
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#3B241A] text-[#FAF0E6] flex items-center justify-center">
                                        {(() => {
                                          const Icon = iconMap[selectedService.icon] || Type;
                                          return <Icon size={24} />;
                                        })()}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#3B241A]">{selectedService.title}</h3>
                                        <p className="text-[#6E5045] text-xs uppercase tracking-widest">Select an option</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="p-2 bg-[#3B241A]/5 hover:bg-[#3B241A]/10 rounded-full text-[#3B241A] transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Two Path Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">

                                {/* Path 1: DYNAMIC LINK (Blogs or Wall) */}
                                <Link href={getPortfolioLink(selectedService.id)} className="group">
                                    <div className="h-full bg-white border border-[#3B241A]/10 rounded-2xl p-6 hover:border-[#DC7C7C] hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-4">
                                        {(() => {
                                          const Icon = iconMap[selectedService.icon] || Type;
                                          return <Icon size={24} />;
                                        })()}
                                        <div>
                                            <h4 className="font-bold text-[#3B241A] text-lg">
                                                {selectedService.id === "01" ? "Read Blogs" : "View Portfolio"}
                                            </h4>
                                            <p className="text-sm text-[#6E5045] mt-1">
                                                {selectedService.id === "01"
                                                    ? "Explore articles & copy."
                                                    : `See ${selectedService.title.toLowerCase()} work.`}
                                            </p>
                                        </div>
                                        <div className="text-[#DC7C7C] text-sm font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                            Explore <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>

                                {/* Path 2: Start Project */}
                                <Link href="/build" className="group">
                                    <div className="h-full bg-[#3B241A] text-[#FAF0E6] rounded-2xl p-6 hover:bg-[#2A1A12] hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F2A7A7]/10 rounded-full blur-xl" />

                                        <div className="w-10 h-10 rounded-full bg-[#FAF0E6]/10 flex items-center justify-center text-[#F2A7A7] group-hover:bg-[#F2A7A7] group-hover:text-[#3B241A] transition-colors relative z-10">
                                            <Zap size={20} fill="currentColor" />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="font-bold !text-[#FAF0E6] text-lg">Start Project</h4>
                                            <p className="text-sm text-[#FAF0E6]/60 mt-1">I need this service. Let&#39;s create a proposal.</p>
                                        </div>
                                        <div className="text-[#F2A7A7] text-sm font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform relative z-10">
                                            Let&#39;s Build <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>

                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </section>
    );
}

