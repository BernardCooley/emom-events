import React, { useState } from "react";
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
import ImageGrid from "./ImageGrid";
import PromoterForm from "./PromoterForm";
import { FirebaseImageBlob, PromoterDetails } from "@/types";

interface Props {
    promoter: PromoterDetails;
    images: FirebaseImageBlob[];
    onGetPromoter: () => void;
}

const PromoterProfile = ({ promoter, images, onGetPromoter }: Props) => {
    const [editing, setEditing] = useState(false);

    const getLocation = () => {
        const locationParts = [
            promoter.city,
            promoter.state,
            promoter.country,
        ].filter(Boolean);

        return locationParts.join(", ");
    };

    return (
        <Card w="full">
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
                        <ImageGrid columns={[2, 3, 5, 6, 8]} images={images} />
                    </Flex>
                )}
            </CardBody>
            <CardFooter>
                <Flex w="full" alignItems="center" direction="column">
                    {editing && (
                        <PromoterForm
                            existingImages={images}
                            isEditing={true}
                            onSuccess={(promoter) => {
                                if (promoter) {
                                    onGetPromoter();
                                    setEditing(false);
                                }
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
    );
};

export default PromoterProfile;
