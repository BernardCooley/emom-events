"use client";

import React, { useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { EventDetails } from "@/types";
import { fetchEvents } from "@/bff";
import ItemList from "@/app/components/ItemList";
import { useEventContext } from "@/context/eventContext";
import PageLoading from "@/app/components/PageLoading";

const fields = [
    "description",
    "timeFrom",
    "timeTo",
] satisfies (keyof EventDetails)[];

interface Props {}

const Page = ({}: Props) => {
    const [loading, setLoading] = useState(true);
    const { events, updateEvents } = useEventContext();

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        const events = await fetchEvents();
        if (events) {
            updateEvents([
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
                ...events,
            ]);
            setLoading(false);
        }
    };

    if (loading) {
        return <PageLoading />;
    }

    return (
        <Flex direction="column" gap={6}>
            <Heading>Events</Heading>
            <ItemList page="events" fields={fields} data={events} />
        </Flex>
    );
};

export default Page;
