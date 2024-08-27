"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ContextValueProps {
    createClassDialog: boolean;
    setCreateClassDialog: React.Dispatch<React.SetStateAction<boolean>>;
    joinClassDialog: boolean;
    setJoinClassDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddContext = createContext<ContextValueProps | undefined>(undefined);

export function useLocalContext() {
    const context = useContext(AddContext);
    if (!context) {
        throw new Error("useLocalContext must be used within a ContextProvider");
    }
    return context;
}

interface ContextProviderProps {
    children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
    const [createClassDialog, setCreateClassDialog] = useState(false);
    const [joinClassDialog, setJoinClassDialog] = useState(false);

    const value = {
        createClassDialog,
        setCreateClassDialog,
        joinClassDialog,
        setJoinClassDialog,
    };

    return (
        <AddContext.Provider value={value}>
            {children}
        </AddContext.Provider>
    );
}
