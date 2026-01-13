"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";
import {
    PenTool,
    Video,
    Type,
    Camera
} from "lucide-react";

// --- CONFIGURATION ---
// TOOL_RADIUS: Keep tools scattered far from their category
const TOOL_RADIUS = 165;

// --- TYPE DEFINITIONS ---
interface Tool {
    id: string;
    name: string;
    iconUrl: string;
    color: string;
}

interface Category {
    id: string;
    label: string;
    icon: React.ComponentType<{ size: number; className: string }>;
    angle: number;
    radius: number;
    color: string;
    tools: Tool[];
}

interface CoreNode {
    x: MotionValue<number>;
    y: MotionValue<number>;
}

interface BranchGroupProps {
    core: CoreNode;
    data: Category;
    initX: number;
    initY: number;
}

interface ToolNodeProps {
    parent: CoreNode;
    data: Tool;
    initX: number;
    initY: number;
    lineColor: string;
}

// Helper to get brand icons from Simple Icons CDN
const getIcon = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

const networkData = [
    {
        id: "design",
        label: "Design",
        icon: PenTool,
        angle: 315, // Top Left
        radius: 240, // Medium distance
        color: "#F2A7A7",
        tools: [
            { id: "ps", name: "Photoshop", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Adobe_Photoshop_CC_2026_icon.svg/250px-Adobe_Photoshop_CC_2026_icon.svg.png", color: "bg-[#ffffff]" },
            { id: "ai", name: "Illustrator", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Adobe_Illustrator_CC_icon.svg/250px-Adobe_Illustrator_CC_icon.svg.png", color: "bg-[#330000]" },
            { id: "fi", name: "Figma", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/500px-Figma-logo.svg.png", color: "bg-[#1E1E1E]" },
            { id: "ca", name: "Canva", iconUrl: "https://upload.wikimedia.org/wikipedia/en/b/bb/Canva_Logo.svg", color: "bg-gradient-to-br from-[#00C4CC] to-[#7D2AE8]" },
        ]
    },
    {
        id: "video",
        label: "Video",
        icon: Video,
        angle: 45, // Top Right
        radius: 340, // FAR distance (More)
        color: "#9999FF",
        tools: [
            { id: "pr", name: "Premiere", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Adobe_Premiere_Pro_CC_2026_icon.svg/250px-Adobe_Premiere_Pro_CC_2026_icon.svg.png", color: "bg-[#ffffff]" },
            { id: "ae", name: "After Effects", iconUrl: "https://static.wikia.nocookie.net/logopedia/images/8/83/After_Effects_2025.svg", color: "bg-[#ffffff]" },
            { id: "da", name: "DaVinci", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/DaVinci_Resolve_Studio.png/250px-DaVinci_Resolve_Studio.png", color: "bg-[#3B241A]" },
            { id: "cc", name: "CapCut", iconUrl: "https://upload.wikimedia.org/wikipedia/en/a/a0/Capcut-logo.svg", color: "bg-black" },
        ]
    },
    {
        id: "content",
        label: "Content",
        icon: Type,
        angle: 135, // Bottom Right
        radius: 290, // Medium-Far
        color: "#15C39A",
        tools: [
            { id: "no", name: "Notion", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/120px-Notion-logo.svg.png", color: "bg-white border-2 border-gray-200" },
            { id: "wp", name: "WordPress", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/960px-WordPress_blue_logo.svg.png?20170312030453", color: "bg-[#21759B]" },
            { id: "ch", name: "ChatGPT", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/OpenAI_logo_2025_%28symbol%29.svg/960px-OpenAI_logo_2025_%28symbol%29.svg.png", color: "bg-[#74AA9C]" },
        ]
    },
    {
        id: "photo",
        label: "Photo",
        icon: Camera,
        angle: 225, // Bottom Left
        radius: 190, // CLOSE distance (Less)
        color: "#2FA3F7",
        tools: [
            { id: "lr", name: "Lightroom", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg/500px-Adobe_Photoshop_Lightroom_CC_logo.svg.png", color: "bg-[#001E36]" },
            { id: "sn", name: "Snapseed", iconUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/db/Snapseed_Logo.svg/1280px-Snapseed_Logo.svg.png", color: "bg-white border-2 border-green-500" },
        ]
    }
];

// --- SHARED COMPONENTS ---

const Connector = ({
                       fromX, fromY,
                       toX, toY,
                       color = "#F2A7A7",
                       dash = false
                   }: {
    fromX: MotionValue<number>, fromY: MotionValue<number>,
    toX: MotionValue<number>, toY: MotionValue<number>,
    color?: string, dash?: boolean
}) => {
    const path = useTransform(
        [fromX, fromY, toX, toY],
        ([fx, fy, tx, ty]) => `M ${fx} ${fy} L ${tx} ${ty}`
    );

    return (
        <motion.path
            d={path}
            stroke={color}
            strokeWidth={dash ? 2 : 6}
            strokeDasharray={dash ? "6 6" : "none"}
            strokeLinecap="round"
            fill="none"
        />
    );
};

const DraggableNode = ({
                           x, y,
                           children,
                           className
                       }: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            drag
            dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
            dragElastic={0.2}
            dragMomentum={true}
            style={{ x, y }}
            className={`absolute top-0 left-0 -ml-10 -mt-10 cursor-grab active:cursor-grabbing touch-none ${className}`}
            whileHover={{ scale: 1.1, zIndex: 100 }}
            whileTap={{ scale: 0.95, cursor: "grabbing" }}
        >
            {children}
        </motion.div>
    );
};

export default function InteractiveGraph() {
    const containerRef = useRef(null);
    const centerX = 500;
    const centerY = 450;

    // Center "Isha" Node Physics
    const coreX = useSpring(centerX, { stiffness: 150, damping: 20 });
    const coreY = useSpring(centerY, { stiffness: 150, damping: 20 });

    return (
        <section className="bg-[#FAF0E6] py-10 md:py-24 relative overflow-hidden select-none">

            {/* Header */}
            <div className="text-center mb-4 md:mb-12 relative z-10 px-6 pointer-events-none">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#3B241A]">
                    My Creative <span className="text-[#F2A7A7] italic">Universe</span>
                </h2>
                <p className="text-[#6E5045]/60 text-sm mt-2 max-w-xs mx-auto md:max-w-none">
                    Drag the icons to explore the connections.
                </p>
            </div>

            {/* GRAPH CONTAINER */}
            <div ref={containerRef} className="w-full h-[600px] md:h-[900px] overflow-hidden relative cursor-crosshair touch-none flex items-center justify-center">

                {/* Scalable Canvas */}
                <div className="relative w-[1000px] h-[900px] origin-center transform scale-[0.55] md:scale-100 transition-transform duration-500 -translate-x-38 md:translate-x-0">

                    {/* CORE NODE (ISHA) */}
                    <DraggableNode x={coreX} y={coreY} className="z-50">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#3B241A] border-[6px] border-[#F2A7A7] shadow-2xl flex flex-col items-center justify-center relative group hover:border-white transition-colors duration-300">
                            <span className="text-4xl font-serif font-bold text-[#FAF0E6]">ISHA</span>
                            <span className="text-[10px] uppercase tracking-widest text-[#F2A7A7] mt-1">Core</span>
                            <div className="absolute -inset-4 border border-[#3B241A]/20 rounded-full pointer-events-none" />
                        </div>
                    </DraggableNode>

                    {/* BRANCHES */}
                    {networkData.map((cat) => {
                        const rad = (cat.angle * Math.PI) / 180;
                        // USING VARIABLE RADIUS FROM DATA (cat.radius)
                        const initX = centerX + Math.cos(rad) * cat.radius;
                        const initY = centerY + Math.sin(rad) * cat.radius;

                        return (
                            <BranchGroup
                                key={cat.id}
                                core={{ x: coreX, y: coreY }}
                                data={cat}
                                initX={initX}
                                initY={initY}
                            />
                        )
                    })}

                </div>
            </div>

            {/* Mobile Hint */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-[#3B241A]/20 text-xs font-bold uppercase tracking-widest pointer-events-none animate-pulse md:hidden">
                Tap & Drag
            </div>
        </section>
    );
}

// --- SUB-COMPONENT: BRANCH LOGIC ---
function BranchGroup({ core, data, initX, initY }: BranchGroupProps) {
    const catX = useSpring(initX, { stiffness: 120, damping: 20 });
    const catY = useSpring(initY, { stiffness: 120, damping: 20 });

    return (
        <>
            {/* A. Connector: CORE -> CATEGORY */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0">
                <Connector fromX={core.x} fromY={core.y} toX={catX} toY={catY} color="#3B241A" dash />
            </svg>

            {/* B. The Category Node */}
            <DraggableNode x={catX} y={catY} className="z-40">
                <div className="bg-[#FAF0E6] border-2 border-[#3B241A] px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-max">
                    <data.icon size={20} className="text-[#F2A7A7]" />
                    <span className="font-bold text-[#3B241A] uppercase tracking-wider text-sm select-none">
                        {data.label}
                    </span>
                </div>
            </DraggableNode>

            {/* C. The Tools (Real Logos) */}
            {data.tools.map((tool: Tool, index: number) => {
                // SPREAD LOGIC:
                // Large spread (150 degrees) to keep them scattered
                const toolsCount = data.tools.length;
                const spread = 150;
                const step = spread / (toolsCount > 1 ? toolsCount - 1 : 1);
                const startAngle = data.angle - (spread / 2);

                const finalAngle = startAngle + (index * step);

                const rad = (finalAngle * Math.PI) / 180;

                // Using TOOL_RADIUS (165)
                const toolInitX = initX + Math.cos(rad) * TOOL_RADIUS;
                const toolInitY = initY + Math.sin(rad) * TOOL_RADIUS;

                return (
                    <ToolNode
                        key={tool.id}
                        parent={{ x: catX, y: catY }}
                        data={tool}
                        initX={toolInitX}
                        initY={toolInitY}
                        lineColor={data.color}
                    />
                )
            })}
        </>
    )
}

function ToolNode({ parent, data, initX, initY, lineColor }: ToolNodeProps) {
    const toolX = useSpring(initX, { stiffness: 150, damping: 15 });
    const toolY = useSpring(initY, { stiffness: 150, damping: 15 });

    return (
        <>
            {/* Connector: CATEGORY -> TOOL */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-10">
                <Connector fromX={parent.x} fromY={parent.y} toX={toolX} toY={toolY} color={lineColor} />
            </svg>

            {/* The Tool Node (Actual Logo) */}
            <DraggableNode x={toolX} y={toolY} className="z-30">
                <div className={`w-20 h-20 rounded-[1.2rem] shadow-lg flex flex-col items-center justify-center relative transition-all border-2 border-white/20 hover:shadow-2xl hover:shadow-[#3B241A]/20 overflow-hidden ${data.color}`}>

                    {/* The Logo Image */}
                    <div className="p-2 w-full h-full flex items-center justify-center">
                        <Image
                            src={data.iconUrl}
                            alt={data.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain pointer-events-none select-none"
                            style={{ filter: data.color.includes('bg-white') || data.color.includes('#ffffff') ? '' : 'invert(1) brightness(2)' }}
                        />
                    </div>

                    {/* Tool Name Tag */}
                    <div className="absolute bottom-0 w-full text-center pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[8px] uppercase font-bold text-white/90 drop-shadow-md">
                            {data.name}
                        </span>
                    </div>
                </div>
            </DraggableNode>
        </>
    )
}