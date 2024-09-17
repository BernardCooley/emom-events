import React from "react";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Center,
    Flex,
    Heading,
    Image,
    Stack,
    StackDivider,
    Text,
} from "@chakra-ui/react";
import { EventDetails } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

type EventCardProps = {
    eventDetails: EventDetails;
};

const EventCard = ({ eventDetails }: EventCardProps) => {
    type DetailProps = {
        title: string;
        value: string;
        link?: string;
    };

    const Detail = ({ title, value, link }: DetailProps) => {
        return (
            <Box>
                <Heading size="xs" textTransform="uppercase">
                    {title}
                </Heading>
                {link ? (
                    <Link href={link}>
                        <Text pt="2" fontSize="sm">
                            {value}
                        </Text>
                    </Link>
                ) : (
                    <Text pt="2" fontSize="sm">
                        {value}
                    </Text>
                )}
            </Box>
        );
    };

    return (
        <Card>
            <CardHeader>
                <Heading size="md">{eventDetails.title}</Heading>
            </CardHeader>

            <CardBody>
                <Flex gap={8} wrap="wrap" alignItems="flex-start">
                    <Center mb={6} w={["full", "60%", "50%", "30%", "30%"]}>
                        <Image
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
                            alt="Green double couch with wooden legs"
                            borderRadius="lg"
                        />
                    </Center>
                    <Stack w="60%" divider={<StackDivider />} spacing="4">
                        <Detail
                            title="Description"
                            value={eventDetails.description || ""}
                        />
                        <Detail
                            title="Venue"
                            value={eventDetails.venueDetails?.name || ""}
                        />
                        <Detail
                            title="Promoter"
                            value={eventDetails.promoterDetails?.name || ""}
                            link={`/promoters/${eventDetails.promoterId}`}
                        />
                        <Detail
                            title="From"
                            value={
                                format(
                                    new Date(eventDetails.timeFrom || ""),
                                    "MMMM dd, yyyy HH:mm"
                                ) || ""
                            }
                        />
                        <Detail
                            title="To"
                            value={
                                format(
                                    new Date(eventDetails.timeTo || ""),
                                    "MMMM dd, yyyy HH:mm"
                                ) || ""
                            }
                        />
                        <Detail
                            title="Description"
                            value={eventDetails.description || ""}
                        />
                        <Detail
                            title="Venue"
                            value={eventDetails.venueDetails?.name || ""}
                        />
                        <Detail
                            title="Promoter"
                            value={eventDetails.promoterDetails?.name || ""}
                        />
                        <Detail
                            title="From"
                            value={
                                format(
                                    new Date(eventDetails.timeFrom || ""),
                                    "MMMM dd, yyyy HH:mm"
                                ) || ""
                            }
                        />
                        <Detail
                            title="To"
                            value={
                                format(
                                    new Date(eventDetails.timeTo || ""),
                                    "MMMM dd, yyyy HH:mm"
                                ) || ""
                            }
                        />
                    </Stack>
                </Flex>
            </CardBody>
        </Card>
    );
};

export default EventCard;
