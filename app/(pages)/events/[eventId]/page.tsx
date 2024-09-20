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

    const {
        imageIds,
        name,
        timeFrom,
        timeTo,
        description,
        promoter,
        venue,
        lineup,
        websites,
    } = eventDetails || {};

    useEffect(() => {
        if (eventId) {
            getEventDetails();
        }
    }, [eventId]);

    useEffect(() => {
        getImages();
    }, [eventDetails]);

    const getImages = async () => {
        if (imageIds) {
            const imageBlobs = await Promise.all(
                imageIds.map((imageId) =>
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
            {name &&
            venue &&
            timeFrom &&
            description &&
            promoter &&
            eventDetails ? (
                <>
                    <AddEventModal
                        existingImages={images}
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
                            imageIds: imageIds !== undefined ? imageIds : [],
                            venueSearchTerm: "",
                            artist: "",
                            websites: websites || [],
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
                        images={images}
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
