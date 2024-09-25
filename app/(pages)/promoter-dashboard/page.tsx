"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import PromoterForm from "@/app/components/PromoterForm";
import { getFirebaseImageBlob } from "@/firebase/functions";
import { FirebaseImageBlob } from "@/types";
import PromoterProfile from "@/app/components/PromoterProfile";
import AddEventModal from "@/app/components/AddEventModal";
import ItemList from "@/app/components/ItemList";
import { usePromoterContext } from "@/context/promoterContext";
import { fetchPromoter } from "@/bff";

interface Props {}

const PromoterDashboard = ({}: Props) => {
    const { promoter, updatePromoter } = usePromoterContext();
    const toast = useToast();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState<FirebaseImageBlob | null>(
        null
    );
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (promoter) {
            setLoading(false);
            getProfileImage();
        }
    }, [promoter]);

    const getPromoter = useCallback(async () => {
        if (session?.user?.email) {
            const promoter = await fetchPromoter({
                email: session?.user?.email,
            });

            updatePromoter(promoter);
        }
    }, [session?.user?.email]);

    const getProfileImage = async () => {
        if (promoter && promoter.imageIds.length > 0) {
            const imageBlob = await getFirebaseImageBlob(
                `promoterImages/${promoter.id}/${promoter.imageIds[0]}`,
                promoter.imageIds[0]
            );

            if (imageBlob) {
                setProfileImage(imageBlob);
            }
        }
    };

    if (loading) {
        return <Box>Loading...</Box>;
    }

    if (!promoter) {
        return (
            <VStack gap={10} w="full" alignItems="center">
                <Heading>
                    Host profile for {session?.user?.name} is incomplete
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

    return (
        <VStack gap={6}>
            <PromoterProfile
                promoter={promoter}
                profileImage={profileImage}
                onGetPromoter={getPromoter}
            />
            <Card
                shadow="lg"
                border="1px solid"
                borderColor="gray.200"
                w="full"
            >
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
                <Divider />
                <CardBody>
                    <ItemList
                        onAddEventClick={onOpen}
                        page="events"
                        events={promoter.events}
                    />
                </CardBody>
            </Card>

            <AddEventModal
                existingEventImage={null}
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
