"use client";

import Toolbar from "@/components/Toolbar";

const Navbar = () => {
    return (
        <Toolbar
            showBackButton={false}
            navItems={["Home", "Services", "My Projects", "Reviews", "Contact"]}
            showContactButton={true}
            logoText="IR"
            logoTitle="ISHA RANI"
        />
    );
};

export default Navbar;
