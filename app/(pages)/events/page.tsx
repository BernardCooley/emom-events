"use client";

import EventsMap from "@/app/components/EventsMap";
import FloatingIconButton from "@/app/components/FloatingIconButton";
import ItemList from "@/app/components/ItemList";
import PageLoading from "@/app/components/PageLoading";
import { TextInput } from "@/app/components/TextInput";
import { fetchEvents } from "@/bff";
import { useEventContext } from "@/context/eventContext";
import useScrollPosition from "@/hooks/useScrollPosition";
import { EventDetails, EventRequestProps } from "@/types";
import {
    formatDateString,
    generateRandomEvent,
    removeQueryParam,
    setQueryParams,
} from "@/utils";
import { ArrowRightIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";

const fields = ["description", "timeFrom"] satisfies (keyof EventDetails)[];
const testMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";
const limit = 50;

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

interface Props {}

const Page = ({}: Props) => {
    const [fetching, setFetching] = useState<boolean>(false);
    const [hasAllEvents, setHasAllEvents] = useState<boolean>(false);
    const scrollPosition = useScrollPosition();
    const router = useRouter();
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const [showToTopButton, setShowToTopButton] = useState<boolean>(false);
    const [isMapShowing, setIsMapShowing] = useState<boolean>(false);
    const { events, currentEventId, updateEvents, skip, updateSkip } =
        useEventContext();
    const [itemHovered, setItemHovered] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const searchTerm = searchParams.get("searchTerm");
    const [loading, setLoading] = useState(true);

    const todayDate = formatDateString(new Date().toISOString());
    const todayDateFormatted = `${[
        todayDate.year,
        todayDate.month,
        todayDate.day,
    ].join("-")}`;

    const formMethods = useForm<FormData>({
        mode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            dateFrom: dateFrom || todayDateFormatted,
            dateTo: dateTo || "",
            searchTerm: searchTerm || "",
        },
    });

    const {
        formState: { errors },
        control,
        watch,
        setValue,
    } = formMethods;

    const dateFromWatch = watch("dateFrom");
    const dateToWatch = watch("dateTo");
    const searchTermWatch = watch("searchTerm");

    useEffect(() => {
        handleScroll();
    }, [scrollPosition]);

    useEffect(() => {
        if (dateFromWatch.length > 0) {
            setTimeout(() => {
                setQueryParams(
                    {
                        dateFrom: [dateFromWatch],
                    },
                    pathname,
                    searchParams,
                    router
                );
            }, 0);
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
        getEvents(dateFromWatch, dateToWatch, searchTermWatch);
    }, [dateFromWatch]);

    useEffect(() => {
        if (dateToWatch.length > 0) {
            setQueryParams(
                {
                    dateTo: [dateToWatch],
                },
                pathname,
                searchParams,
                router
            );
        } else {
            removeQueryParam("dateTo", pathname, searchParams, router);
            setValue("dateTo", "");
        }
        getEvents(dateFromWatch, dateToWatch, searchTermWatch);
    }, [dateToWatch]);

    useEffect(() => {
        if (!currentEventId) {
            getEvents(dateFrom, dateTo, searchTerm);
        }
    }, []);

    const getEvents = async (
        dateFrom: string | null,
        dateTo: string | null,
        searchTerm: string | null
    ) => {
        let events;

        if (testMode) {
            events = generateTestData(50);
        } else {
            events = await fetchEvents({
                data: getRequestOptions(null, dateFrom, dateTo, searchTerm),
            });
        }

        if (events) {
            updateEvents(events as EventDetails[]);
        }

        setLoading(false);
    };

    const getRequestOptions = (
        skip: number | null,
        dateFrom: string | null,
        dateTo: string | null,
        searchTerm: string | null
    ): EventRequestProps => {
        return {
            skip: skip ? skip : 0,
            limit: limit,
            dateFrom,
            dateTo,
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
                        dateFrom,
                        dateTo,
                        searchTerm
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

    const handleSearch = () => {
        setQueryParams(
            {
                searchTerm: [searchTermWatch],
                dateFrom: [todayDateFormatted],
            },
            pathname,
            searchParams,
            router
        );
        setValue("dateFrom", todayDateFormatted);
        getEvents(todayDateFormatted, "", searchTermWatch);
    };

    const handleSearchClear = () => {
        removeQueryParam("searchTerm", pathname, searchParams, router);
        getEvents(dateFromWatch, dateToWatch, "");
        setValue("searchTerm", "");
    };

    const handleClearAll = () => {
        setQueryParams(
            {
                dateFrom: [todayDateFormatted],
            },
            pathname,
            searchParams,
            router
        );
        removeQueryParam("dateTo", pathname, searchParams, router);
        removeQueryParam("searchTerm", pathname, searchParams, router);
        setValue("searchTerm", "");
        setValue("dateFrom", todayDateFormatted);
        setValue("dateTo", "");
        getEvents(todayDateFormatted, "", "");
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
                    <TextInput
                        width="180px"
                        type="date"
                        title="Date from"
                        height="40px"
                        size="md"
                        name="dateFrom"
                        control={control}
                        min={todayDateFormatted}
                    />
                    <TextInput
                        width="180px"
                        type="date"
                        title="Date to"
                        height="40px"
                        size="md"
                        name="dateTo"
                        control={control}
                        min={dateFromWatch}
                    />
                    <TextInput
                        width="full"
                        onEnter={handleSearch}
                        placeholder="Search by Title, Venue, Address, Promoter, or Artist"
                        type="text"
                        height="40px"
                        size="md"
                        name="searchTerm"
                        control={control}
                        rightIcon={
                            searchTermWatch.trim().length > 0 ? (
                                <HStack mt={0} gap={0} h="38px" mr={10}>
                                    <IconButton
                                        h="full"
                                        bg="transparent"
                                        aria-label="Search"
                                        icon={<Search2Icon />}
                                        onClick={handleSearch}
                                    />
                                    <IconButton
                                        h="full"
                                        bg="transparent"
                                        aria-label="Search"
                                        icon={<CloseIcon />}
                                        onClick={handleSearchClear}
                                    />
                                </HStack>
                            ) : null
                        }
                    />
                </HStack>
            </form>
            <Divider />
            <Box h="24px">
                <HStack justifyContent="space-between">
                    <HStack>
                        <Text>Showing: </Text>
                        <Text fontWeight={700}>
                            {searchParams.get("searchTerm") || "All events"}
                        </Text>
                        {dateFromWatch !== todayDateFormatted ||
                            (dateToWatch.length > 0 && (
                                <HStack>
                                    <Text>from</Text>
                                    <Text fontWeight={700}>
                                        {dateFromWatch}
                                    </Text>
                                </HStack>
                            ))}
                        {dateToWatch.length > 0 && (
                            <HStack>
                                <Text>to</Text>
                                <Text fontWeight={700}>{dateToWatch}</Text>
                            </HStack>
                        )}
                        {searchParams.get("searchTerm") ||
                        dateFromWatch !== todayDateFormatted ||
                        dateToWatch.length > 0 ? (
                            <Button
                                ml={6}
                                variant="link"
                                onClick={handleClearAll}
                            >
                                Clear
                            </Button>
                        ) : null}
                    </HStack>
                    {events.length > 0 && (
                        <Button
                            onClick={() => {
                                if (isMapShowing) {
                                    setIsMapShowing(false);
                                } else {
                                    setIsMapShowing(true);
                                }
                            }}
                            variant="link"
                        >
                            {isMapShowing ? "Show list" : "Show on map"}
                        </Button>
                    )}
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
