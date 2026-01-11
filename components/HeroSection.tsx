import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown } from "lucide-react";
import Image from "next/image";

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
    <a
        href="#"
        className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/10 transition-all duration-300"
    >
        {children}
    </a>
);

const FloatingElement = ({ className }: { className?: string }) => (
    <div className={`absolute ${className}`}>
        <div className="w-6 h-6 bg-primary/60 rounded-lg rotate-45 float-animation" />
    </div>
);

const HeroSection = () => {
    return (
        <section className="relative min-h-screen overflow-hidden hero-gradient">
            {/* Background gradient orbs */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-[#F2A7A7]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-10 w-64 h-64 bg-[#E8A0A0]/15 rounded-full blur-3xl" />

            {/* Floating decorative elements */}
            <FloatingElement className="top-40 left-[15%]" />
            <FloatingElement className="top-60 right-[40%] float-animation-delayed" />
            <FloatingElement className="bottom-60 left-[30%]" />

            {/* Glowing orbs - softer colors */}
            <div className="absolute bottom-32 left-20 w-4 h-4 bg-[#F2A7A7] rounded-full blur-sm pulse-glow" />
            <div className="absolute bottom-40 left-32 w-2 h-2 bg-[#E8A0A0] rounded-full blur-sm pulse-glow" />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                    {/* Left Content */}
                    <div className="space-y-6 z-10">
                        <p className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            Welcome to my world <Sparkles className="w-4 h-4 text-[#F2A7A7] sparkle" />
                        </p>

                        <div>
                            <h1 className="text-4xl md:text-5xl font-medium text-foreground font-serif">
                                <span className="italic">Hi,</span>
                                <span className="font-light">I&apos;m</span>{" "}
                                <span className="font-semibold">Isha Rani</span>
                            </h1>

                            <h2 className="text-5xl md:text-7xl font-bold mt-2 font-serif">
                                <span className="text-gradient">UI&amp;UX</span>{" "}
                                <span className="text-foreground">Designer</span>
                            </h2>
                        </div>

                        <p className="text-[#6E5045] max-w-md leading-relaxed">
                            Passionate UI/UX designer, I create intuitive and visually appealing digital
                            experiences. I transform ideas into seamless designs that meet users&apos;
                            expectations.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button variant="hero" size="lg" className="relative">
                                <span className="absolute -top-1 -left-1 w-2 h-2 border-l-2 border-t-2 border-primary/50" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 border-r-2 border-t-2 border-primary/50" />
                                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-l-2 border-b-2 border-primary/50" />
                                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-primary/50" />
                                My Projects
                            </Button>

                            <Button variant="heroOutline" size="lg" className="relative">
                                <Sparkles className="w-4 h-4 text-primary sparkle" />
                                Download CV
                                <Sparkles className="w-4 h-4 text-primary sparkle" />
                            </Button>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-6">
                            <SocialIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                </svg>
                            </SocialIcon>
                            <SocialIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                    <rect width="4" height="12" x="2" y="9"/>
                                    <circle cx="4" cy="4" r="2"/>
                                </svg>
                            </SocialIcon>
                            <SocialIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </SocialIcon>
                        </div>
                    </div>

                    {/* Right Content - Avatar with Frame */}
                    <div className="relative flex justify-center items-center h-[500px] md:h-[600px]">
                        {/* SVG Frame - positioned lower so avatar pops out from top */}
                        <svg
                            className="absolute w-[340px] h-[380px] md:w-[420px] md:h-[460px] top-[120px] md:top-[140px]"
                            viewBox="0 0 420 460"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ transform: 'rotate(3deg)' }}
                        >
                            <rect
                                x="16"
                                y="16"
                                width="388"
                                height="428"
                                rx="36"
                                stroke="url(#frameGradient)"
                                strokeWidth="14"
                                fill="none"
                            />
                            <defs>
                                <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#F2A7A7" />
                                    <stop offset="50%" stopColor="#DC7C7C" />
                                    <stop offset="100%" stopColor="#E8A0A0" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Avatar Image - positioned to pop out from top of frame */}
                        <div className="absolute z-10 w-[300px] h-[420px] md:w-[360px] md:h-[500px] top-[20px] md:top-[30px] overflow-visible">
                            <Image
                                src="/isha_a.png"
                                alt="Isha Rani"
                                fill
                                className="object-cover object-top drop-shadow-2xl"
                                style={{
                                    mixBlendMode: 'normal',
                                    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))',
                                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 98%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 98%)'
                                }}
                                priority
                            />
                        </div>

                        {/* Floating pen tool - top right */}
                        <div className="absolute -right-2 md:right-0 top-[20%] float-animation z-20">
                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="56" height="56" rx="12" fill="#DC7C7C" transform="rotate(15 28 28)"/>
                                <g transform="translate(14, 14)">
                                    <path d="M20.71 4.04a3.5 3.5 0 0 0-4.95 0L4.04 15.75a1 1 0 0 0-.29.5l-1.5 6a1 1 0 0 0 1.22 1.22l6-1.5a1 1 0 0 0 .5-.29L21.68 9.96a3.5 3.5 0 0 0 0-4.92l-.97-.97z" fill="#F2A7A7"/>
                                    <path d="M14 6l8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                </g>
                            </svg>
                        </div>

                        {/* Bezier curve handle - bottom right */}
                        <div className="absolute right-4 md:right-8 bottom-[15%] float-animation-delayed z-20">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24" cy="24" r="8" fill="#F2A7A7"/>
                                <line x1="24" y1="24" x2="40" y2="8" stroke="#F2A7A7" strokeWidth="3"/>
                                <circle cx="40" cy="8" r="6" fill="#DC7C7C"/>
                            </svg>
                        </div>

                        {/* Bezier curve handle - left side */}
                        <div className="absolute -left-4 md:left-0 bottom-[30%] float-animation z-20">
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="26" cy="26" r="10" fill="#DC7C7C"/>
                                <line x1="26" y1="26" x2="8" y2="44" stroke="#F2A7A7" strokeWidth="3"/>
                                <circle cx="8" cy="44" r="6" fill="#E8A0A0"/>
                            </svg>
                        </div>

                        {/* Small floating purple circles */}
                        <div className="absolute right-16 bottom-8 w-5 h-5 bg-accent/70 rounded-full float-animation" />
                        <div className="absolute right-8 top-[35%] w-3 h-3 bg-primary/50 rounded-full float-animation-delayed" />

                        {/* Decorative ribbon/confetti pieces */}
                        <div className="absolute right-[20%] top-[10%] float-animation-delayed">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M4 4 L20 12 L12 20 Z" fill="#F2A7A7" opacity="0.6"/>
                            </svg>
                        </div>
                        <div className="absolute left-[15%] top-[15%] float-animation">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="2" y="2" width="16" height="16" rx="2" fill="#DC7C7C" opacity="0.5" transform="rotate(45 10 10)"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center animate-bounce">
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
