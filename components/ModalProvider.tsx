"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
    openModalId: string | null;
    openModal: (id: string) => void;
    closeModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [openModalId, setOpenModalId] = useState<string | null>(null);

    const openModal = (id: string) => {
        setOpenModalId(id);
    };

    const closeModal = (id: string) => {
        if (openModalId === id) {
            setOpenModalId(null);
        }
    };

    return (
        <ModalContext.Provider value={{ openModalId, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within ModalProvider");
    }
    return context;
}

