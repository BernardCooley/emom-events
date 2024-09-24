import React, { useState } from "react";
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
    useToast,
    VStack,
} from "@chakra-ui/react";
import PromoterForm from "./PromoterForm";
import { FirebaseImageBlob, PromoterDetails } from "@/types";
import { getUrlFromBlob } from "@/utils";

interface Props {
    promoter: PromoterDetails;
    profileImage: FirebaseImageBlob | null;
    onGetPromoter: () => void;
}

const PromoterProfile = ({ promoter, profileImage, onGetPromoter }: Props) => {
    const { city, state, country, name, email } = promoter;
    const toast = useToast();
    const [isEditing, setEditing] = useState(false);

    const getLocation = () => {
        const locationParts = [city, state, country].filter(Boolean);

        return locationParts.join(", ");
    };

    return (
        <>
            <Card w="full">
                <CardHeader>
                    <HStack
                        w="full"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading w="fit-content" size="md">
                            Profile
                        </Heading>

                        <Button
                            onClick={() => setEditing(!isEditing)}
                            variant="link"
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </Button>
                    </HStack>
                </CardHeader>
                <Divider />
                <CardBody>
                    {!isEditing && (
                        <Flex width="full" direction="column" gap={10}>
                            <SimpleGrid columns={[1, 1, 3]} gap={[6, 6, 0]}>
                                <VStack alignItems="flex-start">
                                    <Text fontWeight={700}>Name</Text>
                                    <Text>{name}</Text>
                                </VStack>
                                <VStack alignItems="flex-start">
                                    <Text fontWeight={700}>Location</Text>
                                    <Text>{getLocation()}</Text>
                                </VStack>
                                <VStack alignItems="flex-start">
                                    <Text fontWeight={700}>Email</Text>
                                    <Text>{email}</Text>
                                </VStack>
                            </SimpleGrid>
                            {profileImage && (
                                <Box position="relative" w="200px">
                                    <Image
                                        src={getUrlFromBlob(profileImage)}
                                        alt=""
                                    />
                                </Box>
                            )}
                        </Flex>
                    )}
                    <Flex w="full" alignItems="center" direction="column">
                        {isEditing && (
                            <PromoterForm
                                onCancel={() => setEditing(false)}
                                existingProfileImage={profileImage}
                                isEditing={true}
                                onSuccess={(promoter) => {
                                    if (promoter) {
                                        toast({
                                            title: "Your details have been updated.",
                                            status: "success",
                                            duration: 5000,
                                            isClosable: true,
                                        });
                                        onGetPromoter();
                                        setEditing(false);
                                    }
                                }}
                                onFail={() => {
                                    toast({
                                        title: "Failed to update your details. Please try again later.",
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                }}
                                defaultValues={{
                                    name,
                                    city,
                                    state,
                                    country,
                                    email,
                                }}
                            />
                        )}
                    </Flex>
                </CardBody>
            </Card>
        </>
    );
};

export default PromoterProfile;
