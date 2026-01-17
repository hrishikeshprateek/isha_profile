"use client";

import React from 'react';
import {
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Clock,
    Globe,
    Smartphone,
    Monitor,
    Calendar,
    Eye
} from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-[#FAF0E6] font-sans selection:bg-[#F2A7A7] selection:text-[#3B241A] p-6 md:p-12 pb-24">

            {/* BACKGROUND TEXTURE */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <main className="max-w-7xl mx-auto relative z-10">

                {/* HEADER */}
                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#3B241A]/5 border border-[#3B241A]/10">
                        <Activity size={12} className="text-[#3B241A]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B241A]/60">Live Insights</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B241A]">
                            Audience <span className="text-[#F2A7A7] italic">Analytics</span>
                        </h1>

                        {/* Date Filter Mockup */}
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#3B241A]/10 shadow-sm text-sm font-bold text-[#3B241A]/70 cursor-pointer hover:border-[#F2A7A7] transition-colors">
                            <Calendar size={14} />
                            <span>Last 30 Days</span>
                        </div>
                    </div>
                </header>

                {/* 1. KEY METRICS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <MetricCard
                        label="Total Views"
                        value="12,450"
                        change="+12.5%"
                        isPositive={true}
                        icon={<Eye size={20}/>}
                    />
                    <MetricCard
                        label="Unique Visitors"
                        value="8,320"
                        change="+5.2%"
                        isPositive={true}
                        icon={<Users size={20}/>}
                    />
                    <MetricCard
                        label="Avg. Read Time"
                        value="4m 12s"
                        change="-1.4%"
                        isPositive={false}
                        icon={<Clock size={20}/>}
                    />
                    <MetricCard
                        label="Bounce Rate"
                        value="42%"
                        change="-2.1%"
                        isPositive={true} // Lower bounce rate is good
                        icon={<Activity size={20}/>}
                    />
                </div>

                {/* 2. MAIN GROWTH CHART (SVG Visualization) */}
                <div className="bg-[#3B241A] text-[#FAF0E6] p-8 rounded-3xl shadow-xl relative overflow-hidden mb-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2A7A7]/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h3 className="font-serif font-bold text-xl">Traffic Growth</h3>
                            <p className="text-sm opacity-60">Visits over time</p>
                        </div>
                    </div>

                    {/* SVG Chart Container */}
                    <div className="w-full h-64 relative z-10">
                        <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible">
                            {/* Grid Lines */}
                            <line x1="0" y1="225" x2="1000" y2="225" stroke="rgba(250, 240, 230, 0.1)" strokeDasharray="4 4" />
                            <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(250, 240, 230, 0.1)" strokeDasharray="4 4" />
                            <line x1="0" y1="75" x2="1000" y2="75" stroke="rgba(250, 240, 230, 0.1)" strokeDasharray="4 4" />

                            {/* The Line Graph */}
                            <path
                                d="M0,250 Q100,200 200,220 T400,150 T600,100 T800,120 T1000,50"
                                fill="none"
                                stroke="#F2A7A7"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />

                            {/* Fill Gradient Area */}
                            <path
                                d="M0,250 Q100,200 200,220 T400,150 T600,100 T800,120 T1000,50 V300 H0 Z"
                                fill="url(#gradient)"
                                opacity="0.2"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#F2A7A7" />
                                    <stop offset="100%" stopColor="#3B241A" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Data Points (Dots) */}
                            <circle cx="200" cy="220" r="6" fill="#FAF0E6" stroke="#3B241A" strokeWidth="2" />
                            <circle cx="400" cy="150" r="6" fill="#FAF0E6" stroke="#3B241A" strokeWidth="2" />
                            <circle cx="600" cy="100" r="6" fill="#FAF0E6" stroke="#3B241A" strokeWidth="2" />
                            <circle cx="800" cy="120" r="6" fill="#FAF0E6" stroke="#3B241A" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* X-Axis Labels */}
                    <div className="flex justify-between text-xs opacity-50 mt-4 px-2">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                    </div>
                </div>

                {/* 3. SPLIT SECTIONS: Content & Demographics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* TOP CONTENT LIST */}
                    <div className="bg-white p-8 rounded-3xl border border-[#3B241A]/5 shadow-sm">
                        <h3 className="font-bold text-[#3B241A] text-lg mb-6 flex items-center gap-2">
                            <PenToolIcon /> Top Performing Stories
                        </h3>
                        <div className="space-y-6">
                            <ContentRow
                                rank="01"
                                title="Building a Portfolio with Next.js"
                                views="4.2k"
                                percent={90}
                            />
                            <ContentRow
                                rank="02"
                                title="My Journey into Tech"
                                views="3.1k"
                                percent={70}
                            />
                            <ContentRow
                                rank="03"
                                title="Understanding React Server Components"
                                views="2.8k"
                                percent={60}
                            />
                            <ContentRow
                                rank="04"
                                title="A Weekend in Kyoto"
                                views="1.5k"
                                percent={40}
                            />
                        </div>
                    </div>

                    {/* DEMOGRAPHICS & DEVICES */}
                    <div className="space-y-8">

                        {/* Device Split */}
                        <div className="bg-white p-8 rounded-3xl border border-[#3B241A]/5 shadow-sm">
                            <h3 className="font-bold text-[#3B241A] text-lg mb-6">Device Breakdown</h3>
                            <div className="space-y-4">
                                <DeviceBar icon={<Smartphone size={18}/>} label="Mobile" percent="65%" color="bg-[#3B241A]" />
                                <DeviceBar icon={<Monitor size={18}/>} label="Desktop" percent="30%" color="bg-[#A68B7E]" />
                                <DeviceBar icon={<Globe size={18}/>} label="Tablet" percent="5%" color="bg-[#F2A7A7]" />
                            </div>
                        </div>

                        {/* Top Locations */}
                        <div className="bg-white p-8 rounded-3xl border border-[#3B241A]/5 shadow-sm">
                            <h3 className="font-bold text-[#3B241A] text-lg mb-6">Top Locations</h3>
                            <div className="flex flex-wrap gap-2">
                                <LocationTag country="India" count="45%" />
                                <LocationTag country="USA" count="20%" />
                                <LocationTag country="UK" count="15%" />
                                <LocationTag country="Germany" count="10%" />
                                <LocationTag country="Canada" count="5%" />
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}

