import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const navItems = ["Home", "Services", "My Projects", "Reviews", "Contact"];

const Navbar = () => {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
            <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center">
                        <span className="text-foreground font-bold text-lg">S</span>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item, index) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(" ", "-")}`}
                            className={`text-sm font-medium transition-colors hover:text-accent ${
                                index === 0
                                    ? "text-foreground relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                                    : "text-muted-foreground"
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
                <button className="md:hidden text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
