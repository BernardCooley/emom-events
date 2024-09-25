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
import { getUrlFromBlob } from "@/utils";
import defaultSEO from "../../../../next-seo.config";
import JsonLd from "@/app/components/jsonld";
import ShareModal from "@/app/components/ShareModal";

interface Props {}

const Event = ({}: Props) => {
    const { updateCurrentEventId } = useEventContext();
    const { data: session } = useSession();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isShareModalOpen,
        onOpen: onShareModalOpen,
        onClose: onShareModalClose,
    } = useDisclosure();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
    const [eventImage, setEventImage] = useState<FirebaseImageBlob | null>(
        null
    );

    const {
        name,
        timeFrom,
        timeTo,
        description,
        promoter,
        venue,
        lineup,
        websites,
        preBookEmail,
    } = eventDetails || {};

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

    const jsonLd = {
        "@context": "http://schema.org",
        "@type": "VideoObject",
        image: eventImage ? getUrlFromBlob(eventImage) : "",
        name: name,
        description: description ? description : "Event from Emom",
        publisher: {
            "@type": "Organization",
            name: "EMOM",
        },
        isAccessibleForFree: true,
        url: `${defaultSEO.openGraph.url}/events/${eventId}`,
        thumbnailUrl: eventImage ? getUrlFromBlob(eventImage) : "",
        contentUrl: `${defaultSEO.openGraph.url}/events/${eventId}`,
    };

    return (
        <>
            {name &&
            venue &&
            timeFrom &&
            description &&
            promoter &&
            eventDetails ? (
                <>
                    <JsonLd data={jsonLd} />
                    <ShareModal
                        eventImage={eventImage}
                        event={eventDetails}
                        isOpen={isShareModalOpen}
                        onClose={onShareModalClose}
                    />
                    <AddEventModal
                        existingEventImage={eventImage}
                        eventId={eventId as string}
                        defaultValues={{
                            name: name,
                            venue: {
                                id: venue.id,
                                name: venue.name,
                                address: venue.address,
                                city: venue.city,
                                state: venue.state,
                                country: venue.country,
                                postcodeZip: venue.postcodeZip,
                                latitude: venue.latitude,
                                longitude: venue.longitude,
                            },
                            timeFrom: timeFrom,
                            timeTo: timeTo !== undefined ? timeTo : "",
                            description: description,
                            lineup: lineup || [],
                            imageId: eventImage?.name || "",
                            venueSearchTerm: "",
                            artist: "",
                            googlePlaceSearch: "",
                            websites: websites || [],
                            website: "",
                            preBookAvailable:
                                preBookEmail && preBookEmail.length > 0
                                    ? true
                                    : false,
                            contactEmail: preBookEmail || "",
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
                        onShareClick={onShareModalOpen}
                        image={eventImage}
                        onEditClick={onOpen}
                        canEdit={promoter.email === session?.user?.email}
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
