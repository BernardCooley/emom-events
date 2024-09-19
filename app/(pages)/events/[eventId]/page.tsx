"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import EventCard from "@/app/components/EventCard";
import { EventDetails } from "@/types";
import { fetchEvent } from "@/bff";

interface Props {}

const Event = ({}: Props) => {
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
        }
    };

    return <EventCard eventDetails={eventDetails} />;
};

export default Event;
