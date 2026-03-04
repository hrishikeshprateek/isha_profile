"use client";

import { Download, X, Share2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useModal } from "./ModalProvider";
import { ModalPortal } from "./ModalPortal";

interface DownloadQuoteProps {
    text: string;
    author: string;
    quoteId?: string;
    showShareButton?: boolean;
    onShare?: () => void;
    hideWrapper?: boolean;
}

// Helper to load images asynchronously for the canvas
const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

const DownloadQuote = ({ text, author, quoteId, showShareButton = false, onShare, hideWrapper = false }: DownloadQuoteProps) => {
    const { openModalId, openModal, closeModal } = useModal();
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const modalId = `quote-modal-${quoteId}`;
    const isModalOpen = openModalId === modalId;

    const generateCanvas = async (): Promise<HTMLCanvasElement | null> => {
        try {
            const width = 1080;
            let height = 1080; // Default to Instagram Square

            // --- STEP 1: PRE-CALCULATE TEXT WRAPPING & HEIGHT ---
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return null;

            const maxWidth = width - 200;
            let fontSize = 56;
            let lineHeight = 75;

            // Shrink font slightly for very long text
            if (text.length > 250) {
                fontSize = 40;
                lineHeight = 55;
            } else if (text.length > 150) {
                fontSize = 46;
                lineHeight = 65;
            }

            tempCtx.font = `bold ${fontSize}px serif`;

            // Process text, respecting explicit line breaks (\n) and wrapping long lines
            const paragraphs = text.split('\n');
            const lines: string[] = [];

            paragraphs.forEach(paragraph => {
                if (paragraph.trim() === '') {
                    lines.push(''); // Keep empty lines for spacing
                    return;
                }
                const words = paragraph.split(' ');
                let currentLine = '';

                words.forEach(word => {
                    const testLine = currentLine + (currentLine ? ' ' : '') + word;
                    const metrics = tempCtx.measureText(testLine);
                    if (metrics.width > maxWidth && currentLine) {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                });
                if (currentLine) lines.push(currentLine);
            });

            const totalTextHeight = lines.length * lineHeight;

            // Calculate if we need to expand the canvas height (Portrait mode)
            const topSpacing = 350; // Space for Logo + Quote Icon
            const bottomSpacing = 320; // Space for Author + QR Code block
            const requiredHeight = topSpacing + totalTextHeight + bottomSpacing;

            if (requiredHeight > 1080) {
                height = requiredHeight; // Expand height for long quotes
            }

            // --- STEP 2: ACTUAL CANVAS GENERATION ---
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            canvas.width = width;
            canvas.height = height;

            // Background Gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#F2A7A7');
            gradient.addColorStop(0.5, '#F2D5D5');
            gradient.addColorStop(1, '#FAF0E6');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Texture overlay
            ctx.fillStyle = 'rgba(59, 36, 26, 0.02)';
            for (let i = 0; i < (width * height) / 200; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                ctx.fillRect(x, y, 1, 1);
            }

            // Decorative circles (adjusted dynamically to height)
            ctx.fillStyle = 'rgba(220, 124, 124, 0.1)';
            ctx.beginPath();
            ctx.arc(width * 0.15, height * 0.15, 150, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(242, 167, 167, 0.15)';
            ctx.beginPath();
            ctx.arc(width * 0.85, height * 0.85, 200, 0, Math.PI * 2);
            ctx.fill();

            // TOP LEFT: Logo
            try {
                const logoImg = await loadImage('/logo.png');
                const maxSize = 120;
                const ratio = Math.min(maxSize / logoImg.width, maxSize / logoImg.height);
                ctx.drawImage(logoImg, 80, 80, logoImg.width * ratio, logoImg.height * ratio);
            } catch (e) {
                // Fallback elegant text logo
                ctx.fillStyle = '#3B241A';
                ctx.font = 'bold 36px sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText('ISHA RANI.', 80, 80);

                ctx.fillStyle = '#DC7C7C';
                ctx.font = 'bold 16px sans-serif';
                ctx.letterSpacing = "4px";
                ctx.fillText('CREATIVE STUDIO', 80, 125);
            }

            // Quote Icon
            ctx.fillStyle = 'rgba(59, 36, 26, 0.1)';
            ctx.font = 'bold 80px serif';
            ctx.textAlign = 'center';
            ctx.fillText('"', width / 2, 220);

            // Draw Quote Text (Vertically centered within available space)
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#3B241A';
            ctx.font = `bold ${fontSize}px serif`;

            const availableTextSpace = height - topSpacing - bottomSpacing;
            const textStartY = topSpacing + (availableTextSpace - totalTextHeight) / 2;

            lines.forEach((line, index) => {
                ctx.fillText(line, width / 2, textStartY + index * lineHeight);
            });

            // Draw Author name right below text
            ctx.font = 'bold 36px sans-serif';
            ctx.fillStyle = '#DC7C7C';
            ctx.fillText(`— ${author}`, width / 2, textStartY + totalTextHeight + 60);

            // --- BOTTOM LEFT: QR Code & Footer ---
            const qrSize = 90;
            const gap = 24;
            const startX = 80; // Left margin alignment
            const footerY = height - qrSize - 80; // Bottom margin alignment

            try {
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=https://isha.co.in/quotes&color=3B241A&bgcolor=FAF0E6`;
                const qrImg = await loadImage(qrUrl);

                ctx.shadowColor = "rgba(59, 36, 26, 0.1)";
                ctx.shadowBlur = 15;
                ctx.drawImage(qrImg, startX, footerY, qrSize, qrSize);
                ctx.shadowBlur = 0;
            } catch (e) {
                console.error('Failed to load QR code', e);
            }

            // Footer Text Lines (Next to QR code)
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';

            ctx.fillStyle = '#A68B7E';
            ctx.font = 'bold 14px sans-serif';
            ctx.letterSpacing = "2px";
            ctx.fillText("SCAN TO READ MORE", startX + qrSize + gap, footerY + 38);

            ctx.fillStyle = '#3B241A';
            ctx.font = 'italic 26px serif';
            ctx.letterSpacing = "0px";
            ctx.fillText("isha.co.in/quotes", startX + qrSize + gap, footerY + 68);

            return canvas;
        } catch (error) {
            console.error('Error generating quote canvas:', error);
            return null;
        }
    };

    const handlePreview = async () => {
        setIsGenerating(true);
        const canvas = await generateCanvas();
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            setPreviewImage(dataUrl);
            openModal(modalId);
        }
        setIsGenerating(false);
    };

    const handleDownloadFromPreview = () => {
        if (!previewImage) return;
        const link = document.createElement('a');
        link.download = `quote-${quoteId || Date.now()}.png`;
        link.href = previewImage;
        link.click();
        closeModal(modalId);
    };

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    return (
        <>
            {hideWrapper ? (
                <>
                    {showShareButton && onShare && (
                        <button
                            onClick={onShare}
                            className="inline-flex items-center gap-2 px-4 py-2 text-white hover:text-[#F2A7A7] transition-colors duration-300 font-bold text-xs uppercase tracking-widest border-r border-white/10"
                            aria-label="Share quote"
                        >
                            <Share2 size={16} />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    )}
                    <button
                        onClick={handlePreview}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-2 px-4 py-2 text-white hover:text-[#F2A7A7] transition-colors duration-300 font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Download quote as image"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">{isGenerating ? 'Wait...' : 'Save'}</span>
                    </button>
                </>
            ) : (
                <div className="inline-flex items-center rounded-full bg-transparent overflow-hidden">
                    {showShareButton && onShare && (
                        <button
                            onClick={onShare}
                            className="inline-flex items-center gap-2 px-4 py-2 text-white hover:text-[#3B241A] transition-colors duration-300 font-bold text-xs uppercase tracking-widest border-r border-white/20"
                            aria-label="Share quote"
                        >
                            <Share2 size={15} />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    )}
                    <button
                        onClick={handlePreview}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-2 px-4 py-2 text-white hover:text-[#3B241A] transition-colors duration-300 font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Download quote as image"
                    >
                        <Download size={15} />
                        <span className="hidden sm:inline">{isGenerating ? 'Wait...' : 'Save'}</span>
                    </button>
                </div>
            )}

            {isModalOpen && previewImage && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3B241A]/60 backdrop-blur-md p-4 md:p-8 w-screen h-screen">

                        <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FAF0E6] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-white/50">

                            <div className="bg-white/50 backdrop-blur-sm px-6 md:px-8 py-5 border-b border-[#3B241A]/5 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <h2 className="text-lg md:text-xl font-serif font-bold text-[#3B241A]">Quote Preview</h2>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E] mt-1">Ready to download</p>
                                </div>
                                <button
                                    onClick={() => closeModal(modalId)}
                                    className="w-10 h-10 rounded-full bg-white border border-[#3B241A]/10 text-[#3B241A] hover:bg-[#3B241A] hover:text-[#FAF0E6] transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md flex-shrink-0 group"
                                    aria-label="Close preview"
                                >
                                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-black/5">
                                <div className="w-full max-w-sm mx-auto h-full flex flex-col justify-center">
                                    <div className="relative w-full h-[60vh] max-h-[600px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(59,36,26,0.15)] ring-1 ring-[#3B241A]/5 bg-transparent transform transition-transform duration-500 hover:scale-[1.02]">
                                        <Image
                                            src={previewImage}
                                            alt="Quote preview"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md px-6 md:px-8 py-5 border-t border-[#3B241A]/5 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                                <div className="text-center sm:text-left hidden sm:block">
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#A68B7E]">HQ Image Export</p>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => closeModal(modalId)}
                                        className="flex-1 sm:flex-none px-6 py-3 rounded-full border border-[#3B241A]/20 text-[#3B241A] bg-transparent hover:border-[#3B241A] hover:bg-black/5 transition-all duration-300 font-bold text-xs uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDownloadFromPreview}
                                        className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-[#3B241A] text-[#FAF0E6] hover:bg-[#DC7C7C] hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} />
                                        Download Image
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </ModalPortal>
            )}
        </>
    );
};

export default DownloadQuote;