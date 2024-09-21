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
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fetchPromoter } from "@/bff";
import { Event } from "@prisma/client";
import PromoterForm from "@/app/components/PromoterForm";
import { getFirebaseImageBlob } from "@/firebase/functions";
import { FirebaseImageBlob, PromoterDetails } from "@/types";
import PromoterProfile from "@/app/components/PromoterProfile";
import AddEventModal from "@/app/components/AddEventModal";
import ItemList from "@/app/components/ItemList";

interface Props {}

const PromoterDashboard = ({}: Props) => {
    const toast = useToast();
    const { data: session } = useSession();
    const [promoter, setPromoter] = useState<PromoterDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState<FirebaseImageBlob | null>(
        null
    );
    const { isOpen, onOpen, onClose } = useDisclosure();

    const getPromoter = useCallback(async () => {
        if (session?.user?.email) {
            const promoter = await fetchPromoter({
                email: session?.user?.email,
            });

            if (promoter && promoter?.imageIds.length > 0) {
                const imageBlob = await getFirebaseImageBlob(
                    `promoterImages/${promoter?.email}/${promoter.imageIds[0]}`,
                    promoter.imageIds[0]
                );

                if (imageBlob) {
                    setProfileImage(imageBlob);
                }
            } else {
                setProfileImage(null);
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
                    existingProfileImage={profileImage}
                    onFail={() => {
                        toast({
                            title: "Failed to update your details. Please try again later.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }}
                    onSuccess={(promoter) => {
                        if (promoter) {
                            toast({
                                title: "Your details have been updated.",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                            });
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

    const fields = [
        "description",
        "timeFrom",
        "timeTo",
    ] satisfies (keyof Event)[];

    return (
        <VStack gap={10}>
            <PromoterProfile
                promoter={promoter}
                profileImage={profileImage}
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
                        <ItemList
                            page="events"
                            fields={fields}
                            data={promoter.events}
                        />
                    </Box>
                </CardHeader>
            </Card>
            <AddEventModal
                onFail={() => {
                    toast({
                        title: "Failed to add event. Please try again later.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }}
                onSuccess={() => {
                    toast({
                        title: "Event created.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    getPromoter();
                }}
                promoterId={promoter.id}
                isOpen={isOpen}
                onClose={onClose}
            />
        </VStack>
    );
};

export default PromoterDashboard;
