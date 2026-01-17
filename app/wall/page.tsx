"use client";

import Toolbar from "@/components/Toolbar";
import WorkPage from "@/components/WallProfile";
import Footer from "@/components/Footer";

export default function WallPage() {
    return (
        <div className="min-h-screen bg-[#FAF0E6] flex flex-col">
            {/* Header */}
            <Toolbar
                title="Gallery"
                showBackButton={true}
                backHref="/d1"
                navItems={["Home", "Services", "My Projects", "Reviews", "Contact"]}
            />

            {/* Main Content */}
            <main className="flex-grow">
                <WorkPage />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

