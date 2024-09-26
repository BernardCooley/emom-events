import React from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Link,
    Stack,
    StackDivider,
    Text,
    VStack,
} from "@chakra-ui/react";
import { EventDetails, FirebaseImageBlob } from "@/types";
import { formatDateTime, getUrlFromBlob } from "@/utils";
import "react-multi-carousel/lib/styles.css";
import EventCardDetail from "./EventCardDetail";
import { MdIosShare } from "react-icons/md";

type EventCardProps = {
    eventDetails: EventDetails;
    canEdit?: boolean;
    onEditClick?: () => void;
    image: FirebaseImageBlob | null;
    onShareClick: () => void;
};

const EventCard = ({
    eventDetails,
    canEdit,
    onEditClick,
    image,
    onShareClick,
}: EventCardProps) => {
    const {
        name,
        venue,
        timeFrom,
        timeTo,
        promoter,
        description,
        lineup,
        websites,
        preBookEmail,
    } = eventDetails || {};

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
                        <VStack
                            h="full"
                            justifyContent="space-between"
                            alignItems="start"
                            position="relative"
                            w="300px"
                        >
                            {image && (
                                <Image
                                    src={getUrlFromBlob(image)}
                                    alt="main image"
                                    borderRadius="lg"
                                />
                            )}
                            <IconButton
                                mt={2}
                                h="44px"
                                w="36px"
                                minW="unset"
                                aria-label="Search"
                                bg="transparent"
                                icon={<MdIosShare fontSize="38px" />}
                                onClick={onShareClick}
                            />
                        </VStack>
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
                                value={formatDateTime(timeFrom!)}
                            />
                            {timeTo && (
                                <EventCardDetail
                                    title="Date/Time To"
                                    value={formatDateTime(timeTo)}
                                />
                            )}
                            <EventCardDetail
                                title="Host"
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
                            {websites && websites.length > 0 && (
                                <VStack gap={0} w="full" alignItems="start">
                                    <Heading
                                        size="xs"
                                        textTransform="uppercase"
                                    >
                                        {`Website${
                                            websites.length > 1 ? "s" : ""
                                        }`}
                                    </Heading>
                                    {websites.map((website) => (
                                        <Link
                                            key={website}
                                            href={website}
                                            isExternal
                                        >
                                            <Text pt="2" fontSize="sm">
                                                {website}
                                            </Text>
                                        </Link>
                                    ))}
                                </VStack>
                            )}
                            {preBookEmail.length > 0 && (
                                <EventCardDetail
                                    title="Pre-Book Email"
                                    value={preBookEmail}
                                    href={`mailto:${preBookEmail}`}
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
