import React, { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import ImageGrid from "./ImageGrid";
import PromoterForm from "./PromoterForm";
import { FirebaseImageBlob, PromoterDetails } from "@/types";

interface Props {
    promoter: PromoterDetails;
    images: FirebaseImageBlob[];
    onGetPromoter: () => void;
}

const PromoterProfile = ({ promoter, images, onGetPromoter }: Props) => {
    const toast = useToast();
    const [isEditing, setEditing] = useState(false);

    const getLocation = () => {
        const locationParts = [
            promoter.city,
            promoter.state,
            promoter.country,
        ].filter(Boolean);

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
                            <ImageGrid
                                columns={[2, 3, 5, 6, 8]}
                                images={images}
                            />
                        </Flex>
                    )}
                </CardBody>
                <CardFooter>
                    <Flex w="full" alignItems="center" direction="column">
                        {isEditing && (
                            <PromoterForm
                                existingImages={images}
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
                                    name: promoter.name || "",
                                    city: promoter.city || "",
                                    state: promoter.state || "",
                                    country: promoter.country || "",
                                    email: promoter.email || "",
                                }}
                            />
                        )}
                    </Flex>
                </CardFooter>
            </Card>
        </>
    );
};

export default PromoterProfile;
