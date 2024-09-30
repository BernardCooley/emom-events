import React, { useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    SimpleGrid,
    Skeleton,
    Text,
    VStack,
} from "@chakra-ui/react";
import { EventDetails } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { capitalizeFirstLetter, formatDateTime } from "@/utils";

interface Props {
    events: EventDetails[] | null;
    title?: string;
    page: string;
    columns?: { [key: string]: number };
    overflowY?: "hidden" | "scroll";
    onHover?: (id: string) => void;
    itemHoveredId?: string;
    isMarkerHovered?: boolean;
    onAddEventClick?: () => void;
}

const ItemList = ({
    events,
    page,
    title,
    columns = { base: 1, md: 2, lg: 3 },
    overflowY = "hidden",
    onHover,
    itemHoveredId = "",
    isMarkerHovered = false,
    onAddEventClick,
}: Props) => {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (itemHoveredId && isMarkerHovered) {
            const element = document.getElementById(itemHoveredId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
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

    if (!events) {
        return (
            <SimpleGrid w="full" spacing={4} columns={columns}>
                {[1, 2, 3, 4, 5, 6].map((item) => {
                    return (
                        <Skeleton
                            rounded="lg"
                            key={item}
                            isLoaded={events ? true : false}
                            w="full"
                            h="200px"
                        />
                    );
                })}
            </SimpleGrid>
        );
    }

    return (
        <VStack p={4} overflowY={overflowY} overflowX="hidden" w="full">
            {title && (
                <Heading size="lg" mb={4}>
                    {capitalizeFirstLetter(title)}
                </Heading>
            )}
            {events.length > 0 ? (
                <SimpleGrid w="full" spacing={4} columns={columns}>
                    {events.map((item) => {
                        return (
                            <Card
                                shadow="md"
                                border="1px solid"
                                borderColor="gray.100"
                                sx={
                                    itemHoveredId === item.id
                                        ? selectedStyles
                                        : {}
                                }
                                key={item.id}
                                id={item.id}
                                onClick={() =>
                                    router.push(`/${page}/${item.id}`)
                                }
                                onMouseEnter={() => onHover && onHover(item.id)}
                                _hover={selectedStyles}
                                transition="transform 0.2s"
                            >
                                <CardHeader>
                                    <Heading userSelect="none" size="md">
                                        {item.name}
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    <Divider my={2} />
                                    <Text userSelect="none" fontSize="sm">
                                        {item.venue.name}
                                    </Text>
                                    <Divider my={2} />
                                    <Text userSelect="none" fontSize="sm">
                                        {item.promoter?.name}
                                    </Text>
                                    <Divider my={2} />
                                    <Text userSelect="none" fontSize="sm">
                                        {formatDateTime(item.timeFrom)}
                                    </Text>
                                </CardBody>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            ) : (
                <Heading pt={20}>
                    {pathname === "promoter-dashboard" ? (
                        <>
                            No Events. Click{" "}
                            <Button
                                onClick={onAddEventClick && onAddEventClick}
                                _hover={{
                                    color: "gray.700",
                                    textDecoration: "underline",
                                }}
                                position="relative"
                                top={-1}
                                fontSize="36px"
                                variant="unstyled"
                                color="#718096"
                            >
                                here
                            </Button>{" "}
                            to create your first event
                        </>
                    ) : (
                        "No Events found"
                    )}
                </Heading>
            )}
        </VStack>
    );
};

export default ItemList;
