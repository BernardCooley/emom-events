"use client";

import EventsMap from "@/app/components/EventsMap";
import FloatingIconButton from "@/app/components/FloatingIconButton";
import ItemList from "@/app/components/ItemList";
import { fetchEvents } from "@/bff";
import { useEventContext } from "@/context/eventContext";
import useScrollPosition from "@/hooks/useScrollPosition";
import { EventDetails, EventRequestProps } from "@/types";
import {
    formatDateString,
    generateRandomEvent,
    removeQueryParams,
    setQueryParams,
} from "@/utils";
import {
    ArrowRightIcon,
    ChevronRightIcon,
    CloseIcon,
    Search2Icon,
} from "@chakra-ui/icons";
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
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import Select from "react-select";
import { TextInput } from "@/app/components/FormInputs/TextInput";

const testMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";
const limit = 50;
const options = [
    {
        value: "",
        label: "Defult",
    },
    {
        value: "nameAsc",
        label: (
            <>
                Title (a
                <ChevronRightIcon />
                z)
            </>
        ),
    },
    {
        value: "nameDesc",
        label: (
            <>
                Title (z
                <ChevronRightIcon />
                a)
            </>
        ),
    },
    { value: "timeFromAsc", label: "Date (earliest)" },
    { value: "timeFromDesc", label: "Date (latest)" },
    {
        value: "promoterAsc",
        label: (
            <>
                Host name (a
                <ChevronRightIcon />
                z)
            </>
        ),
    },
    {
        value: "promoterDesc",
        label: (
            <>
                Host name (z
                <ChevronRightIcon />
                a)
            </>
        ),
    },
    {
        value: "venueAsc",
        label: (
            <>
                Venue (a
                <ChevronRightIcon />
                z)
            </>
        ),
    },
    {
        value: "venueDesc",
        label: (
            <>
                Venue (z
                <ChevronRightIcon />
                a)
            </>
        ),
    },
];

export interface FormData {
    dateFrom: string;
    dateTo: string;
    searchTerm: string;
    orderBy: string;
}

const schema: ZodType<FormData> = z.object({
    dateFrom: z.string(),
    dateTo: z.string(),
    searchTerm: z.string(),
    orderBy: z.string(),
});

interface Props {}

