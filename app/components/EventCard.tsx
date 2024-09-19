import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import { formatDateTime } from "@/utils";
import { getFirebaseImageURL } from "@/firebase/functions";

type EventCardProps = {
    eventDetails: EventDetails | null;
};

const EventCard = ({ eventDetails }: EventCardProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    type DetailProps = {
        title: string;
        value: string;
        href?: string;
    };

    useEffect(() => {
        if (eventDetails && eventDetails.imageIds.length > 0) {
            getImage(eventDetails.imageIds[0]);
        }
    }, [eventDetails]);

    const getImage = async (imageId: string) => {
        const image = await getFirebaseImageURL(
            "eventImages",
            `${eventDetails?.id}/${imageId}`
        );
        if (image) {
            setImageUrl(image);
        }
    };

    const Detail = ({ title, value, href }: DetailProps) => {
        return (
            <Box>
                <Heading size="xs" textTransform="uppercase">
                    {title}
                </Heading>
                {href ? (
                    <Link href={href}>
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
        <>
            {eventDetails ? (
                <Card>
                    <CardHeader>
                        <Heading size="md">{eventDetails.name}</Heading>
                    </CardHeader>

                    <CardBody>
                        <Flex gap={8} wrap="wrap" alignItems="flex-start">
                            <Center
                                mb={6}
                                w={["full", "60%", "50%", "30%", "30%"]}
                            >
                                {imageUrl && imageUrl.length > 0 && (
                                    <Image
                                        src={imageUrl || ""}
                                        alt="Green double couch with wooden legs"
                                        borderRadius="lg"
                                    />
                                )}
                            </Center>
                            <Stack
                                w="60%"
                                divider={<StackDivider />}
                                spacing="4"
                            >
                                <Detail
                                    title="Name"
                                    value={eventDetails.name || ""}
                                />
                                <Detail
                                    href={`/venues/${eventDetails.venue.id}`}
                                    title="Venue"
                                    value={
                                        [
                                            eventDetails.venue.name,
                                            eventDetails.venue.city,
                                            eventDetails.venue.country,
                                        ].join(", ") || ""
                                    }
                                />
                                <Detail
                                    title="From"
                                    value={formatDateTime(
                                        eventDetails.timeFrom
                                    )}
                                />
                                {eventDetails.timeTo && (
                                    <Detail
                                        title="To"
                                        value={formatDateTime(
                                            eventDetails.timeTo
                                        )}
                                    />
                                )}
                                {/* TODO - Url shows promoters email address */}
                                <Detail
                                    title="Organiser/Promoter"
                                    value={eventDetails.promoter.name || ""}
                                    href={`/promoters/${eventDetails.promoter.id}`}
                                />
                                <Detail
                                    title="Description"
                                    value={eventDetails.description || ""}
                                />
                                {eventDetails.lineup &&
                                    eventDetails.lineup.length > 0 && (
                                        <Detail
                                            title="Lineup"
                                            value={
                                                eventDetails.lineup.join(
                                                    ", "
                                                ) || ""
                                            }
                                        />
                                    )}
                            </Stack>
                        </Flex>
                    </CardBody>
                </Card>
            ) : null}
        </>
    );
};

export default EventCard;
