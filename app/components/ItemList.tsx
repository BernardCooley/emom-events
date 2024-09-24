import React, { useEffect } from "react";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    SimpleGrid,
    Text,
    VStack,
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
    columns?: { [key: string]: number };
    overflowY?: "hidden" | "scroll";
    onHover?: (id: string) => void;
    itemHoveredId?: string;
    isMarkerHovered?: boolean;
}

const ItemList = ({
    data,
    page,
    fields,
    title,
    columns = { base: 1, md: 2, lg: 3 },
    overflowY = "hidden",
    onHover,
    itemHoveredId = "",
    isMarkerHovered = false,
}: Props) => {
    const router = useRouter();

    useEffect(() => {
        if (itemHoveredId && isMarkerHovered) {
            const element = document.getElementById(itemHoveredId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [itemHoveredId]);

    const selectedStyles = {
        cursor: "pointer",
        shadow: "lg",
        bg: "gray.50",
        outline: "1px solid",
        outlineColor: "gray.700",
    };

    return (
        <VStack
            p={4}
            overflowY={overflowY}
            overflowX="hidden"
            h="full"
            w="full"
        >
            {title && (
                <Heading size="lg" mb={4}>
                    {capitalizeFirstLetter(title)}
                </Heading>
            )}
            {data.length > 0 ? (
                <SimpleGrid w="full" spacing={4} columns={columns}>
                    {data.map((item) => (
                        <Card
                            sx={itemHoveredId === item.id ? selectedStyles : {}}
                            id={item.id}
                            onClick={() => router.push(`/${page}/${item.id}`)}
                            key={item.id}
                            onMouseEnter={() => onHover && onHover(item.id)}
                            _hover={selectedStyles}
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
            ) : (
                <Heading pt={20}>No Events found</Heading>
            )}
        </VStack>
    );
};

export default ItemList;
