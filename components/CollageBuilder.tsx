'use client';

import React, { useState, useRef } from 'react';
import {
    Plus, Download, Trash2, Eye, EyeOff,
    Maximize2, X, Sliders, Layers, Palette, Image as ImageIcon
} from 'lucide-react';

// --- Interfaces & Constants (Original) ---
interface CollageImage { id: string; src: string; file: File; aspectRatio: number; styles?: ImageStyles; }
interface ImageStyles { rotation: number; scale: number; opacity: number; brightness: number; contrast: number; saturation: number; blur: number; grayscale: number; sepia: number; hueRotate: number; borderWidth: number; borderColor: string; borderRadius: number; shadowBlur: number; shadowColor: string; shadowOffsetX: number; shadowOffsetY: number; objectFit: 'cover' | 'contain' | 'fill'; }
interface CollageGrid { name: string; id: string; layout: number[][]; description: string; }
interface AdvancedSettings { gap: number; backgroundColor: string; borderRadius: number; borderColor: string; borderWidth: number; shadowColor: string; shadowBlur: number; opacity: number; imageFilter: 'none' | 'grayscale' | 'sepia' | 'blur' | 'brightness' | 'contrast' | 'saturate' | 'hueRotate'; filterValue: number; }

const COLLAGE_GRIDS: CollageGrid[] = [
    { name: '2x2 Grid', id: 'grid-2x2', layout: [[1, 1], [1, 1]], description: '4 equal images' },
    { name: '3x3 Grid', id: 'grid-3x3', layout: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], description: '9 equal images' },
    { name: '2x3 Grid', id: 'grid-2x3', layout: [[1, 1, 1], [1, 1, 1]], description: '6 equal images' },
    { name: 'Classic Story', id: 'classic-story', layout: [[2, 1], [1, 1]], description: 'Large left, 3 small right' },
    { name: 'Feature Focus', id: 'feature-focus', layout: [[2, 1, 1], [1, 1, 1]], description: '1 large feature + 5 small' },
    { name: 'Triptych', id: 'triptych', layout: [[1, 1, 1]], description: '3 horizontal images' },
    { name: 'Vertical Stack', id: 'vertical-stack', layout: [[1], [1], [1], [1]], description: '4 vertical images' },
    { name: 'Diamond', id: 'diamond', layout: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], description: 'Diamond (5 images)' },
    { name: 'Instagram Story', id: 'instagram-story', layout: [[3], [1, 1, 1]], description: '1 wide top + 3 bottom' },
    { name: 'Mosaic', id: 'mosaic', layout: [[2, 1], [1, 2]], description: 'Dynamic 4-image' },
];

const SliderField = ({ label, value, min, max, step = 1, onChange, suffix = "" }: {
    label: string;
    value: number | undefined;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    suffix?: string
}): React.ReactNode => (
    <div className="mb-4">
        <div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span><span className="text-xs font-bold text-blue-600">{value ?? 0}{suffix}</span></div>
        <input type="range" min={min} max={max} step={step} value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
    </div>
);

