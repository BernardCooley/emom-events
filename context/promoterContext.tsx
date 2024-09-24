"use client";

import { PromoterDetails } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface PromoterContextProps {
    promoter: PromoterDetails | null;
    updatePromoter: (promoter: PromoterDetails | null) => void;
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
    console.log("🚀 ~ promoter:", promoter);

    const updatePromoter = (promoter: PromoterDetails | null) => {
        setPromoter(promoter);
    };

    return (
        <PromoterContext.Provider
            value={{
                promoter,
                updatePromoter,
            }}
        >
            {children}
        </PromoterContext.Provider>
    );
};
