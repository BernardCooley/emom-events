"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Text,
} from "@chakra-ui/react";
import { EventDetails, EventRequestProps } from "@/types";
import { fetchEvents } from "@/bff";
import ItemList from "@/app/components/ItemList";
import { useEventContext } from "@/context/eventContext";
import PageLoading from "@/app/components/PageLoading";
import useScrollPosition from "@/hooks/useScrollPosition";
import {
    formatDateString,
    generateRandomEvent,
    removeQueryParam,
    setQueryParams,
} from "@/utils";
import FloatingIconButton from "@/app/components/FloatingIconButton";
import { ArrowRightIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TextInput } from "@/app/components/TextInput";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EventsMap from "@/app/components/EventsMap";

export interface FormData {
    dateFrom: string;
    searchTerm: string;
}

const schema: ZodType<FormData> = z.object({
    dateFrom: z.string(),
    searchTerm: z.string(),
});

const fields = [
    "description",
    "timeFrom",
    "timeTo",
] satisfies (keyof EventDetails)[];

interface Props {}

const Page = ({}: Props) => {
    const [itemHovered, setItemHovered] = useState<string | null>(null);
    const [isMapShowing, setIsMapShowing] = useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateFromParam = searchParams.get("dateFrom");
    const searchTermParam = searchParams.get("searchTerm");
    const [searchTermWatch, setSearchTermWatch] = useState<string>("");
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
    }, []);

    useEffect(() => {
        getEvents(true);

        if (!searchTermParam && !dateFromParam)
            setQueryParams(
                {
                    dateFrom: [todayDateFormatted],
                },
                pathname,
                searchParams,
                router
            );
        setValue("dateFrom", dateFromParam || "");
    }, [dateFromParam]);

    useEffect(() => {
        getEvents(true);

        if (searchTermParam) {
            setSearchTermWatch(searchTermParam);
            setQueryParams(
                {
                    dateFrom: [todayDateFormatted],
                },
                pathname,
                searchParams,
                router
            );
            setValue("searchTerm", searchTermParam);
        }
    }, [searchTermParam]);

    useEffect(() => {
        handleScroll();
    }, [scrollPosition]);

    const { register, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            dateFrom: dateFromParam || todayDateFormatted,
            searchTerm: searchTermParam || "",
        },
    });

    const getRequestOptions = (
        skip: number | null,
        dateFrom: string | null,
        searchTerm: string | null
    ): EventRequestProps => {
        return {
            skip: skip ? skip : 0,
            limit: limit,
            dateFrom,
            searchTerm,
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
                    data: getRequestOptions(
                        skip + limit,
                        dateFromParam,
                        searchTermParam
                    ),
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

    const getEvents = async (force?: boolean | false) => {
        if (!currentEventId || force) {
            let events;

            if (testMode) {
                events = generateTestData(50);
            } else {
                events = await fetchEvents({
                    data: getRequestOptions(
                        null,
                        dateFromParam,
                        searchTermParam
                    ),
                });
            }

            if (events) {
                updateEvents(events as EventDetails[]);
            }
        }
        setLoading(false);
    };

    if (loading) {
        return <PageLoading />;
    }

    return (
        <Flex ref={containerRef} direction="column" gap={2}>
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
                <HStack
                    rounded="lg"
                    pt={2}
                    alignItems="flex-end"
                    justifyContent="flex-end"
                >
                    <HStack>
                        <TextInput
                            type="date"
                            size="lg"
                            height="40px"
                            variant="outline"
                            {...register("dateFrom")}
                            min={todayDateFormatted}
                            onChange={(e) => {
                                if (e.target.value.length > 0) {
                                    setQueryParams(
                                        {
                                            dateFrom: [e.target.value],
                                        },
                                        pathname,
                                        searchParams,
                                        router
                                    );
                                } else {
                                    setQueryParams(
                                        {
                                            dateFrom: [todayDateFormatted],
                                        },
                                        pathname,
                                        searchParams,
                                        router
                                    );
                                    setValue("dateFrom", todayDateFormatted);
                                }
                            }}
                        />
                    </HStack>
                    <Box w="600px">
                        <TextInput
                            onEnter={() =>
                                setQueryParams(
                                    {
                                        searchTerm: [searchTermWatch],
                                    },
                                    pathname,
                                    searchParams,
                                    router
                                )
                            }
                            placeholder="Search by Title, Venue, Address, Promoter, or Artist"
                            type="text"
                            size="lg"
                            fieldProps={register("searchTerm")}
                            height="40px"
                            variant="outline"
                            onChange={(e) => setSearchTermWatch(e.target.value)}
                            rightIcon={
                                searchTermWatch.trim().length > 0 ? (
                                    <HStack mt={0} gap={0} h="38px" mr={10}>
                                        <IconButton
                                            h="full"
                                            bg="transparent"
                                            aria-label="Search"
                                            icon={<Search2Icon />}
                                            onClick={() => {
                                                setQueryParams(
                                                    {
                                                        searchTerm: [
                                                            searchTermWatch,
                                                        ],
                                                    },
                                                    pathname,
                                                    searchParams,
                                                    router
                                                );
                                            }}
                                        />
                                        <IconButton
                                            h="full"
                                            bg="transparent"
                                            aria-label="Search"
                                            icon={<CloseIcon />}
                                            onClick={() => {
                                                removeQueryParam(
                                                    "searchTerm",
                                                    pathname,
                                                    searchParams,
                                                    router
                                                );
                                                setValue("searchTerm", "");
                                                setSearchTermWatch("");
                                            }}
                                        />
                                    </HStack>
                                ) : null
                            }
                        />
                    </Box>
                </HStack>
            </form>
            <Divider />
            <Box h="24px">
                <HStack justifyContent="space-between">
                    <HStack>
                        <Text>Showing: </Text>
                        <Text fontWeight={700}>
                            {searchTermParam || "All events"}
                        </Text>
                        {dateFromParam !== todayDateFormatted && (
                            <HStack>
                                <Text>from</Text>
                                <Text fontWeight={700}>{dateFromParam}</Text>
                            </HStack>
                        )}
                        {searchTermParam ||
                        dateFromParam !== todayDateFormatted ? (
                            <Button
                                ml={6}
                                variant="link"
                                onClick={() => {
                                    setQueryParams(
                                        {
                                            dateFrom: [todayDateFormatted],
                                            searchTerm: [""],
                                        },
                                        pathname,
                                        searchParams,
                                        router
                                    );
                                    setValue("searchTerm", "");
                                    setSearchTermWatch("");
                                    setValue("dateFrom", todayDateFormatted);
                                }}
                            >
                                Clear
                            </Button>
                        ) : null}
                    </HStack>
                    <Button
                        onClick={() => setIsMapShowing((prev) => !prev)}
                        variant="link"
                    >
                        {isMapShowing ? "Show list" : "Show on map"}
                    </Button>
                </HStack>
            </Box>

            {!isMapShowing ? (
                <ItemList page="events" fields={fields} data={events} />
            ) : (
                <HStack h="500px" alignItems="start" w="full">
                    <ItemList
                        onHover={(id) => setItemHovered(id)}
                        overflowY="scroll"
                        columns={{ base: 1 }}
                        page="events"
                        fields={fields}
                        data={events}
                    />
                    <Box minW="800px" h="500px">
                        <EventsMap
                            itemHovered={itemHovered || ""}
                            events={events}
                        />
                    </Box>
                </HStack>
            )}
        </Flex>
    );
};

export default Page;
