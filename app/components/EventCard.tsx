import React from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    HStack,
    Stack,
    StackDivider,
} from "@chakra-ui/react";
import { EventDetails, FirebaseImageBlob } from "@/types";
import { formatDateTime } from "@/utils";
import "react-multi-carousel/lib/styles.css";
import EventCardDetail from "./EventCardDetail";
import ImageCarousel from "./ImageCarousel";

type EventCardProps = {
    eventDetails: EventDetails;
    canEdit?: boolean;
    onEditClick?: () => void;
    images?: FirebaseImageBlob[];
};

const EventCard = ({
    eventDetails,
    canEdit,
    onEditClick,
    images,
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
                        <ImageCarousel
                            carouselImgHeight={70}
                            mainImgHeight={400}
                            factors={{
                                largeDesk: 100,
                                desk: 100,
                                tab: 100,
                                mob: 100,
                            }}
                            images={images}
                        />
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
                            {/* TODO - Url shows promoters email address */}
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
