import React, { useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { EventDetails } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/utils";

interface Props {
    events: EventDetails[];
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
            {events.length > 0 ? (
                <SimpleGrid w="full" spacing={4} columns={columns}>
                    {events.map((item) => {
                        return (
                            <Card
                                sx={
                                    itemHoveredId === item.id
                                        ? selectedStyles
                                        : {}
                                }
                                id={item.id}
                                onClick={() =>
                                    router.push(`/${page}/${item.id}`)
                                }
                                key={item.id}
                                onMouseEnter={() => onHover && onHover(item.id)}
                                _hover={selectedStyles}
                                transition="transform 0.2s"
                            >
                                <CardHeader>
                                    <Heading size="md">{item.name}</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Divider my={2} />
                                    <Text pt="2" fontSize="sm">
                                        {item.name}
                                    </Text>
                                    <Divider my={2} />
                                    <Text pt="2" fontSize="sm">
                                        {item.promoter?.name}
                                    </Text>
                                </CardBody>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            ) : (
                <Heading pt={20}>
                    {pathname ? (
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
