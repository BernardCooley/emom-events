import React from "react";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import { EventDetails, VenueDetails, PromoterDetails } from "@/types";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/utils";

interface Props {
    data: EventDetails[] | VenueDetails[] | PromoterDetails[];
    title?: string;
    page: string;
    fields?:
        | (keyof EventDetails)[]
        | (keyof VenueDetails)[]
        | (keyof PromoterDetails)[];
}

const ItemList = ({ data, page, fields, title }: Props) => {
    const router = useRouter();

    return (
        <Box>
            {title && (
                <Heading size="lg" mb={4}>
                    {capitalizeFirstLetter(title)}
                </Heading>
            )}
            <SimpleGrid spacing={4} columns={{ base: 1, md: 2, lg: 3 }}>
                {data.map((item) => (
                    <Card
                        id={item.id}
                        onClick={() => router.push(`/${page}/${item.id}`)}
                        key={item.id}
                        _hover={{
                            transform: "scale(1.05)",
                            transition: "transform 0.2s",
                            cursor: "pointer",
                            shadow: "lg",
                            bg: "gray.50",
                            border: "2px solid gray.200",
                        }}
                        transition="transform 0.2s"
                    >
                        <CardHeader>
                            <Heading size="md">{item.name}</Heading>
                        </CardHeader>
                        <CardBody>
                            {fields?.map((field) => {
                                const fieldValue =
                                    item[field as keyof typeof item];
                                if (
                                    fieldValue &&
                                    (typeof fieldValue === "string" ||
                                        Array.isArray(fieldValue)) &&
                                    fieldValue.length > 0
                                ) {
                                    return (
                                        <Box key={field}>
                                            <Divider my={2} />
                                            <Text pt="2" fontSize="sm">
                                                {fieldValue}
                                            </Text>
                                        </Box>
                                    );
                                }
                                return null;
                            })}
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default ItemList;
