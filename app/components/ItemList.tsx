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
import { Promoter, Venue, Event } from "@/types";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/utils";

interface Props {
    data: Event[] | Venue[] | Promoter[];
    page: string;
    fields?: (keyof Event)[] | (keyof Venue)[] | (keyof Promoter)[];
}

const ItemList = ({ data, page, fields }: Props) => {
    const router = useRouter();

    return (
        <Box>
            <Heading size="lg" mb={4}>
                {capitalizeFirstLetter(page)}
            </Heading>
            <SimpleGrid spacing={4} columns={{ base: 1, md: 2, lg: 3 }}>
                {data.map((item) => (
                    <Card
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
