"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import EventCard from "@/app/components/EventCard";
import { EventDetails } from "@/types";
import { fetchEvent } from "@/bff";
import { Center, Heading } from "@chakra-ui/react";
import PageLoading from "@/app/components/PageLoading";

interface Props {}

const Event = ({}: Props) => {
    const [loading, setLoading] = React.useState(true);
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = React.useState<EventDetails | null>(
        null
    );

    useEffect(() => {
        if (eventId) {
            getEventDetails();
        }
    }, [eventId]);

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
                <EventCard eventDetails={eventDetails} />
            ) : (
                <Center w="full" h="80vh">
                    <Heading>No Event details</Heading>
                </Center>
            )}
        </>
    );
};

export default Event;
