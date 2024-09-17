"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fetchPromoter } from "@/bff";
import { Promoter } from "@prisma/client";
import PromoterForm from "@/app/components/PromoterForm";

interface Props {}

const PromoterDashboard = ({}: Props) => {
    const { data: session } = useSession();
    const [promoter, setPromoter] = useState<Promoter | null>(null);
    const [loading, setLoading] = useState(true);

    const getPromoter = useCallback(async () => {
        if (session?.user?.email) {
            const promoter = await fetchPromoter({
                email: session?.user?.email,
            });
            setPromoter(promoter);
            setLoading(false);
        }
    }, [session?.user?.email]);

    useEffect(() => {
        getPromoter();
    }, [getPromoter]);

    if (loading) {
        return <Box>Loading...</Box>;
    }

    if (!promoter) {
        return (
            <VStack gap={10} w="full" alignItems="center">
                <Heading>
                    Promoter profile for {session?.user?.name} is incomplete
                </Heading>
                <Text fontSize="2xl">Please complete it below</Text>
                <PromoterForm
                    onSuccess={(promoter) => {
                        if (promoter) {
                            getPromoter();
                        }
                    }}
                    defaultValues={{
                        name: session?.user?.name || "",
                        city: "",
                        state: "",
                        country: "",
                        images: [],
                        email: session?.user?.email || "",
                    }}
                />
            </VStack>
        );
    }

    return <Box>Promoter Dashboard</Box>;
};

export default PromoterDashboard;