const Page = ({}: Props) => {
    const [isMarkerHovered, setIsMarkerHovered] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [hasAllEvents, setHasAllEvents] = useState<boolean>(false);
    const scrollPosition = useScrollPosition();
    const router = useRouter();
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const [showToTopButton, setShowToTopButton] = useState<boolean>(false);
    const { events, currentEventId, updateEvents, skip, updateSkip } =
        useEventContext();
    const [itemHoveredId, setItemHovered] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const searchTerm = searchParams.get("searchTerm");
    const orderBy = searchParams.get("orderBy");
    const showMap = searchParams.get("showMap");
    const [isMapShowing, setIsMapShowing] = useState<boolean>(
        showMap === "true"
    );

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
            orderBy: orderBy || "",
        },
    });

    const { control, watch, setValue } = formMethods;

    const watchOrderBy = watch("orderBy");
    const watchDateFrom = watch("dateFrom");
    const watchDateTo = watch("dateTo");
    const watchSearchTerm = watch("searchTerm");

    useEffect(() => {
        handleScroll();
    }, [scrollPosition]);

    useEffect(() => {
        if (watchDateFrom.length > 0) {
            setTimeout(() => {
                setQueryParams(
                    {
                        dateFrom: [watchDateFrom],
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
        getEvents(watchDateFrom, watchDateTo, watchOrderBy, watchSearchTerm);
    }, [watchDateFrom]);

    useEffect(() => {
        if (watchDateTo.length > 0) {
            setQueryParams(
                {
                    dateTo: [watchDateTo],
                },
                pathname,
                searchParams,
                router
            );
        } else {
            removeQueryParams(["dateTo"], pathname, searchParams, router);
            setValue("dateTo", "");
        }
        getEvents(watchDateFrom, watchDateTo, watchOrderBy, watchSearchTerm);
    }, [watchDateTo]);

    useEffect(() => {
        if (watchOrderBy.length > 0) {
            setQueryParams(
                {
                    orderBy: [watchOrderBy],
                },
                pathname,
                searchParams,
                router
            );
        } else {
            removeQueryParams(["orderBy"], pathname, searchParams, router);
            setValue("orderBy", "");
        }
        getEvents(watchDateFrom, watchDateTo, watchOrderBy, watchSearchTerm);
    }, [watchOrderBy]);

    useEffect(() => {
        if (!currentEventId) {
            getEvents(dateFrom, dateTo, orderBy, searchTerm);
        }
    }, []);

    const getEvents = async (
        dateFrom: string | null,
        dateTo: string | null,
        orderBy: string | null,
        searchTerm: string | null
    ) => {
        let events;

        if (testMode) {
            events = generateTestData(50);
        } else {
            events = await fetchEvents({
                data: getRequestOptions(
                    null,
                    dateFrom,
                    dateTo,
                    orderBy,
                    searchTerm
                ),
            });
        }

        if (events) {
            updateEvents(events as EventDetails[]);
        } else {
            updateEvents(null);
        }
    };

    const getRequestOptions = (
        skip: number | null,
        dateFrom: string | null,
        dateTo: string | null,
        orderBy: string | null,
        searchTerm: string | null
    ): EventRequestProps => {
        return {
            skip: skip ? skip : 0,
            limit: limit,
            dateFrom,
            dateTo,
            orderBy,
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
                        orderBy,
                        searchTerm
                    ),
                });

                if (newEvents && newEvents.length > 0) {
                    updateEvents([...(events || []), ...newEvents]);
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
                searchTerm: [watchSearchTerm],
                dateFrom: [todayDateFormatted],
            },
            pathname,
            searchParams,
            router
        );
        setValue("dateFrom", todayDateFormatted);
        getEvents(todayDateFormatted, "", "", watchSearchTerm);
    };

    const handleSearchClear = () => {
        removeQueryParams(["searchTerm"], pathname, searchParams, router);
        getEvents(watchDateFrom, watchDateTo, watchOrderBy, "");
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
        removeQueryParams(
            ["dateTo", "searchTerm", "orderBy"],
            pathname,
            searchParams,
            router
        );
        setValue("orderBy", "");
        setValue("searchTerm", "");
        setValue("dateFrom", todayDateFormatted);
        setValue("dateTo", "");
        getEvents(todayDateFormatted, "", "", "");
    };

    const ConditionalText = ({
        condition,
        label,
        value,
    }: {
        condition: boolean;
        label: string;
        value: string;
    }) =>
        condition ? (
            <HStack>
                <Text>{label}</Text>
                <Text fontWeight={700}>{value}</Text>
            </HStack>
        ) : null;

    return (
        <Suspense fallback={<div>Loading...</div>}>
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
                            min={watchDateFrom}
                        />
                        <Controller
                            control={control}
                            name="orderBy"
                            render={({ field: { ref } }) => (
                                <Select
                                    placeholder="Sort by"
                                    styles={{
                                        control: (styles) => ({
                                            ...styles,
                                            width: "200px",
                                        }),
                                    }}
                                    ref={ref}
                                    value={
                                        options.find(
                                            (option) =>
                                                option.value === watchOrderBy
                                        ) || null
                                    }
                                    onChange={(val) =>
                                        setValue("orderBy", val?.value || "")
                                    }
                                    options={options}
                                />
                            )}
                        />
                        <TextInput
                            width="full"
                            onEnter={handleSearch}
                            placeholder="Search by Title, Venue, Address, Host, or Artist"
                            type="text"
                            height="40px"
                            size="md"
                            name="searchTerm"
                            control={control}
                            rightIcon={
                                watchSearchTerm.trim().length > 0 ? (
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
                                {searchParams.get("searchTerm") || "All Events"}{" "}
                                {events && events.length > 0
                                    ? `(${events.length})`
                                    : ""}
                            </Text>
                            <ConditionalText
                                condition={
                                    watchDateFrom !== todayDateFormatted ||
                                    watchDateTo.length > 0
                                }
                                label="from"
                                value={watchDateFrom}
                            />
                            <ConditionalText
                                condition={watchDateTo.length > 0}
                                label="to"
                                value={watchDateTo}
                            />
                            <ConditionalText
                                condition={watchOrderBy.length > 0}
                                label="sorted By:"
                                value={
                                    (options.find(
                                        (option) =>
                                            option.value === watchOrderBy
                                    )?.label as string) || ""
                                }
                            />
                            {(searchParams.get("searchTerm") ||
                                watchDateFrom !== todayDateFormatted ||
                                watchOrderBy.length > 0 ||
                                watchDateTo.length > 0) && (
                                <Button
                                    ml={6}
                                    variant="link"
                                    onClick={handleClearAll}
                                >
                                    Clear
                                </Button>
                            )}
                        </HStack>
                        {events && events.length > 0 && (
                            <Button
                                onClick={() => {
                                    if (isMapShowing) {
                                        setIsMapShowing(false);
                                        removeQueryParams(
                                            ["showMap"],
                                            pathname,
                                            searchParams,
                                            router
                                        );
                                    } else {
                                        setQueryParams(
                                            { showMap: ["true"] },
                                            pathname,
                                            searchParams,
                                            router
                                        );
                                        setIsMapShowing(true);
                                    }
                                }}
                                variant="link"
                            >
                                {isMapShowing && events && events.length > 0
                                    ? "Show list"
                                    : "Show on map"}
                            </Button>
                        )}
                    </HStack>
                </Box>
                {!isMapShowing ? (
                    <ItemList page="events" events={events} />
                ) : (
                    <HStack h="500px" alignItems="start" w="full">
                        <ItemList
                            isMarkerHovered={isMarkerHovered}
                            itemHoveredId={itemHoveredId || ""}
                            onHover={(id) => setItemHovered(id)}
                            overflowY="scroll"
                            columns={{ base: 1 }}
                            page="events"
                            events={events}
                        />
                        {events && events.length > 0 && (
                            <Box minW="800px" h="500px">
                                <EventsMap
                                    onMarkerHovered={(hov) => {
                                        setIsMarkerHovered(hov);
                                    }}
                                    onHover={(id) => setItemHovered(id)}
                                    itemHoveredId={itemHoveredId || ""}
                                    events={events}
                                />
                            </Box>
                        )}
                    </HStack>
                )}
            </Flex>
        </Suspense>
    );
};

export default Page;
