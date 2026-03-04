"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
    children: ReactNode;
}

export function ModalPortal({ children }: ModalPortalProps) {
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Create or get portal container
        let container = document.getElementById("modal-portal");
        if (!container) {
            container = document.createElement("div");
            container.id = "modal-portal";
            document.body.appendChild(container);
        }
        setPortalElement(container);
    }, []);

    if (!portalElement) return null;

    return createPortal(children, portalElement);
}

