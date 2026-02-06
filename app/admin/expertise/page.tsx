"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Trash2,
    Save,
    Loader2,
    X,
    Maximize2,
    ZoomIn,
    ZoomOut,
    MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Tool {
    id: string;
    name: string;
    iconUrl: string;
    color: string;
}

interface Category {
    id: string;
    label: string;
    iconType: string;
    angle: number;
    radius: number;
    color: string;
    tools: Tool[];
}

interface ExpertiseData {
    title: string;
    subtitle: string;
    categories: Category[];
}

export default function AdminGraphEditor() {
    // --- State ---
    const [data, setData] = useState<ExpertiseData>({
        title: 'My Creative Universe',
        subtitle: 'Drag the icons to explore the connections.',
        categories: []
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState<string | null>(null);

    // Canvas Refs for Drag Logic
    const svgRef = useRef<SVGSVGElement>(null);
    const CENTER_X = 500;
    const CENTER_Y = 400;

    // --- Initialization ---
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const res = await fetch('/api/admin/expertise', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
            });
            const result = await res.json();
            if (result.success) setData(result.data);
        } catch (error) {
            console.error('Failed to load:', error);
        } finally {
            setLoading(false);
        }
    }

    // --- API Actions ---
    async function saveData() {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/expertise', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) alert('Universe updated successfully! 🌌');
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    // --- Graph Math & Drag Logic ---

    // Convert Polar (Angle/Radius) to Cartesian (X/Y) for rendering
    const getPos = (angle: number, radius: number) => {
        const rad = (angle * Math.PI) / 180;
        return {
            x: CENTER_X + radius * Math.cos(rad),
            y: CENTER_Y + radius * Math.sin(rad)
        };
    };

    // Convert Cartesian (Mouse X/Y) to Polar (Angle/Radius) for updating data
    const handleSvgMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !svgRef.current) return;

        // Prevent default to stop scrolling on touch
        // e.preventDefault();

        const pt = svgRef.current.createSVGPoint();

        // Handle both mouse and touch events
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        pt.x = clientX;
        pt.y = clientY;

        const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());

        const dx = svgP.x - CENTER_X;
        const dy = svgP.y - CENTER_Y;

        // Calculate Angle (Degrees)
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        // Calculate Radius
        const radius = Math.sqrt(dx * dx + dy * dy);

        // Update State
        setData(prev => ({
            ...prev,
            categories: prev.categories.map(c =>
                c.id === isDragging ? { ...c, angle: Math.round(angle), radius: Math.round(radius) } : c
            )
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    // --- CRUD Operations ---
    function addCategory() {
        const newCat: Category = {
            id: `cat-${Date.now()}`,
            label: 'New Node',
            iconType: 'code',
            angle: Math.random() * 360,
            radius: 200,
            color: '#F2A7A7',
            tools: []
        };
        setData({ ...data, categories: [...data.categories, newCat] });
        setSelectedNodeId(newCat.id);
    }

    function updateSelectedCategory<K extends keyof Category>(field: K, value: Category[K]) {
        if (!selectedNodeId) return;
        setData(prev => ({
            ...prev,
            categories: prev.categories.map(c =>
                c.id === selectedNodeId ? ({ ...c, [field]: value } as Category) : c
            )
        }));
    }

    function addToolToSelected() {
        if (!selectedNodeId) return;
        const newTool: Tool = { id: `t-${Date.now()}`, name: 'New Tool', iconUrl: '', color: 'bg-white' };
        const newCats = data.categories.map(c =>
            c.id === selectedNodeId ? { ...c, tools: [...c.tools, newTool] } : c
        );
        setData({ ...data, categories: newCats });
    }

    function updateTool(toolId: string, field: keyof Tool, value: string) {
        if (!selectedNodeId) return;
        const newCats = data.categories.map(c =>
            c.id === selectedNodeId ? {
                ...c,
                tools: c.tools.map(t => t.id === toolId ? { ...t, [field]: value } : t)
            } : c
        );
        setData({ ...data, categories: newCats });
    }

    function removeTool(toolId: string) {
        if (!selectedNodeId) return;
        const newCats = data.categories.map(c =>
            c.id === selectedNodeId ? { ...c, tools: c.tools.filter(t => t.id !== toolId) } : c
        );
        setData({ ...data, categories: newCats });
    }

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#FAF0E6] text-[#3B241A]"><Loader2 className="animate-spin"/></div>;

    const selectedCategory = data.categories.find(c => c.id === selectedNodeId);

    return (
        <div
            className="h-screen w-full bg-[#FAF0E6] text-[#3B241A] font-sans overflow-hidden flex flex-col md:flex-row"
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
        >

            {/* --- LEFT: VISUAL GRAPH EDITOR (The "TigerGraph" Part) --- */}
            <div className="relative flex-1 bg-[#FAF0E6] overflow-hidden cursor-crosshair h-full order-2 md:order-1">

                {/* Graph Toolbar */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <div className="bg-white/80 backdrop-blur border border-[#3B241A]/10 p-2 rounded-xl shadow-sm">
                        <button onClick={() => setZoom(z => z + 0.1)} className="p-2 hover:bg-[#3B241A]/5 rounded-lg block"><ZoomIn size={18}/></button>
                        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-[#3B241A]/5 rounded-lg block"><ZoomOut size={18}/></button>
                        <button onClick={() => setZoom(1)} className="p-2 hover:bg-[#3B241A]/5 rounded-lg block text-[#A68B7E]"><Maximize2 size={18}/></button>
                    </div>
                    <div className="bg-[#3B241A] text-[#FAF0E6] p-3 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider text-center">
                        Drag Nodes
                    </div>
                </div>

                {/* SVG Canvas */}
                <svg
                    ref={svgRef}
                    viewBox={`0 0 1000 800`}
                    className="w-full h-full touch-none"
                    onMouseMove={handleSvgMouseMove}
                    onTouchMove={handleSvgMouseMove}
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    }}
                >
                    {/* Background Grid (Blueprint Style) */}
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B241A" strokeWidth="0.5" opacity="0.1"/>
                    </pattern>
                    <rect width="1000" height="800" fill="url(#grid)" />

                    {/* Orbit Rings (Visual Guides) */}
                    {[200, 350, 500].map(r => (
                        <circle
                            key={r}
                            cx={CENTER_X}
                            cy={CENTER_Y}
                            r={r}
                            fill="none"
                            stroke="#3B241A"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                            opacity="0.1"
                        />
                    ))}

                    {/* Connections (Edges) */}
                    {data.categories.map(cat => {
                        const pos = getPos(cat.angle, cat.radius);
                        return (
                            <line
                                key={`line-${cat.id}`}
                                x1={CENTER_X}
                                y1={CENTER_Y}
                                x2={pos.x}
                                y2={pos.y}
                                stroke={selectedNodeId === cat.id ? "#F2A7A7" : "#3B241A"}
                                strokeWidth={selectedNodeId === cat.id ? 2 : 1}
                                opacity={selectedNodeId === cat.id ? 1 : 0.2}
                            />
                        );
                    })}

                    {/* Center Node (Me) */}
                    <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
                        <circle r="40" fill="#3B241A" className="drop-shadow-xl"/>
                        <text x="0" y="5" textAnchor="middle" fill="#FAF0E6" fontSize="12" fontWeight="bold">ME</text>
                    </g>

                    {/* Category Nodes */}
                    {data.categories.map(cat => {
                        const pos = getPos(cat.angle, cat.radius);
                        const isSelected = selectedNodeId === cat.id;

                        return (
                            <g
                                key={cat.id}
                                transform={`translate(${pos.x}, ${pos.y})`}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setSelectedNodeId(cat.id);
                                    setIsDragging(cat.id);
                                }}
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    setSelectedNodeId(cat.id);
                                    setIsDragging(cat.id);
                                }}
                                className="cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                {/* Selection Halo */}
                                {isSelected && (
                                    <motion.circle
                                        initial={{ r: 30, opacity: 0.5 }}
                                        animate={{ r: 50, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        fill={cat.color}
                                    />
                                )}

                                {/* Node Body */}
                                <circle
                                    r={isSelected ? 35 : 25}
                                    fill={cat.color}
                                    stroke="#3B241A"
                                    strokeWidth="2"
                                    className="drop-shadow-md transition-all duration-300"
                                />

                                {/* Label */}
                                <text
                                    y={isSelected ? 55 : 45}
                                    textAnchor="middle"
                                    fill="#3B241A"
                                    fontSize="12"
                                    fontWeight="bold"
                                    className="pointer-events-none uppercase tracking-widest bg-white"
                                >
                                    {cat.label}
                                </text>

                                {/* Tool Dots (Satellites) */}
                                {cat.tools.map((_, i) => {
                                    const satelliteAngle = (i / cat.tools.length) * Math.PI * 2;
                                    const sx = Math.cos(satelliteAngle) * 45; // 45px orbit
                                    const sy = Math.sin(satelliteAngle) * 45;
                                    return (
                                        <circle key={i} cx={sx} cy={sy} r="4" fill="#3B241A" opacity="0.6"/>
                                    )
                                })}
                            </g>
                        );
                    })}
                </svg>

            </div>

            {/* --- RIGHT: INSPECTOR PANEL (Data Editor) --- */}
            <div className="w-full md:w-[400px] h-[40vh] md:h-full bg-white border-l border-[#3B241A]/10 shadow-2xl z-30 flex flex-col order-1 md:order-2">

                {/* Panel Header */}
                <div className="p-6 border-b border-[#3B241A]/5 flex justify-between items-center bg-[#FAF0E6]/30">
                    <div>
                        <h2 className="text-lg font-serif font-bold text-[#3B241A]">Data Inspector</h2>
                        <p className="text-[10px] text-[#A68B7E] uppercase tracking-widest font-bold">
                            {selectedCategory ? 'Editing Node' : 'Global Settings'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!selectedCategory && (
                            <button
                                onClick={addCategory}
                                className="p-2 bg-[#3B241A] text-[#FAF0E6] rounded-lg hover:bg-[#F2A7A7] hover:text-[#3B241A] transition-colors"
                                title="Add New Node"
                            >
                                <Plus size={18}/>
                            </button>
                        )}
                        <button
                            onClick={saveData}
                            disabled={saving}
                            className="p-2 bg-white border border-[#3B241A]/10 text-[#3B241A] rounded-lg hover:bg-[#FAF0E6]"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        {selectedCategory ? (
                            /* --- NODE EDITOR --- */
                            <motion.div
                                key="node-editor"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-[#3B241A] flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{background: selectedCategory.color}}/>
                                        {selectedCategory.label}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedNodeId(null)}
                                        className="text-xs text-[#A68B7E] hover:text-[#3B241A] flex items-center gap-1"
                                    >
                                        <X size={12}/> Close
                                    </button>
                                </div>

                                {/* Node Settings */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-[#A68B7E]">Label</label>
                                        <input
                                            value={selectedCategory.label}
                                            onChange={(e) => updateSelectedCategory('label', e.target.value)}
                                            className="w-full mt-1 p-2 bg-[#FAF0E6] rounded-lg border-none text-sm font-bold text-[#3B241A] focus:ring-1 focus:ring-[#F2A7A7]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-[#A68B7E]">Angle</label>
                                            <input
                                                type="number" value={selectedCategory.angle}
                                                onChange={(e) => updateSelectedCategory('angle', Number(e.target.value))}
                                                className="w-full mt-1 p-2 bg-[#FAF0E6] rounded-lg border-none text-sm font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-[#A68B7E]">Radius</label>
                                            <input
                                                type="number" value={selectedCategory.radius}
                                                onChange={(e) => updateSelectedCategory('radius', Number(e.target.value))}
                                                className="w-full mt-1 p-2 bg-[#FAF0E6] rounded-lg border-none text-sm font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-[#A68B7E]">Node Color</label>
                                        <div className="flex gap-2 mt-1">
                                            {['#F2A7A7', '#9999FF', '#15C39A', '#E69595', '#FFD700', '#A68B7E'].map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => updateSelectedCategory('color', c)}
                                                    className={`w-8 h-8 rounded-full border-2 ${selectedCategory.color === c ? 'border-[#3B241A]' : 'border-transparent'}`}
                                                    style={{backgroundColor: c}}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Tools List */}
                                <div className="border-t border-[#3B241A]/10 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#3B241A]">Tools / Skills</h4>
                                        <button onClick={addToolToSelected} className="text-xs bg-[#F2A7A7] text-white px-2 py-1 rounded font-bold">+ Add</button>
                                    </div>

                                    <div className="space-y-3">
                                        {selectedCategory.tools.map(tool => (
                                            <div key={tool.id} className="bg-[#FAF0E6]/50 p-3 rounded-lg border border-[#3B241A]/5 group">
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        value={tool.name}
                                                        onChange={(e) => updateTool(tool.id, 'name', e.target.value)}
                                                        className="flex-1 bg-white p-1.5 rounded text-xs font-bold text-[#3B241A]"
                                                        placeholder="Tool Name"
                                                    />
                                                    <button onClick={() => removeTool(tool.id)} className="text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
                                                </div>
                                                <input
                                                    value={tool.iconUrl}
                                                    onChange={(e) => updateTool(tool.id, 'iconUrl', e.target.value)}
                                                    className="w-full bg-white p-1.5 rounded text-[10px] text-[#A68B7E] font-mono"
                                                    placeholder="Icon URL..."
                                                />
                                            </div>
                                        ))}
                                        {selectedCategory.tools.length === 0 && (
                                            <p className="text-xs text-center text-[#A68B7E] italic">No tools added yet.</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            if(confirm('Delete entire category node?')) {
                                                setData(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== selectedNodeId)}));
                                                setSelectedNodeId(null);
                                            }
                                        }}
                                        className="w-full mt-8 p-3 text-red-500 bg-red-50 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
                                    >
                                        Delete Node
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            /* --- GLOBAL SETTINGS --- */
                            <motion.div
                                key="global-settings"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6 text-center pt-10"
                            >
                                <div className="w-24 h-24 bg-[#3B241A]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MousePointer2 size={40} className="text-[#3B241A]/20"/>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-[#3B241A]">Select a Node</h3>
                                <p className="text-sm text-[#A68B7E] px-8">
                                    Click on any circle in the graph to edit its position, color, and contained tools.
                                    <br/><br/>
                                    Drag nodes to rearrange your universe.
                                </p>

                                <div className="border-t border-[#3B241A]/10 pt-8 mt-8 text-left">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[#A68B7E]">Section Title</label>
                                    <input
                                        value={data.title}
                                        onChange={(e) => setData({...data, title: e.target.value})}
                                        className="w-full mt-2 p-3 bg-[#FAF0E6] rounded-xl font-serif font-bold text-[#3B241A] border-none"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}