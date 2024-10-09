"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import PageLoading from "@/app/components/PageLoading";
import { fetchVenue } from "@/bff";
import { VenueDetails } from "@/types";
import ItemList from "@/app/components/ItemList";

interface Props {}

const Venue = ({}: Props) => {
    const [loading, setLoading] = useState(true);
    const { venueId } = useParams();
    const [venue, setVenue] = useState<VenueDetails | null>(null);

    useEffect(() => {
        getPromoter();
    }, [venueId]);

    const getPromoter = async () => {
        if (venueId) {
            const venue = await fetchVenue({
                id: venueId as string,
            });
            if (venue) {
                setVenue(venue);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    const getLocation = () => {
        const locationParts = [
            venue?.city,
            venue?.state,
            venue?.country,
            venue?.postcodeZip,
        ].filter(Boolean);

        return locationParts.join(", ");
    };

    if (loading) {
        return <PageLoading />;
    }

    return (
        <>
            {venue && (
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
                                <Heading variant="section-title">
                                    {venue.name} Profile
                                </Heading>
                            </HStack>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <Flex width="full" direction="column" gap={10}>
                                <SimpleGrid columns={[1, 1, 4]} gap={[6, 6, 0]}>
                                    <VStack alignItems="flex-start">
                                        <Text fontWeight={700}>Name</Text>
                                        <Text>{venue.name}</Text>
                                    </VStack>
                                    <VStack alignItems="flex-start">
                                        <Text fontWeight={700}>Location</Text>
                                        <Text>{getLocation()}</Text>
                                    </VStack>
                                </SimpleGrid>
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
                                <Heading variant="section-title">
                                    Events
                                </Heading>
                            </Box>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <ItemList page="events" events={venue.events} />
                        </CardBody>
                    </Card>
                </VStack>
            )}
        </>
    );
};

export default Venue;
