"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Flex,
    Heading,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fetchPromoter } from "@/bff";
import { Promoter } from "@prisma/client";
import PromoterForm from "@/app/components/PromoterForm";

interface Props {}

const PromoterDashboard = ({}: Props) => {
    const [editing, setEditing] = useState(false);
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

    const getLocation = () => {
        const locationParts = [
            promoter.city,
            promoter.state,
            promoter.country,
        ].filter(Boolean);

        return locationParts.join(", ");
    };

    return (
        <Box>
            <Card>
                <CardHeader>
                    <Box position="relative">
                        <Button
                            onClick={() => setEditing(!editing)}
                            right={0}
                            top={0}
                            variant="link"
                            position="absolute"
                        >
                            {editing ? "Cancel" : "Edit"}
                        </Button>
                        <Heading size="md">Profile</Heading>
                    </Box>
                </CardHeader>
                <Divider />
                <CardBody>
                    {!editing && (
                        <SimpleGrid columns={3}>
                            <VStack alignItems="flex-start">
                                <Text fontWeight={700}>Name</Text>
                                <Text>{promoter.name}</Text>
                            </VStack>
                            <VStack alignItems="flex-start">
                                <Text fontWeight={700}>Location</Text>
                                <Text>{getLocation()}</Text>
                            </VStack>
                            <VStack alignItems="flex-start">
                                <Text fontWeight={700}>Email</Text>
                                <Text>{promoter.email}</Text>
                            </VStack>
                        </SimpleGrid>
                    )}
                </CardBody>
                <CardFooter>
                    <Flex w="full" alignItems="center" direction="column">
                        {editing && (
                            <PromoterForm
                                isEditing={true}
                                onSuccess={(promoter) => {
                                    if (promoter) {
                                        getPromoter();
                                        setEditing(false);
                                    }
                                }}
                                defaultValues={{
                                    name: promoter.name || "",
                                    city: promoter.city || "",
                                    state: promoter.state || "",
                                    country: promoter.country || "",
                                    images: [],
                                    email: promoter.email || "",
                                }}
                            />
                        )}
                    </Flex>
                </CardFooter>
            </Card>
        </Box>
    );
};

export default PromoterDashboard;
