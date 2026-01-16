"use client";

import { Button } from "@/components/ui/button";
import { X, Menu, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ToolbarProps {
  title?: string;
  showBackButton?: boolean;
  backHref?: string;
  navItems?: string[];
  showContactButton?: boolean;
  logoText?: string;
}

const Toolbar = ({
  title = "Blog",
  showBackButton = true,
  backHref = "/d1",
  navItems = ["Home", "Services", "My Projects", "Reviews", "Contact"],
  showContactButton = false,
  logoText = "S",
}: ToolbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleVcardClick = () => {
    router.push("/vcard");
    closeMobileMenu();
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
        {/* Left - Logo/Back Button */}
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Link
              href={backHref}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">{title}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-[#F2A7A7]/50 flex items-center justify-center bg-[#F2A7A7]/10">
                <span className="text-foreground font-bold text-lg">{logoText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Center - Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <button
              key={item}
              className={`text-sm font-medium transition-colors hover:text-[#DC7C7C] ${
                index === 0
                  ? "text-[#3B241A] relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-[#F2A7A7] after:rounded-full"
                  : "text-[#A68B7E]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right - Contact Button or Menu */}
        {showContactButton ? (
          <Button
            variant="contact"
            size="lg"
            className="hidden md:flex"
            onClick={handleVcardClick}
          >
            Vcard
          </Button>
        ) : (
          <div className="w-10 h-10"></div>
        )}

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
              <button
                key={item}
                onClick={closeMobileMenu}
                className={`px-6 py-3 text-base font-medium transition-colors hover:bg-[#F2A7A7]/10 text-left ${
                  index === 0
                    ? "text-[#3B241A] bg-[#F2A7A7]/5"
                    : "text-[#A68B7E]"
                }`}
              >
                {item}
              </button>
            ))}
            {showContactButton && (
              <div className="px-6 pt-4">
                <Button
                  variant="contact"
                  size="lg"
                  className="w-full"
                  onClick={handleVcardClick}
                >
                  Vcard
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Toolbar;

