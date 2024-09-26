"use client";

import React, { useCallback, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fetchPromoter } from "@/bff";
import { usePromoterContext } from "@/context/promoterContext";

interface Props {
    children: React.ReactNode;
}

const ComponentName = ({ children }: Props) => {
    const { data: session } = useSession();
    const { updatePromoter, updatePromoterLoading } = usePromoterContext();

    const getPromoter = useCallback(async () => {
        updatePromoterLoading(true);
        if (session?.user?.email) {
            const promoter = await fetchPromoter({
                email: session?.user?.email,
            });

            updatePromoter(promoter);
            updatePromoterLoading(false);
        }
    }, [session?.user?.email]);

    useEffect(() => {
        getPromoter();
    }, [session?.user?.email]);

    return <Box position="relative">{children}</Box>;
};

export default ComponentName;
