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
    eventDetails: EventDetails;
};

const EventCard = ({ eventDetails }: EventCardProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    type DetailProps = {
        title: string;
        value: string;
        href?: string;
    };

    const {
        id,
        name,
        venue,
        timeFrom,
        timeTo,
        promoter,
        description,
        lineup,
        imageIds,
    } = eventDetails || {};

    useEffect(() => {
        getImage(imageIds[0]);
    }, [imageIds]);

    const getImage = async (imageId: string) => {
        const image = await getFirebaseImageURL(`eventImages/${id}/${imageId}`);
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
            <Card>
                <CardHeader>
                    <Heading size="md">{name}</Heading>
                </CardHeader>

                <CardBody>
                    <Flex gap={8} wrap="wrap" alignItems="flex-start">
                        <Center mb={6} w={["full", "60%", "50%", "30%", "30%"]}>
                            {imageUrl && imageUrl.length > 0 && (
                                <Image
                                    src={imageUrl || ""}
                                    alt="Green double couch with wooden legs"
                                    borderRadius="lg"
                                />
                            )}
                        </Center>
                        <Stack w="60%" divider={<StackDivider />} spacing="4">
                            <Detail title="Name" value={name || ""} />
                            <Detail
                                href={`/venues/${venue.id}`}
                                title="Venue"
                                value={
                                    [
                                        venue.name,
                                        venue.city,
                                        venue.country,
                                    ].join(", ") || ""
                                }
                            />
                            <Detail
                                title="From"
                                value={formatDateTime(timeFrom!!)}
                            />
                            {timeTo && (
                                <Detail
                                    title="To"
                                    value={formatDateTime(timeTo)}
                                />
                            )}
                            {/* TODO - Url shows promoters email address */}
                            <Detail
                                title="Organiser/Promoter"
                                value={promoter.name || ""}
                                href={`/promoters/${promoter.id}`}
                            />
                            <Detail
                                title="Description"
                                value={description || ""}
                            />
                            {lineup && lineup.length > 0 && (
                                <Detail
                                    title="Lineup"
                                    value={lineup.join(", ") || ""}
                                />
                            )}
                        </Stack>
                    </Flex>
                </CardBody>
            </Card>
        </>
    );
};

export default EventCard;
