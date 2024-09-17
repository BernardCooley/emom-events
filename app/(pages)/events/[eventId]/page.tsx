"use client";

import React from "react";
import { useParams } from "next/navigation";
import { events, promoters, venues } from "@/data/events";
import EventCard from "@/app/components/EventCard";
import { EventDetails } from "@/types";

interface Props {}

const Event = ({}: Props) => {
    const { eventId } = useParams();

    const eventDetails = events.find((event) => event.id === eventId);
    const promoterDetails = promoters.find(
        (promoter) => promoter.id === eventDetails?.promoterId
    );
    const venueDetails = venues.find(
        (venue) => venue.id === eventDetails?.venueId
    );

    const fullEventDetails = {
        ...eventDetails,
        promoterDetails: promoterDetails ? promoterDetails : null,
        venueDetails: venueDetails ? venueDetails : null,
    } as EventDetails;

    return <EventCard eventDetails={fullEventDetails} />;
};

export default Event;
