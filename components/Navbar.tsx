"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, X, Menu } from "lucide-react";
import { useState } from "react";

const navItems = ["Home", "Services", "My Projects", "Reviews", "Contact"];

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
            <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-[#F2A7A7]/50 flex items-center justify-center bg-[#F2A7A7]/10">
                        <span className="text-foreground font-bold text-lg">S</span>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item, index) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(" ", "-")}`}
                            className={`text-sm font-medium transition-colors hover:text-[#DC7C7C] ${
                                index === 0
                                    ? "text-[#3B241A] relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-[#F2A7A7] after:rounded-full"
                                    : "text-[#A68B7E]"
                            }`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Contact Button */}
                <Button variant="contact" size="lg" className="hidden md:flex">
                    <Sparkles className="w-4 h-4" />
                    Contact
                    <Sparkles className="w-4 h-4" />
                </Button>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[#3B241A] hover:text-[#DC7C7C] transition-colors"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-3xl overflow-hidden backdrop-blur-lg bg-white/95 border border-[#F2A7A7]/30 shadow-xl shadow-[#F2A7A7]/20">
                    <div className="flex flex-col py-4">
                        {navItems.map((item, index) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(" ", "-")}`}
                                onClick={closeMobileMenu}
                                className={`px-6 py-3 text-base font-medium transition-colors hover:bg-[#F2A7A7]/10 ${
                                    index === 0
                                        ? "text-[#3B241A] bg-[#F2A7A7]/5"
                                        : "text-[#A68B7E]"
                                }`}
                            >
                                {item}
                            </a>
                        ))}
                        <div className="px-6 pt-4">
                            <Button variant="contact" size="lg" className="w-full">
                                <Sparkles className="w-4 h-4" />
                                Contact
                                <Sparkles className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
