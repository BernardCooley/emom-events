"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EventCard from "@/app/components/EventCard";
import { EventDetails, FirebaseImageBlob } from "@/types";
import { fetchEvent } from "@/bff";
import { Center, Heading, useDisclosure, useToast } from "@chakra-ui/react";
import PageLoading from "@/app/components/PageLoading";
import AddEventModal from "@/app/components/AddEventModal";
import { getFirebaseImageBlob } from "@/firebase/functions";
import { useSession } from "next-auth/react";
import { useEventContext } from "@/context/eventContext";

interface Props {}

const Event = ({}: Props) => {
    const { updateCurrentEventId } = useEventContext();
    const { data: session } = useSession();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [loading, setLoading] = React.useState(true);
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = React.useState<EventDetails | null>(
        null
    );
    const [eventImage, setEventImage] = useState<FirebaseImageBlob | null>(
        null
    );

    const { name, timeFrom, timeTo, description, promoter, venue, lineup } =
        eventDetails || {};

    useEffect(() => {
        if (eventId) {
            updateCurrentEventId(eventId as string);
            getEventDetails();
        }
    }, [eventId]);

    const getEventDetails = async () => {
        if (eventId) {
            const event = await fetchEvent({
                eventId: eventId as string,
            });

            if (event && event?.imageIds.length > 0) {
                const imageBlob = await getFirebaseImageBlob(
                    `eventImages/${eventId}/${event.imageIds[0]}`,
                    event.imageIds[0]
                );

                if (imageBlob) {
                    setEventImage(imageBlob);
                } else {
                    setEventImage(null);
                }
            } else {
                setEventImage(null);
            }

            setEventDetails(event);
            setLoading(false);
        }
    };

    if (loading) return <PageLoading />;

    return (
        <>
            {name &&
            venue &&
            timeFrom &&
            description &&
            promoter &&
            eventDetails ? (
                <>
                    <AddEventModal
                        existingEventImage={eventImage}
                        eventId={eventId as string}
                        defaultValues={{
                            name: name,
                            venue: {
                                name: venue.name,
                                address: venue.address,
                                city: venue.city,
                                state: venue.state,
                                country: venue.country,
                                postcodeZip: venue.postcodeZip,
                            },
                            timeFrom: timeFrom,
                            timeTo: timeTo !== undefined ? timeTo : "",
                            description: description,
                            lineup: lineup || [],
                            imageId: eventImage?.name || "",
                            venueSearchTerm: "",
                            artist: "",
                        }}
                        onFail={() => {
                            toast({
                                title: "Failed to update event. Please try again later.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                            });
                        }}
                        onSuccess={() => {
                            toast({
                                title: "Event updated.",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                            });
                            getEventDetails();
                        }}
                        promoterId={promoter.id}
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                    <EventCard
                        image={eventImage}
                        onEditClick={onOpen}
                        canEdit={session?.user?.email === promoter.id}
                        eventDetails={eventDetails}
                    />
                </>
            ) : (
                <Center w="full" h="80vh">
                    <Heading>No Event details</Heading>
                </Center>
            )}
        </>
    );
};

export default Event;