export default function CollageBuilder() {
    const [images, setImages] = useState<CollageImage[]>([]);
    const [selectedGrid, setSelectedGrid] = useState<CollageGrid>(COLLAGE_GRIDS[0]);
    const [showPreview, setShowPreview] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'grids' | 'settings' | 'edit'>('grids');

    const [collageSettings, setCollageSettings] = useState<AdvancedSettings>({
        gap: 8, backgroundColor: '#ffffff', borderRadius: 0, borderColor: '#000000',
        borderWidth: 0, shadowColor: '#000000', shadowBlur: 0, opacity: 100,
        imageFilter: 'none', filterValue: 0,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Logic Helpers ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        Array.from(e.target.files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.onload = () => {
                    setImages((prev) => [...prev, {
                        id: Date.now().toString() + Math.random(),
                        src: event.target?.result as string,
                        file,
                        aspectRatio: img.width / img.height,
                        styles: {
                            rotation: 0, scale: 1, opacity: 100, brightness: 0, contrast: 0, saturation: 0,
                            blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, borderWidth: 0, borderColor: '#000000',
                            borderRadius: 0, shadowBlur: 0, shadowColor: '#000000', shadowOffsetX: 0, shadowOffsetY: 0, objectFit: 'cover',
                        },
                    }]);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const updateImageStyle = (id: string, key: keyof ImageStyles, val: string | number | boolean | 'cover' | 'contain' | 'fill'): void => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, styles: { ...img.styles!, [key]: val } } : img));
    };

    const resetImageStyles = (id: string) => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, styles: { rotation: 0, scale: 1, opacity: 100, brightness: 0, contrast: 0, saturation: 0, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, borderWidth: 0, borderColor: '#000000', borderRadius: 0, shadowBlur: 0, shadowColor: '#000000', shadowOffsetX: 0, shadowOffsetY: 0, objectFit: 'cover' } } : img));
    };

    const removeImage = (id: string): void => {
        setImages(prev => prev.filter(img => img.id !== id));
        if (selectedImageId === id) setSelectedImageId(null);
    };

    const getImageFilterString = (styles: ImageStyles) => {
        const f = [];
        if (styles.brightness !== 0) f.push(`brightness(${100 + styles.brightness}%)`);
        if (styles.contrast !== 0) f.push(`contrast(${100 + styles.contrast}%)`);
        if (styles.saturation !== 0) f.push(`saturate(${100 + styles.saturation}%)`);
        if (styles.blur !== 0) f.push(`blur(${styles.blur}px)`);
        if (styles.grayscale !== 0) f.push(`grayscale(${styles.grayscale}%)`);
        if (styles.sepia !== 0) f.push(`sepia(${styles.sepia}%)`);
        if (styles.hueRotate !== 0) f.push(`hue-rotate(${styles.hueRotate}deg)`);
        return f.length > 0 ? f.join(' ') : 'none';
    };

    const downloadCollage = async () => {
        try {
            if (images.length === 0) {
                alert('Please add images first');
                return;
            }

            const cols = selectedGrid.layout[0].length;
            const rows = selectedGrid.layout.length;
            const cellSize = 400;
            const gap = collageSettings.gap;
            const padding = gap * 2;

            const canvasWidth = cols * cellSize + (cols - 1) * gap + padding;
            const canvasHeight = rows * cellSize + (rows - 1) * gap + padding;

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                alert('Canvas context failed');
                return;
            }

            // Fill background
            ctx.fillStyle = collageSettings.backgroundColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Draw each image
            let imgIndex = 0;
            for (let rIdx = 0; rIdx < rows; rIdx++) {
                for (let cIdx = 0; cIdx < cols; cIdx++) {
                    const span = selectedGrid.layout[rIdx]?.[cIdx] || 0;
                    if (span === 0) continue;

                    const image = images[imgIndex];
                    if (!image) {
                        imgIndex++;
                        continue;
                    }

                    const x = cIdx * (cellSize + gap) + padding / 2;
                    const y = rIdx * (cellSize + gap) + padding / 2;
                    const w = span * cellSize + (span - 1) * gap;
                    const h = cellSize;

                    // Load image
                    const img = new Image();
                    img.crossOrigin = 'anonymous';

                    await new Promise((resolve) => {
                        img.onload = () => {
                            // Save context
                            ctx.save();
                            ctx.globalAlpha = (image.styles?.opacity || 100) / 100;

                            // Apply transforms
                            const centerX = x + w / 2;
                            const centerY = y + h / 2;
                            ctx.translate(centerX, centerY);
                            ctx.rotate((image.styles?.rotation || 0) * Math.PI / 180);
                            ctx.scale(image.styles?.scale || 1, image.styles?.scale || 1);

                            // Draw image
                            ctx.drawImage(img, -w / 2, -h / 2, w, h);

                            // Restore context
                            ctx.restore();
                            resolve(null);
                        };
                        img.onerror = () => resolve(null);
                        img.src = image.src;
                    });

                    imgIndex++;
                }
            }

            // Download
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `collage-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32 lg:pb-10 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 lg:px-8 sticky top-0 z-[60]">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Maximize2 size={18}/></div>
                        <h1 className="text-lg font-black tracking-tight hidden sm:block">COLLAGE<span className="text-blue-600">EDITOR</span></h1>
                    </div>
                    <button onClick={downloadCollage} disabled={images.length === 0} className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-600 disabled:bg-slate-200 transition-all flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Desktop Sidebar (Library) */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Image Library</h2>
                        <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 py-10 rounded-2xl transition-all flex flex-col items-center gap-2 text-slate-400 hover:text-blue-500">
                            <Plus size={24} />
                            <span className="text-xs font-bold">Add New Photos</span>
                        </button>
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <div className="mt-6 space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {images.map((img, i) => (
                                <div key={img.id} onClick={() => { setSelectedImageId(img.id); setActiveTab('edit'); }} className={`group flex items-center gap-3 p-2 rounded-xl cursor-pointer border-2 transition-all ${selectedImageId === img.id ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-slate-50'}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img.src} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" suppressHydrationWarning />
                                    <span className="text-xs font-bold text-slate-600 truncate flex-1">Photo {i+1}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setImages(prev => prev.filter(x => x.id !== img.id)); }} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Center Canvas */}
                <section className="lg:col-span-6 space-y-4">
                    <div className="bg-white rounded-[2rem] p-4 lg:p-8 shadow-xl shadow-slate-200/50 min-h-[450px] flex flex-col border border-slate-100 relative">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Canvas</span>
                            <button onClick={() => setShowPreview(!showPreview)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                {showPreview ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 lg:p-6">
                            {showPreview && images.length > 0 ? (
                                <div id="collage-preview" className="w-full transition-all duration-300" style={{
                                    backgroundColor: collageSettings.backgroundColor,
                                    padding: collageSettings.gap,
                                    borderRadius: collageSettings.borderRadius,
                                    border: collageSettings.borderWidth > 0 ? `${collageSettings.borderWidth}px solid ${collageSettings.borderColor}` : 'none',
                                    boxShadow: collageSettings.shadowBlur > 0 ? `0 0 ${collageSettings.shadowBlur}px ${collageSettings.shadowColor}` : 'none',
                                    opacity: collageSettings.opacity / 100,
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedGrid.layout[0].length}, 1fr)`, gap: collageSettings.gap }}>
                                        {selectedGrid.layout.map((row, rIdx) => row.map((span, cIdx) => {
                                            const idx = rIdx * selectedGrid.layout[0].length + cIdx;
                                            const img = images[idx];
                                            return span > 0 ? (
                                                <div key={`${rIdx}-${cIdx}`} style={{ gridColumn: `span ${span}`, aspectRatio: '1', overflow: 'hidden', borderRadius: collageSettings.borderRadius }} className="bg-slate-200/50">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    {img && <img src={img.src} alt="" style={{
                                                        width: '100%', height: '100%', objectFit: img.styles?.objectFit,
                                                        opacity: (img.styles?.opacity || 100) / 100,
                                                        filter: getImageFilterString(img.styles!),
                                                        transform: `rotate(${img.styles?.rotation}deg) scale(${img.styles?.scale})`,
                                                        border: img.styles?.borderWidth ? `${img.styles.borderWidth}px solid ${img.styles.borderColor}` : 'none',
                                                        borderRadius: `${img.styles?.borderRadius}px`,
                                                        boxShadow: img.styles?.shadowBlur ? `${img.styles.shadowOffsetX}px ${img.styles.shadowOffsetY}px ${img.styles.shadowBlur}px ${img.styles.shadowColor}` : 'none',
                                                    }}
                                                    suppressHydrationWarning
                                                    />}
                                                </div>
                                            ) : null;
                                        }))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4 opacity-30">
                                    <ImageIcon size={64} strokeWidth={1} className="mx-auto" />
                                    <p className="text-sm font-bold uppercase tracking-widest">Canvas Empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Settings Panel */}
                <aside className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                        <div className="flex bg-slate-50 border-b border-slate-200">
                            {[{id:'grids' as const, icon:<Layers size={18}/>, label:'Templates'}, {id:'settings' as const, icon:<Sliders size={18}/>, label:'Canvas'}, {id:'edit' as const, icon:<Palette size={18}/>, label:'Editor'}].map(t => (
                                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${activeTab === t.id ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>
                                    {t.icon}
                                    <span className="text-[9px] font-black uppercase tracking-tighter">{t.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-5 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                            {/* --- TAB: GRIDS (Fixed Preview) --- */}
                            {activeTab === 'grids' && (
                                <div className="grid grid-cols-2 gap-3">
                                    {COLLAGE_GRIDS.map(g => (
                                        <button key={g.id} onClick={() => setSelectedGrid(g)} className={`p-2 rounded-xl border-2 transition-all group ${selectedGrid.id === g.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
                                            <div className="aspect-square bg-slate-200 rounded-lg mb-2 overflow-hidden p-1 gap-0.5 grid" style={{ gridTemplateColumns: `repeat(${g.layout[0].length}, 1fr)` }}>
                                                {g.layout.flat().map((span, i) => span > 0 ? <div key={i} className={`bg-slate-400 rounded-[2px]`} style={{ gridColumn: `span ${span}` }} /> : null)}
                                            </div>
                                            <div className="text-[10px] font-black text-slate-700 truncate">{g.name}</div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* --- TAB: CANVAS SETTINGS (All Original Options) --- */}
                            {activeTab === 'settings' && (
                                <div className="space-y-2">
                                    <SliderField label="Cell Spacing" value={collageSettings.gap} min={0} max={50} onChange={(v: number)=>setCollageSettings({...collageSettings, gap:v})} suffix="px" />
                                    <SliderField label="Outer Corner" value={collageSettings.borderRadius} min={0} max={50} onChange={(v: number)=>setCollageSettings({...collageSettings, borderRadius:v})} suffix="px" />
                                    <SliderField label="Overall Opacity" value={collageSettings.opacity} min={0} max={100} onChange={(v: number)=>setCollageSettings({...collageSettings, opacity:v})} suffix="%" />
                                    <div className="py-4 border-t border-slate-100 mt-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-3">Colors & Border</span>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 block mb-1">BG Color</label>
                                                <input type="color" value={collageSettings.backgroundColor} onChange={(e)=>setCollageSettings({...collageSettings, backgroundColor:e.target.value})} className="w-full h-8 rounded border-none p-0 cursor-pointer" />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 block mb-1">Border Color</label>
                                                <input type="color" value={collageSettings.borderColor} onChange={(e)=>setCollageSettings({...collageSettings, borderColor:e.target.value})} className="w-full h-8 rounded border-none p-0 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                    <SliderField label="Canvas Border Width" value={collageSettings.borderWidth} min={0} max={20} onChange={(v: number)=>setCollageSettings({...collageSettings, borderWidth:v})} suffix="px" />
                                    <SliderField label="Canvas Shadow" value={collageSettings.shadowBlur} min={0} max={50} onChange={(v: number)=>setCollageSettings({...collageSettings, shadowBlur:v})} suffix="px" />
                                </div>
                            )}

                            {/* --- TAB: IMAGE EDITOR (All Advanced Styles) --- */}
                            {activeTab === 'edit' && (
                                <div className="space-y-6">
                                    {!selectedImageId ? (
                                        <div className="text-center py-10 text-slate-300"><ImageIcon size={32} className="mx-auto mb-2" /><p className="text-[10px] font-bold uppercase tracking-widest">Select an image</p></div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between"><span className="text-[10px] font-black text-blue-600 uppercase">Image Controls</span><button onClick={()=>setSelectedImageId(null)} className="text-slate-400"><X size={14}/></button></div>

                                            {/* Fit & Basics */}
                                            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                                                {['cover', 'contain', 'fill'].map(f => (
                                                    <button key={f} onClick={()=>updateImageStyle(selectedImageId, 'objectFit', f)} className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-md transition-all ${images.find(x=>x.id===selectedImageId)?.styles?.objectFit===f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{f}</button>
                                                ))}
                                            </div>

                                            <SliderField label="Rotation" value={images.find(x=>x.id===selectedImageId)?.styles?.rotation} min={0} max={360} onChange={(v: number)=>updateImageStyle(selectedImageId, 'rotation', v)} suffix="°" />
                                            <SliderField label="Zoom Scale" value={images.find(x=>x.id===selectedImageId)?.styles?.scale} min={0.5} max={3} step={0.1} onChange={(v: number)=>updateImageStyle(selectedImageId, 'scale', v)} suffix="x" />
                                            <SliderField label="Image Opacity" value={images.find(x=>x.id===selectedImageId)?.styles?.opacity} min={0} max={100} onChange={(v: number)=>updateImageStyle(selectedImageId, 'opacity', v)} suffix="%" />

                                            {/* Filters */}
                                            <div className="pt-4 border-t border-slate-100">
                                                <span className="text-[10px] font-black text-slate-400 uppercase block mb-4">Color Filters</span>
                                                <SliderField label="Brightness" value={images.find(x=>x.id===selectedImageId)?.styles?.brightness} min={-100} max={100} onChange={(v: number)=>updateImageStyle(selectedImageId, 'brightness', v)} />
                                                <SliderField label="Contrast" value={images.find(x=>x.id===selectedImageId)?.styles?.contrast} min={-100} max={100} onChange={(v: number)=>updateImageStyle(selectedImageId, 'contrast', v)} />
                                                <SliderField label="Saturation" value={images.find(x=>x.id===selectedImageId)?.styles?.saturation} min={-100} max={100} onChange={(v: number)=>updateImageStyle(selectedImageId, 'saturation', v)} />
                                                <SliderField label="Hue Rotate" value={images.find(x=>x.id===selectedImageId)?.styles?.hueRotate} min={0} max={360} onChange={(v: number)=>updateImageStyle(selectedImageId, 'hueRotate', v)} suffix="°" />
                                                <SliderField label="Blur" value={images.find(x=>x.id===selectedImageId)?.styles?.blur} min={0} max={20} onChange={(v: number)=>updateImageStyle(selectedImageId, 'blur', v)} suffix="px" />
                                                <SliderField label="Grayscale" value={images.find(x=>x.id===selectedImageId)?.styles?.grayscale} min={0} max={100} onChange={(v: number)=>updateImageStyle(selectedImageId, 'grayscale', v)} />
                                                <SliderField label="Sepia" value={images.find(x=>x.id===selectedImageId)?.styles?.sepia} min={0} max={100} onChange={(v: number)=>updateImageStyle(selectedImageId, 'sepia', v)} />
                                            </div>

                                            {/* Item Border/Shadow */}
                                            <div className="pt-4 border-t border-slate-100">
                                                <span className="text-[10px] font-black text-slate-400 uppercase block mb-4">Item Styling</span>
                                                <div className="grid grid-cols-2 gap-2 mb-4">
                                                    <input type="color" value={images.find(x=>x.id===selectedImageId)?.styles?.borderColor} onChange={(e)=>updateImageStyle(selectedImageId, 'borderColor', e.target.value)} className="w-full h-8 rounded p-0 border-none" />
                                                    <input type="color" value={images.find(x=>x.id===selectedImageId)?.styles?.shadowColor} onChange={(e)=>updateImageStyle(selectedImageId, 'shadowColor', e.target.value)} className="w-full h-8 rounded p-0 border-none" />
                                                </div>
                                                <SliderField label="Item Border" value={images.find(x=>x.id===selectedImageId)?.styles?.borderWidth} min={0} max={20} onChange={(v: number)=>updateImageStyle(selectedImageId, 'borderWidth', v)} />
                                                <SliderField label="Item Shadow" value={images.find(x=>x.id===selectedImageId)?.styles?.shadowBlur} min={0} max={50} onChange={(v: number)=>updateImageStyle(selectedImageId, 'shadowBlur', v)} />
                                            </div>

                                            <button onClick={()=>resetImageStyles(selectedImageId)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Reset Image</button>
                                            <button onClick={()=>removeImage(selectedImageId)} className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Delete From Collage</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </main>

            {/* MOBILE UPLOAD & QUICK SELECT BAR */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-[100] flex items-center gap-4 overflow-x-auto shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <button onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-transform"><Plus size={32} strokeWidth={3} /></button>
                <div className="flex gap-3 pr-4 h-14 items-center">
                    {images.map((img) => (
                        <div key={img.id} onClick={() => { setSelectedImageId(img.id); setActiveTab('edit'); }} className={`flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${selectedImageId === img.id ? 'border-blue-600 scale-110 shadow-md' : 'border-transparent opacity-60'}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.src} alt="" className="w-full h-full object-cover" suppressHydrationWarning />
                        </div>
                    ))}
                    {images.length === 0 && <span className="text-[10px] font-bold text-slate-300 uppercase whitespace-nowrap">Tap + to add photos</span>}
                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
        </div>
    );
}
