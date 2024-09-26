"use client";

import { PromoterDetails } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface PromoterContextProps {
    promoter: PromoterDetails | null;
    updatePromoter: (promoter: PromoterDetails | null) => void;
    promoterLoading: boolean;
    updatePromoterLoading: (loading: boolean) => void;
}

export const PromoterContext = createContext<PromoterContextProps | null>(null);

export const usePromoterContext = () => {
    const promoterContext = useContext(PromoterContext);

    if (!promoterContext) {
        throw new Error(
            "usePromoterContext has to be used within <PromoterContext.Provider>"
        );
    }

    return promoterContext;
};

export const PromoterContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [promoter, setPromoter] = useState<PromoterDetails | null>(null);
    const [promoterLoading, setPromoterLoading] = useState<boolean>(true);

    const updatePromoter = (promoter: PromoterDetails | null) => {
        setPromoter(promoter);
    };

    const updatePromoterLoading = (loading: boolean) => {
        setPromoterLoading(loading);
    };

    return (
        <PromoterContext.Provider
            value={{
                promoter,
                updatePromoter,
                promoterLoading,
                updatePromoterLoading,
            }}
        >
            {children}
        </PromoterContext.Provider>
    );
};
