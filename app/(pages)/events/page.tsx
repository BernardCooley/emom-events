"use client";

import React, { useEffect, useRef, useState } from "react";
import { Flex, Heading, HStack, IconButton } from "@chakra-ui/react";
import { EventDetails, EventRequestProps } from "@/types";
import { fetchEvents } from "@/bff";
import ItemList from "@/app/components/ItemList";
import { useEventContext } from "@/context/eventContext";
import PageLoading from "@/app/components/PageLoading";
import useScrollPosition from "@/hooks/useScrollPosition";
import {
    formatDateString,
    generateRandomEvent,
    setQueryParam,
    removeQueryParam,
} from "@/utils";
import FloatingIconButton from "@/app/components/FloatingIconButton";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TextInput } from "@/app/components/TextInput";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export interface FormData {
    dateFrom: string;
    dateTo: string;
    searchTerm: string;
}

const schema: ZodType<FormData> = z.object({
    dateFrom: z.string(),
    dateTo: z.string(),
    searchTerm: z.string(),
});

const fields = [
    "description",
    "timeFrom",
    "timeTo",
] satisfies (keyof EventDetails)[];

interface Props {}

const Page = ({}: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const testMode = false;
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollPosition = useScrollPosition();
    const [loading, setLoading] = useState(true);
    const { events, updateEvents, skip, updateSkip, currentEventId } =
        useEventContext();
    const [showToTopButton, setShowToTopButton] = useState<boolean>(false);
    const limit = 50;
    const [fetching, setFetching] = useState<boolean>(false);
    const [hasAllEvents, setHasAllEvents] = useState<boolean>(false);
    const todayDate = formatDateString(new Date().toISOString());
    const todayDateFormatted = `${[
        todayDate.year,
        todayDate.month,
        todayDate.day,
    ].join("-")}`;

    useEffect(() => {
        getEvents();

        if (!dateFrom)
            setQueryParam(
                "dateFrom",
                todayDateFormatted,
                pathname,
                searchParams,
                router
            );
    }, [dateFrom, dateTo]);

    useEffect(() => {
        handleScroll();
    }, [scrollPosition]);

    const { register, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            dateFrom: dateFrom || todayDateFormatted,
            dateTo: dateTo || "",
            searchTerm: "",
        },
    });

    const getRequestOptions = (
        skip: number | null,
        dateFrom: string | null,
        dateTo: string | null
    ): EventRequestProps => {
        return {
            skip: skip ? skip : 0,
            limit: limit,
            dateFrom,
            dateTo,
        };
    };

    const generateTestData = (count: number) => {
        return Array.from({ length: count }, generateRandomEvent);
    };

    const handleScroll = async () => {
        if (scrollPosition > window.innerHeight - 500) {
            setShowToTopButton(true);
        } else {
            setShowToTopButton(false);
        }

        if (
            containerRef.current?.getBoundingClientRect().height &&
            scrollPosition >
                containerRef.current?.getBoundingClientRect().height - 1200
        ) {
            if (!fetching && !hasAllEvents) {
                setFetching(true);
                const newEvents = await fetchEvents({
                    data: getRequestOptions(skip + limit, dateFrom, dateTo),
                });

                if (newEvents && newEvents.length > 0) {
                    updateEvents([...events, ...newEvents]);
                    updateSkip(skip + limit);
                    setFetching(false);
                } else {
                    setHasAllEvents(true);
                }
            }
        }
    };

    const getEvents = async () => {
        if (!currentEventId) {
            let events;

            if (testMode) {
                events = generateTestData(50);
            } else {
                events = await fetchEvents({
                    data: getRequestOptions(null, dateFrom, dateTo),
                });
            }

            if (events) {
                updateEvents(events);
            }
        }
        setLoading(false);
    };

    if (loading) {
        return <PageLoading />;
    }

    return (
        <Flex ref={containerRef} direction="column" gap={6}>
            <FloatingIconButton
                icon={
                    <IconButton
                        bg="transparent"
                        fontSize={20}
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            })
                        }
                        aria-label="back to top"
                        icon={<ArrowRightIcon transform="rotate(270deg)" />}
                    />
                }
                showButton={showToTopButton}
                positionX="right"
                positionY="bottom"
            />
            <Heading>Events</Heading>
            <form>
                <HStack>
                    <HStack>
                        <TextInput
                            title="Date from"
                            type="date"
                            size="lg"
                            height="60px"
                            variant="outline"
                            required
                            {...register("dateFrom")}
                            min={todayDateFormatted}
                            onChange={(e) => {
                                if (e.target.value.length > 0) {
                                    setQueryParam(
                                        "dateFrom",
                                        e.target.value,
                                        pathname,
                                        searchParams,
                                        router
                                    );
                                } else {
                                    setQueryParam(
                                        "dateFrom",
                                        todayDateFormatted,
                                        pathname,
                                        searchParams,
                                        router
                                    );
                                    setValue("dateFrom", todayDateFormatted);
                                }
                            }}
                        />
                        <TextInput
                            title="Date to"
                            type="date"
                            size="lg"
                            height="60px"
                            variant="outline"
                            required
                            {...register("dateTo")}
                            min={dateFrom || ""}
                            onChange={(e) => {
                                e.target.value.length > 0
                                    ? setQueryParam(
                                          "dateTo",
                                          e.target.value,
                                          pathname,
                                          searchParams,
                                          router
                                      )
                                    : removeQueryParam(
                                          "dateTo",
                                          pathname,
                                          searchParams,
                                          router
                                      );
                            }}
                        />
                    </HStack>
                </HStack>
            </form>
            <ItemList page="events" fields={fields} data={events} />
        </Flex>
    );
};

export default Page;
