"use client";

import Toolbar from "@/components/Toolbar";

const Navbar = () => {
    return (
        <Toolbar
            showBackButton={false}
            showContactButton={true}
            logoText="IR"
            logoTitle="ISHA RANI"
        />
    );
};

export default Navbar;
