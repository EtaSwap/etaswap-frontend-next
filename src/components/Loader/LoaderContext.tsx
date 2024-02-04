import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Loader } from "./Loader";

interface LoaderContextProps {
    loading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export interface ILoaderProviderProps {
    children: ReactNode;
}

export const LoaderProvider = ({ children }: ILoaderProviderProps) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => {
        setLoading(true);
    };

    const hideLoader = () => {
        setLoading(false);
    };

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            <Loader isShow={loading}>
                {children}
            </Loader>
        </LoaderContext.Provider>
    );
};

export const useLoader = (): any => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};
