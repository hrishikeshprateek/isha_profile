"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Matches the Social Icon style from your FeaturedBlogs/Blog page
const SocialIcon = ({ children }: { children: React.ReactNode }) => (
    <a
        href="#"
        className="w-12 h-12 rounded-full border border-[#3B241A]/10 bg-white/40 backdrop-blur-sm flex items-center justify-center text-[#3B241A] hover:text-[#DC7C7C] hover:border-[#DC7C7C]/30 hover:bg-white/80 transition-all duration-300"
    >
        {children}
    </a>
);

const roles = ["UI/UX Designer", "Content Creator", "Content Writer", "Designer"];

const HeroSection = () => {
    const [displayText, setDisplayText] = useState("");
    const [roleIndex, setRoleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentRole = roles[roleIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentRole.length) {
                    setDisplayText(currentRole.slice(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(currentRole.slice(0, displayText.length - 1));
                } else {
                    setIsDeleting(false);
                    setRoleIndex((prev) => (prev + 1) % roles.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayText, roleIndex, isDeleting]);

    return (
        // Changed background to match Blog Page (#FAF0E6)
        <section className="relative min-h-screen overflow-hidden bg-[#FAF0E6]">

            {/* Background elements adjusted to be softer/cleaner to match Blog aesthetics */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-[#DC7C7C]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-10 w-64 h-64 bg-[#3B241A]/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 pt-32 md:pt-32 pb-16 md:pb-12">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-[85vh]">
                    {/* Left Content */}
                    <div className="space-y-6 md:space-y-8 z-10 mt-8 md:mt-0">
                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#3B241A]">
                                <span className="italic">Hi,</span>
                                <span className="font-light"> I&apos;m</span>{" "}
                                <span className="font-semibold">Isha Rani</span>
                            </h1>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2">
                                {/* Applied the Blog's accent color #DC7C7C to the typing text */}
                                <span className="text-[#DC7C7C] inline-block min-h-[1.2em]">
                                    {displayText}
                                    <span className="animate-pulse text-[#3B241A]">|</span>
                                </span>
                            </h2>
                        </div>

                        {/* Updated paragraph color to #A68B7E (Blog Body Text) */}
                        <p className="text-lg md:text-xl text-[#A68B7E] max-w-xl leading-relaxed">
                            Crafting elegant digital experiences that blend beauty with purpose.
                            Transforming ideas into intuitive designs that captivate and inspire.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {/* Primary Button: Styled to match Blog's "Subscribe/Continue Reading" style */}
                            <Button
                                size="lg"
                                className="bg-[#3B241A] text-[#FAF0E6] hover:bg-[#DC7C7C] border-none shadow-lg shadow-[#3B241A]/10 hover:shadow-xl transition-all duration-300 rounded-full"
                            >
                                View My Work
                            </Button>

                            {/* Secondary Button: Outline style using Blog's dark brown */}
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-[#3B241A] text-[#3B241A] bg-transparent hover:bg-[#3B241A] hover:text-[#FAF0E6] rounded-full transition-all duration-300"
                            >
                                Download CV
                            </Button>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-4">
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
                    <div className="relative flex justify-center items-center h-[450px] md:h-[550px] lg:h-[600px]">
                        {/* SVG Frame - Updated stroke colors to match Blog Theme */}
                        <svg
                            className="absolute w-[280px] h-[320px] sm:w-[320px] sm:h-[360px] md:w-[380px] md:h-[420px] lg:w-[420px] lg:h-[460px] top-[60px] sm:top-[70px] md:top-[90px] lg:top-[110px] left-1/2"
                            viewBox="0 0 420 460"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ transform: 'translateX(-50%) rotate(15deg)' }}
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
                                    {/* Updated Gradient Stops: Dark Brown to Terra-cotta */}
                                    <stop offset="0%" stopColor="#3B241A" />
                                    <stop offset="50%" stopColor="#DC7C7C" />
                                    <stop offset="100%" stopColor="#F2A7A7" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Avatar Image */}
                        <div className="absolute z-10 w-[260px] h-[360px] sm:w-[300px] sm:h-[400px] md:w-[340px] md:h-[460px] lg:w-[380px] lg:h-[520px] top-[0px] sm:top-[5px] md:top-[10px] lg:top-[15px] left-1/2 -translate-x-1/2 overflow-visible">
                            <Image
                                src="/isha_a.png"
                                alt="Isha Rani"
                                fill
                                className="object-cover object-top drop-shadow-2xl rounded-3xl"
                                style={{
                                    mixBlendMode: 'normal',
                                    filter: 'drop-shadow(0 25px 50px rgba(59, 36, 26, 0.3))', // Brown shadow
                                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 98%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 98%)'
                                }}
                                priority
                            />
                        </div>

                        {/* Floating particles - Updated colors */}
                        <div className="absolute right-[15%] top-[15%] w-3 h-3 bg-[#DC7C7C]/40 rounded-full float-animation" />
                        <div className="absolute left-[15%] top-[25%] w-2 h-2 bg-[#3B241A]/20 rounded-full float-animation-delayed" />
                        <div className="absolute right-[20%] bottom-[20%] w-2.5 h-2.5 bg-[#DC7C7C]/30 rounded-full pulse-glow" />
                        <div className="absolute left-[20%] bottom-[30%] w-2 h-2 bg-[#F2A7A7] rounded-full pulse-glow" style={{ animationDelay: '1s' }} />
                    </div>
                </div>

                {/* Scroll Indicator - Updated color */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-[#3B241A]/20 flex items-center justify-center animate-bounce">
                        <ChevronDown className="w-5 h-5 text-[#3B241A]" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;