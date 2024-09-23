import React from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    HStack,
    Image,
    Stack,
    StackDivider,
} from "@chakra-ui/react";
import { EventDetails, FirebaseImageBlob } from "@/types";
import { formatDateTime, getUrlFromBlob } from "@/utils";
import "react-multi-carousel/lib/styles.css";
import EventCardDetail from "./EventCardDetail";

type EventCardProps = {
    eventDetails: EventDetails;
    canEdit?: boolean;
    onEditClick?: () => void;
    image: FirebaseImageBlob | null;
};

const EventCard = ({
    eventDetails,
    canEdit,
    onEditClick,
    image,
}: EventCardProps) => {
    const { name, venue, timeFrom, timeTo, promoter, description, lineup } =
        eventDetails || {};

    return (
        <>
            <Card>
                <CardHeader>
                    <HStack w="full" justifyContent="space-between">
                        <Heading size="lg">{name}</Heading>
                        {canEdit && (
                            <Button
                                right={0}
                                top={0}
                                onClick={onEditClick}
                                variant="link"
                            >
                                Edit Event
                            </Button>
                        )}
                    </HStack>
                </CardHeader>

                <CardBody>
                    <Flex
                        position="relative"
                        gap={8}
                        wrap="wrap"
                        alignItems="flex-start"
                    >
                        {image && (
                            <Box position="relative" w="300px">
                                <Image
                                    src={getUrlFromBlob(image)}
                                    alt="main image"
                                    borderRadius="lg"
                                />
                            </Box>
                        )}
                        <Stack w="60%" divider={<StackDivider />} spacing="4">
                            <EventCardDetail
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
                            <EventCardDetail
                                title="Date/Time From"
                                value={formatDateTime(timeFrom!!)}
                            />
                            {timeTo && (
                                <EventCardDetail
                                    title="Date/Time To"
                                    value={formatDateTime(timeTo)}
                                />
                            )}
                            <EventCardDetail
                                title="Organiser/Promoter"
                                value={promoter.name || ""}
                                href={`/promoters/${promoter.id}`}
                            />
                            <EventCardDetail
                                title="Description"
                                value={description || ""}
                            />
                            {lineup && lineup.length > 0 && (
                                <EventCardDetail
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
