"use client";

import Image from "next/image";
import {motion} from "framer-motion";
import {ArrowUpRight, Feather, PenTool, Camera, Monitor, Video} from "lucide-react";

const roles = [
    {label: "Content Creator", icon: Video},
    {label: "Designer", icon: PenTool},
    {label: "UI / UX", icon: Monitor},
    {label: "Photographer", icon: Camera},
];

const container = {
    hidden: {opacity: 0},
    show: {
        opacity: 1,
        transition: {staggerChildren: 0.1, delayChildren: 0.2},
    },
};

const item = {
    hidden: {opacity: 0, y: 15},
    show: {opacity: 1, y: 0, transition: {duration: 0.4}},
};

export default function AboutBentoGrid() {
    return (
        // Equal padding top and bottom - visually balanced
        <section className="pt-16 pb-16 md:pt-24 md:pb-24 bg-[#F2E4D8] px-4">
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{once: true}}
                className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-5"
            >

                {/* 1. TITLE CARD (Top Left) */}
                <motion.div
                    variants={item}
                    className="md:col-span-4 bg-[#FAFAFA] rounded-3xl p-8 flex flex-col justify-between border border-white/50 shadow-sm relative overflow-hidden group"
                >
                    <div
                        className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <Feather size={120} color="#F2A7A7" className="-rotate-12"/>
                    </div>

                    <div>
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2E4D8] text-[#6E5045] text-xs font-bold uppercase tracking-widest mb-5">
                            About Me
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#3B241A] leading-tight md:leading-snug">
                            &#34;Merging creative vision with <span
                            className="text-[#F2A7A7] italic">strategic design</span> to tell compelling visual
                            stories.&#34;
                        </h2>
                    </div>

                    <div
                        className="mt-8 flex items-center gap-2 text-[#6E5045] font-medium text-sm hover:text-[#3B241A] transition-colors cursor-pointer w-fit">
                        <span>Read my story</span>
                        <ArrowUpRight className="w-4 h-4"/>
                    </div>
                </motion.div>


                {/* 2. IMAGE CARD (Right - Tall) */}
                <motion.div
                    variants={item}
                    className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden min-h-[320px] md:min-h-full border-[3px] border-white shadow-xl"
                >
                    <Image
                        src="/isha_a.png"
                        alt="Isha Rani"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                        priority
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-[#3B241A]/60 via-transparent to-transparent pointer-events-none"/>

                    <div className="absolute bottom-6 left-6 text-white drop-shadow-md">
                        <p className="font-serif font-bold text-lg">Isha Rani</p>
                        <p className="text-xs uppercase tracking-wide opacity-90">UX & Content</p>
                    </div>
                </motion.div>


                {/* 3. ROLES / EXPERTISE CARD (Bottom Left) */}
                <motion.div
                    variants={item}
                    className="md:col-span-2 bg-[#3B241A] rounded-3xl p-8 !text-white shadow-lg relative overflow-hidden flex flex-col"
                >
                    <div
                        className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#E8A0A0] opacity-10 rounded-full blur-2xl z-0"/>

                    <h3 className="text-sm font-bold uppercase tracking-widest !text-white border-b border-white/20 pb-3 mb-4 relative z-10">
                        My Discipline
                    </h3>

                    <p className="text-sm leading-relaxed mb-6 relative z-10 !text-white/80">
                        I bridge the gap between visual storytelling and functional design, crafting
                        cohesive digital experiences across four key areas:
                    </p>

                    <div className="grid grid-cols-2 gap-3 relative z-10 mt-auto">
                        {roles.map((role, i) => (
                            <div
                                key={i}
                                className="group flex flex-col gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 border border-white/10"
                            >
                                <role.icon
                                    className="w-5 h-5 text-[#F2A7A7] group-hover:scale-110 transition-transform duration-300"/>
                                <span className="text-[13px] font-medium leading-tight !text-white">
                                  {role.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>


                {/* 4. DETAILS CARD (Bottom Middle) */}
                <motion.div
                    variants={item}
                    className="md:col-span-2 bg-[#E8A0A0]/20 rounded-3xl p-8 border border-[#F2A7A7]/30 flex flex-col justify-between h-full"
                >
                    <p className="text-[#6E5045] text-[15px] leading-relaxed font-medium">
                        I transform complex concepts into clean, engaging narratives. Whether capturing a moment through
                        a lens or designing an interface, my goal is always the same: to create work that resonates.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {["Clarity", "Consistency", "Usability"].map((tag) => (
                            <span key={tag}
                                  className="px-3 py-1.5 bg-white/60 rounded-lg text-xs text-[#3B241A] font-bold uppercase tracking-wide shadow-sm">
                                 {tag}
                             </span>
                        ))}
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
}