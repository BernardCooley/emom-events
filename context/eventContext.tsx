"use client";

import { EventDetails } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface EventContextProps {
    events: EventDetails[] | null;
    updateEvents: (events: EventDetails[] | null) => void;
    skip: number;
    updateSkip: (skip: number) => void;
    currentEventId: string | null;
    updateCurrentEventId: (event: string) => void;
}

export const EventContext = createContext<EventContextProps | null>(null);

export const useEventContext = () => {
    const eventContext = useContext(EventContext);

    if (!eventContext) {
        throw new Error(
            "useEventContext has to be used within <EventContext.Provider>"
        );
    }

    return eventContext;
};

export const EventContextProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<EventDetails[] | null>(null);
    const [skip, setSkip] = useState<number>(0);
    const [currentEventId, setCurrentEvent] = useState<string | null>(null);

    const updateEvents = (events: EventDetails[] | null) => {
        setEvents(events);
    };

    const updateSkip = (skip: number) => {
        setSkip(skip);
    };

    const updateCurrentEventId = (event: string) => {
        setCurrentEvent(event);
    };

    return (
        <EventContext.Provider
            value={{
                events,
                updateEvents,
                skip,
                updateSkip,
                currentEventId,
                updateCurrentEventId,
            }}
        >
            {children}
        </EventContext.Provider>
    );
};
