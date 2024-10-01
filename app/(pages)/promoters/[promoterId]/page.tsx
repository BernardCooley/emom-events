"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Heading,
    HStack,
    Image,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { fetchPromoterById } from "@/bff";
import { FirebaseImageBlob, PromoterDetails } from "@/types";
import { getFirebaseImageBlob } from "@/firebase/functions";
import { getUrlFromBlob } from "@/utils";
import ItemList from "@/app/components/ItemList";
import PageLoading from "@/app/components/PageLoading";

interface Props {}

const Promoter = ({}: Props) => {
    const [profileImage, setProfileImage] = useState<FirebaseImageBlob | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const { promoterId } = useParams();
    const [promoter, setPromoter] = useState<PromoterDetails | null>(null);

    useEffect(() => {
        getPromoter();
    }, [promoterId]);

    useEffect(() => {
        if (promoter) {
            getProfileImage();
        }
    }, [promoter]);

    const getPromoter = async () => {
        if (promoterId) {
            const promoter = await fetchPromoterById({
                id: promoterId as string,
            });
            if (promoter) {
                setPromoter(promoter);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    const getLocation = () => {
        const locationParts = [
            promoter?.city,
            promoter?.state,
            promoter?.country,
        ].filter(Boolean);

        return locationParts.join(", ");
    };

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
        return <PageLoading />;
    }

    return (
        <>
            {promoter && (
                <VStack gap={6}>
                    <Card
                        shadow="lg"
                        border="1px solid"
                        borderColor="gray.200"
                        w="full"
                    >
                        <CardHeader>
                            <HStack
                                w="full"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Heading w="fit-content" size="md">
                                    {promoter.name} Profile
                                </Heading>
                            </HStack>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <Flex width="full" direction="column" gap={10}>
                                <SimpleGrid columns={[1, 1, 4]} gap={[6, 6, 0]}>
                                    <VStack alignItems="flex-start">
                                        <Text fontWeight={700}>Name</Text>
                                        <Text>{promoter.name}</Text>
                                    </VStack>
                                    <VStack alignItems="flex-start">
                                        <Text fontWeight={700}>Location</Text>
                                        <Text>{getLocation()}</Text>
                                    </VStack>
                                    {promoter.showEmail && (
                                        <VStack alignItems="flex-start">
                                            <Text fontWeight={700}>Email</Text>
                                            <Text>{promoter.email}</Text>
                                        </VStack>
                                    )}
                                </SimpleGrid>
                                <Box position="relative" w="200px">
                                    <Image
                                        src={
                                            profileImage
                                                ? getUrlFromBlob(profileImage)
                                                : ""
                                        }
                                        alt=""
                                    />
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card
                        shadow="lg"
                        border="1px solid"
                        borderColor="gray.200"
                        w="full"
                    >
                        <CardHeader>
                            <Box position="relative">
                                <Heading size="md">Events</Heading>
                            </Box>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <ItemList page="events" events={promoter.events} />
                        </CardBody>
                    </Card>
                </VStack>
            )}
        </>
    );
};

export default Promoter;
