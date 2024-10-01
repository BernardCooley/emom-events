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
    updateQueryParams,
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
    ToastProps,
    useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { TextInput } from "@/app/components/FormInputs/TextInput";

const testMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";
const limit = 50;

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

const EventsPage = ({}: Props) => {
    const toast = useToast();
    const [itemListEvents, setItemListEvents] = useState<EventDetails[] | null>(
        null
    );
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
    const accountDeleted = searchParams.get("accountDeleted");
    const searchTerm = searchParams.get("searchTerm");
    const orderBy = searchParams.get("orderBy");
    const showMap = searchParams.get("showMap");
    const [isMapShowing, setIsMapShowing] = useState<boolean>(
        showMap === "true"
    );
    const id = "accountDeletedToastId";

    useEffect(() => {
        if (accountDeleted === "true") {
            showToast({
                title: "Account deleted",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
    }, []);

    const showToast = useCallback(
        ({ status, title }: ToastProps) => {
            if (!toast.isActive(id)) {
                toast({
                    id,
                    title: title || "An error has occurred.",
                    status: status,
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
        [toast]
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

    const onDateButtonClick = (name: string) => {
        if (document.querySelector(`input[name="${name}"]`)) {
            const input = document.querySelector(
                `input[name="${name}"]`
            ) as HTMLInputElement;
            input?.showPicker();
        }
    };

    const watchOrderBy = watch("orderBy");
    const watchDateFrom = watch("dateFrom");
    const watchDateTo = watch("dateTo");
    const watchSearchTerm = watch("searchTerm");

    const filterButtonOptions = [
        {
            value: "dateFrom",
            selected: watchDateFrom !== todayDateFormatted,
            onClick: () => onDateButtonClick("dateFrom"),
            label: "Date from",
            field: (
                <TextInput
                    styles={{
                        visibility: "hidden",
                        position: "absolute",
                        zIndex: -1,
                        pointerEvents: "none",
                    }}
                    width="180px"
                    type="date"
                    title="Date from"
                    height="40px"
                    size="md"
                    name="dateFrom"
                    control={control}
                    min={todayDateFormatted}
                />
            ),
        },
        {
            value: "dateTo",
            selected: watchDateTo.length > 0,
            onClick: () => onDateButtonClick("dateTo"),
            label: "Date to",
            field: (
                <TextInput
                    styles={{
                        visibility: "hidden",
                        position: "absolute",
                        zIndex: -1,
                        pointerEvents: "none",
                    }}
                    width="180px"
                    type="date"
                    title="Date to"
                    height="40px"
                    size="md"
                    name="dateTo"
                    control={control}
                    min={todayDateFormatted}
                />
            ),
        },
        {
            value: "timeFromAsc",
            selected: watchOrderBy === "timeFromAsc",
            onClick: () => setValue("orderBy", "timeFromAsc"),
            label: "Soonest",
            field: null,
        },
        {
            value: "nameAsc",
            selected: watchOrderBy === "nameAsc",
            onClick: () => setValue("orderBy", "nameAsc"),
            label: "Event name",
            field: null,
        },
        {
            value: "promoterAsc",
            selected: watchOrderBy === "promoterAsc",
            onClick: () => setValue("orderBy", "promoterAsc"),
            label: "Host name",
            field: null,
        },
        {
            value: "venueAsc",
            selected: watchOrderBy === "venueAsc",
            onClick: () => setValue("orderBy", "venueAsc"),
            label: "Venue",
            field: null,
        },
        {
            value: "createAtDesc",
            selected: watchOrderBy === "createAtDesc",
            onClick: () => setValue("orderBy", "createAtDesc"),
            label: "Newest",
            field: null,
        },
        {
            value: "createAtAsc",
            selected: watchOrderBy === "createAtAsc",
            onClick: () => setValue("orderBy", "createAtAsc"),
            label: "Oldest",
            field: null,
        },
    ];

    useEffect(() => {
        handleScroll();
    }, [scrollPosition]);

    const onFormUpdate = async () => {
        const params: {
            dateFrom?: string[];
            orderBy?: string[];
            accountDeleted?: string[];
            dateTo?: string[];
        } = {};

        const toDelete = [];

        if (accountDeleted === "true") {
            toDelete.push("accountDeleted");
        }

        if (watchDateFrom.length > 0) {
            params.dateFrom = [watchDateFrom];
        } else {
            params.dateFrom = [todayDateFormatted];
            setValue("dateFrom", todayDateFormatted);
        }

        if (watchOrderBy.length > 0) {
            params.orderBy = [watchOrderBy];
        } else {
            params.orderBy = ["timeFromAsc"];
            setValue("orderBy", "timeFromAsc");
        }

        if (watchDateTo.length > 0) {
            params.dateTo = [watchDateTo];
        } else {
            toDelete.push("dateTo");
            setValue("dateTo", "");
        }

        if (Object.keys(params).length > 0) {
            await updateQueryParams(
                router,
                pathname,
                searchParams,
                params,
                toDelete
            );
        }
        getEvents(watchDateFrom, watchDateTo, watchOrderBy, watchSearchTerm);
    };

    useEffect(() => {
        if (!currentEventId || !events) {
            onFormUpdate();
        }
    }, [watchDateTo, watchDateFrom, watchOrderBy, watchSearchTerm]);

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

    const handleSearch = async () => {
        await updateQueryParams(router, pathname, searchParams, {
            searchTerm: [watchSearchTerm],
            dateFrom: [todayDateFormatted],
        });
        setValue("dateFrom", todayDateFormatted);
    };

    const handleSearchClear = async () => {
        await updateQueryParams(router, pathname, searchParams, null, [
            "searchTerm",
        ]);
        setValue("searchTerm", "");
    };

    const handleClearAll = async () => {
        await updateQueryParams(
            router,
            pathname,
            searchParams,
            {
                dateFrom: [todayDateFormatted],
            },
            ["dateTo", "searchTerm"]
        );
        setValue("searchTerm", "");
        setValue("dateFrom", todayDateFormatted);
        setValue("dateTo", "");
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
                <Flex
                    gap={0}
                    flexWrap="wrap"
                    rounded="lg"
                    pt={2}
                    alignItems="flex-end"
                    justifyContent="flex-end"
                >
                    <HStack
                        overflowX="scroll"
                        w="full"
                        css={{
                            "&::-webkit-scrollbar": {
                                width: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: "transparent",
                                borderRadius: "24px",
                            },
                        }}
                    >
                        {filterButtonOptions.map((option) => (
                            <Box key={option.value}>
                                <Button
                                    isActive={option.selected}
                                    _active={{
                                        backgroundColor: "gray.900",
                                        color: "white",
                                    }}
                                    rounded="full"
                                    onClick={option.onClick}
                                    px={3}
                                    h={8}
                                    whiteSpace="nowrap"
                                    width="auto"
                                    minWidth="fit-content"
                                >
                                    {option.label}
                                </Button>
                                {option.field}
                            </Box>
                        ))}
                    </HStack>
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
                </Flex>
            </form>
            <Divider />
            <Box>
                <Flex flexWrap="wrap" gap={4} justifyContent="space-between">
                    <Flex flexWrap="wrap" gap={2}>
                        <Text fontWeight={700}>
                            {isMapShowing ? (
                                <>
                                    {itemListEvents &&
                                    itemListEvents.length >= 0
                                        ? `${itemListEvents.length}`
                                        : ""}{" "}
                                    {"event"}
                                    {(itemListEvents &&
                                        itemListEvents.length > 1) ||
                                    itemListEvents?.length === 0
                                        ? "s"
                                        : ""}{" "}
                                </>
                            ) : (
                                <>
                                    {events && events.length >= 0
                                        ? `${events.length}`
                                        : ""}{" "}
                                    {"event"}
                                    {(events && events.length > 1) ||
                                    events?.length === 0
                                        ? "s"
                                        : ""}{" "}
                                </>
                            )}
                        </Text>
                        <ConditionalText
                            condition={
                                watchDateFrom !== todayDateFormatted ||
                                watchDateTo.length > 0
                            }
                            label="from"
                            value={watchDateFrom}
                        />
                        <HStack>
                            <ConditionalText
                                condition={watchDateTo.length > 0}
                                label="to"
                                value={watchDateTo}
                            />
                            {(searchParams.get("searchTerm") ||
                                watchDateFrom !== todayDateFormatted ||
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
                    </Flex>
                    {events && events.length > 0 && (
                        <Button
                            onClick={async () => {
                                if (isMapShowing) {
                                    setIsMapShowing(false);
                                    await updateQueryParams(
                                        router,
                                        pathname,
                                        searchParams,
                                        null,
                                        ["showMap"]
                                    );
                                } else {
                                    await updateQueryParams(
                                        router,
                                        pathname,
                                        searchParams,
                                        { showMap: ["true"] },
                                        ["dateTo", "searchTerm"]
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
                </Flex>
            </Box>
            {!isMapShowing ? (
                <ItemList page="events" events={events} />
            ) : (
                <Flex
                    direction={["column-reverse", "column-reverse", "row"]}
                    h="440px"
                    alignItems="start"
                    w="full"
                >
                    <ItemList
                        isMarkerHovered={isMarkerHovered}
                        itemHoveredId={itemHoveredId || ""}
                        onHover={(id) => setItemHovered(id)}
                        overflowY="scroll"
                        columns={{ base: 1 }}
                        page="events"
                        events={itemListEvents}
                    />
                    {events && events.length > 0 && (
                        <Box minW={["100%", "100%", "60%"]} h="440px">
                            <EventsMap
                                onNewBounds={(events) =>
                                    setItemListEvents(events)
                                }
                                onMarkerHovered={(hov) => {
                                    setIsMarkerHovered(hov);
                                }}
                                onHover={(id) => setItemHovered(id)}
                                itemHoveredId={itemHoveredId || ""}
                                events={events}
                            />
                        </Box>
                    )}
                </Flex>
            )}
        </Flex>
    );
};

const Page = ({}: Props) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventsPage />
        </Suspense>
    );
};

export default Page;