// --- COMPONENTS ---

function MetricCard({ label, value, change, isPositive, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-[#3B241A]/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF0E6] text-[#3B241A] flex items-center justify-center">
                    {icon}
                </div>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? <ArrowUpRight size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
                    {change}
                </div>
            </div>
            <p className="text-[#A68B7E] text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-serif font-bold text-[#3B241A]">{value}</h3>
        </div>
    );
}

function ContentRow({ rank, title, views, percent }: any) {
    return (
        <div className="group">
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-serif font-bold text-[#F2A7A7] opacity-50">{rank}</span>
                    <h4 className="text-sm font-bold text-[#3B241A] group-hover:text-[#F2A7A7] transition-colors">{title}</h4>
                </div>
                <span className="text-xs font-bold text-[#A68B7E]">{views}</span>
            </div>
            <div className="w-full h-2 bg-[#FAF0E6] rounded-full overflow-hidden">
                <div className="h-full bg-[#3B241A] rounded-full" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}

function DeviceBar({ icon, label, percent, color }: any) {
    return (
        <div className="flex items-center gap-4">
            <div className="text-[#3B241A]/50">{icon}</div>
            <div className="flex-1">
                <div className="flex justify-between text-xs font-bold text-[#3B241A] mb-1">
                    <span>{label}</span>
                    <span>{percent}</span>
                </div>
                <div className="w-full h-2 bg-[#FAF0E6] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: percent }} />
                </div>
            </div>
        </div>
    );
}

function LocationTag({ country, count }: any) {
    return (
        <div className="px-4 py-2 rounded-xl bg-[#FAF0E6] border border-[#3B241A]/5 text-[#3B241A] text-xs font-bold flex items-center gap-2">
            <span>{country}</span>
            <span className="opacity-40">|</span>
            <span className="text-[#F2A7A7]">{count}</span>
        </div>
    );
}

function PenToolIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
        </svg>
    )
}