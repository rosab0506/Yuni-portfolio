'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    const showLoader = React.useCallback(() => setIsLoading(true), []);
    const hideLoader = React.useCallback(() => setIsLoading(false), []);

    return (
        <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}
