"use client";

import { EventDetails } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface EventContextProps {
    events: EventDetails[];
    updateEvents: (events: EventDetails[]) => void;
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
    const [events, setEvents] = useState<EventDetails[]>([]);

    const updateEvents = (events: EventDetails[]) => {
        setEvents(events);
    };

    return (
        <EventContext.Provider
            value={{
                events,
                updateEvents,
            }}
        >
            {children}
        </EventContext.Provider>
    );
};
