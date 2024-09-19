"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Heading,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fetchPromoter } from "@/bff";
import { Promoter } from "@prisma/client";
import PromoterForm from "@/app/components/PromoterForm";
import { getFirebaseImageBlob } from "@/firebase/functions";
import { FirebaseImageBlob } from "@/types";
import PromoterProfile from "@/app/components/PromoterProfile";
import AddEventModal from "@/app/components/AddEventModal";

interface Props {}

const PromoterDashboard = ({}: Props) => {
    const { data: session } = useSession();
    const [promoter, setPromoter] = useState<Promoter | null>(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<FirebaseImageBlob[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const getPromoter = useCallback(async () => {
        if (session?.user?.email) {
            const promoter = await fetchPromoter({
                email: session?.user?.email,
            });

            if (promoter) {
                const imageUrls = await Promise.all(
                    promoter.imageIds.map(async (imageId) => {
                        const blob = await getFirebaseImageBlob(
                            "promoterImages",
                            `${promoter?.email}/${imageId}`
                        );
                        return {
                            blob: blob?.blob,
                            name: blob?.name.replace(`${promoter?.email}/`, ""),
                        };
                    })
                );

                setImages(
                    imageUrls.filter(
                        (img) =>
                            img.blob !== undefined && img.name !== undefined
                    ) as FirebaseImageBlob[]
                );
            }
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
                        email: session?.user?.email || "",
                    }}
                />
            </VStack>
        );
    }

    return (
        <VStack gap={10}>
            <PromoterProfile
                promoter={promoter}
                images={images}
                onGetPromoter={getPromoter}
            />
            <Card w="full">
                <CardHeader>
                    <Box position="relative">
                        <Button
                            onClick={onOpen}
                            right={0}
                            top={0}
                            variant="link"
                            position="absolute"
                        >
                            Add Event
                        </Button>
                        <Heading size="md">Events</Heading>
                    </Box>
                </CardHeader>
            </Card>
            <AddEventModal
                promoterId={promoter.id}
                isOpen={isOpen}
                onClose={onClose}
            />
        </VStack>
    );
};

export default PromoterDashboard;
