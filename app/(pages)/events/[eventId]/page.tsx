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

interface Props {}

const Event = ({}: Props) => {
    const { data: session } = useSession();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [loading, setLoading] = React.useState(true);
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = React.useState<EventDetails | null>(
        null
    );
    const [images, setImages] = useState<FirebaseImageBlob[]>([]);

    useEffect(() => {
        if (eventId) {
            getEventDetails();
        }
    }, [eventId]);

    useEffect(() => {
        getImages();
    }, [eventDetails]);

    const getImages = async () => {
        if (eventDetails?.imageIds) {
            const imageBlobs = await Promise.all(
                eventDetails.imageIds.map((imageId) =>
                    getFirebaseImageBlob(
                        `eventImages/${eventId}/${imageId}`,
                        imageId
                    )
                )
            );

            setImages(
                imageBlobs.filter(
                    (img) => img?.blob !== undefined && img.name !== undefined
                ) as FirebaseImageBlob[]
            );
        }
    };

    const getEventDetails = async () => {
        if (eventId) {
            const eventDetails = await fetchEvent({
                eventId: eventId as string,
            });
            if (eventDetails) setEventDetails(eventDetails);
            setLoading(false);
        }
    };

    if (loading) return <PageLoading />;

    return (
        <>
            {eventDetails ? (
                <>
                    <AddEventModal
                        existingImages={images}
                        eventId={eventId as string}
                        defaultValues={{
                            name: eventDetails.name,
                            venue: {
                                name: eventDetails.venue.name,
                                address: eventDetails.venue.address,
                                city: eventDetails.venue.city,
                                state: eventDetails.venue.state,
                                country: eventDetails.venue.country,
                                postcodeZip: eventDetails.venue.postcodeZip,
                            },
                            timeFrom: eventDetails.timeFrom,
                            timeTo:
                                eventDetails.timeTo !== undefined
                                    ? eventDetails.timeTo
                                    : "",
                            description: eventDetails.description,
                            lineup: eventDetails.lineup || [],
                            imageIds:
                                eventDetails.imageIds !== undefined
                                    ? eventDetails.imageIds
                                    : [],
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
                        promoterId={eventDetails.promoter.id}
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                    <EventCard
                        images={images}
                        onEditClick={onOpen}
                        canEdit={
                            session?.user?.email === eventDetails.promoter.id
                        }
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
