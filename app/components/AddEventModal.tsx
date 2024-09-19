import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TextInput } from "./TextInput";
import ChipGroup from "./ChipGroup";
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import GooglePlacesSearch from "./GooglePlacesSearch";
import { searchVenue } from "@/bff";
import { VenueItem } from "@/types";
import { SearchIcon, SmallAddIcon } from "@chakra-ui/icons";
import { TextAreaInput } from "./TextAreaInput";

export interface FormData {
    name: string;
    timeFrom: string;
    timeTo: string;
    description: string;
    lineup: string[];
    venue: {
        name: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postcodeZip: string;
    };
    venueSearchTerm: string;
    artist: string;
}

const schema: ZodType<FormData> = z
    .object({
        name: z.string().min(1, "Name is required"),
        timeFrom: z.string().min(1, "Date/Time from is required"),
        timeTo: z.string(),
        description: z.string().min(1, "Description is required"),
        lineup: z.array(z.string()),
        venue: z.object({
            name: z.string().min(1, "Venue name is required"),
            address: z.string().min(1, "Venue address is required"),
            city: z.string().min(1, "Venue city is required"),
            state: z.string().min(1, "Venue state is required"),
            country: z.string().min(1, "Venue country is required"),
            postcodeZip: z.string(),
        }),
        venueSearchTerm: z.string(),
        artist: z.string(),
    })
    .refine(
        (data) => {
            if (data.timeTo.length > 0) {
                return data.timeFrom < data.timeTo;
            } else {
                return true;
            }
        },
        {
            message: "End time must be after start time",
            path: ["timeTo"],
        }
    );

type Props = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: FormData;
};

const AddEventModal = ({ isOpen, onClose, defaultValues }: Props) => {
    const [isAddingEventManually, setIsAddingEventManually] = useState(false);
    const [existingVenues, setExistingVenues] = useState<VenueItem[]>([]);
    const [existingVenueSearched, setExistingVenueSearched] = useState(false);
    const [isSearchingForAddress, setIsSearchingForAddress] = useState(true);
    const [libraries] = useState<Library[]>(["places"]);
    useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: libraries,
    });
    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: defaultValues?.name || "",
            timeFrom: defaultValues?.timeFrom || "",
            timeTo: defaultValues?.timeTo || "",
            description: defaultValues?.description || "",
            lineup: defaultValues?.lineup || [],
            venue: defaultValues?.venue || {
                name: "",
                address: "",
                city: "",
                state: "",
                country: "",
                postcodeZip: "",
            },
        },
    });

    const watchLineup = watch("lineup");
    const watchVenueSearchTerm = watch("venueSearchTerm");
    const watchArtist = watch("artist");

    const onSave = async (formData: FormData) => {
        console.log(formData);
    };

    const handleSearchVenue = async () => {
        const venues = await searchVenue({
            name: getValues("venueSearchTerm"),
        });

        if (venues) setExistingVenues(venues);
        setExistingVenueSearched(true);
    };

    const handleArtistAdd = () => {
        const val = getValues("artist");

        if (val.length > 0) {
            setValue("lineup", Array.from(new Set([...watchLineup, val])));
            setValue("artist", "");
        }
    };

    const handleModalClose = () => {
        setExistingVenues([]);
        setIsAddingEventManually(false);
        setExistingVenueSearched(false);
        setIsSearchingForAddress(false);
        reset();
        onClose();
    };

    return (
        <Modal
            closeOnOverlayClick={false}
            closeOnEsc={false}
            isOpen={isOpen}
            onClose={handleModalClose}
            size="6xl"
        >
            <ModalOverlay />
            <ModalContent pb={10} pt={4} h="80vh" overflowY="scroll">
                <ModalHeader>Add Event</ModalHeader>
                <Divider />
                <ModalCloseButton />
                <ModalBody mt={6}>
                    <form onSubmit={handleSubmit(onSave)}>
                        <VStack gap={6}>
                            <VStack gap={6} w="full">
                                <TextInput
                                    title="Name"
                                    type="text"
                                    size="lg"
                                    fieldProps={register("name")}
                                    height="60px"
                                    variant="outline"
                                    error={errors.name?.message}
                                    required
                                />
                                <TextAreaInput
                                    title="Description"
                                    type="text"
                                    size="lg"
                                    fieldProps={register("description")}
                                    height="60px"
                                    variant="outline"
                                    error={errors.description?.message}
                                    required
                                />
                                <TextInput
                                    title="From"
                                    type="datetime-local"
                                    size="lg"
                                    fieldProps={register("timeFrom")}
                                    height="60px"
                                    variant="outline"
                                    error={errors.timeFrom?.message}
                                    required
                                />
                                <TextInput
                                    title="To"
                                    type="datetime-local"
                                    size="lg"
                                    fieldProps={register("timeTo")}
                                    height="60px"
                                    variant="outline"
                                    error={errors.timeTo?.message}
                                    required
                                />

                                <TextInput
                                    fieldProps={register("artist")}
                                    onChange={(e) => {
                                        setValue("artist", e.target.value);
                                    }}
                                    title="Add Artist"
                                    type="text"
                                    size="lg"
                                    height="60px"
                                    variant="outline"
                                    onEnter={handleArtistAdd}
                                    rightIcon={
                                        watchArtist?.length > 0 && (
                                            <IconButton
                                                mt={5}
                                                h="58px"
                                                w="58px"
                                                minW="unset"
                                                aria-label="Search"
                                                icon={
                                                    <SmallAddIcon fontSize="28px" />
                                                }
                                                onClick={handleArtistAdd}
                                            />
                                        )
                                    }
                                />

                                <ChipGroup
                                    title="Lineup: "
                                    onRemoveChip={(index) => {
                                        setValue(
                                            "lineup",
                                            watchLineup.filter(
                                                (_, i) => i !== index
                                            )
                                        );
                                    }}
                                    chips={watchLineup.map((artist) => ({
                                        label: artist,
                                        value: artist.toLowerCase(),
                                    }))}
                                />
                                <Divider />
                                <VStack w="full">
                                    <Flex w="full">
                                        <Text fontSize="lg">Venue</Text>
                                        <Box color="gpRed.500" pl={1}>
                                            *
                                        </Box>
                                    </Flex>

                                    <VStack
                                        p={6}
                                        border="1px solid"
                                        borderColor="gray.300"
                                        w="full"
                                        spacing={6}
                                        rounded="lg"
                                        alignItems="flex-start"
                                    >
                                        {!isAddingEventManually && (
                                            <Button
                                                onClick={() =>
                                                    setIsAddingEventManually(
                                                        true
                                                    )
                                                }
                                                variant="link"
                                            >
                                                Add Venue manually
                                            </Button>
                                        )}

                                        {!isAddingEventManually ? (
                                            <TextInput
                                                fieldProps={register(
                                                    "venueSearchTerm"
                                                )}
                                                onChange={(e) => {
                                                    setValue(
                                                        "venueSearchTerm",
                                                        e.target.value
                                                    );
                                                }}
                                                title="Search for an existing Venue"
                                                type="text"
                                                size="lg"
                                                height="60px"
                                                variant="outline"
                                                onEnter={handleSearchVenue}
                                                rightIcon={
                                                    watchVenueSearchTerm?.length >
                                                        0 && (
                                                        <IconButton
                                                            mt={5}
                                                            h="58px"
                                                            w="58px"
                                                            minW="unset"
                                                            aria-label="Search"
                                                            icon={
                                                                <SearchIcon />
                                                            }
                                                            onClick={
                                                                handleSearchVenue
                                                            }
                                                        />
                                                    )
                                                }
                                            />
                                        ) : (
                                            <Button
                                                mb={4}
                                                onClick={() => {
                                                    setExistingVenueSearched(
                                                        false
                                                    );
                                                    setIsAddingEventManually(
                                                        false
                                                    );
                                                    setValue(
                                                        "venueSearchTerm",
                                                        ""
                                                    );
                                                }}
                                                variant="link"
                                            >
                                                Search for an existing Venue
                                            </Button>
                                        )}
                                        <VStack
                                            alignItems="start"
                                            gap={2}
                                            w="full"
                                            mt={-10}
                                        >
                                            {existingVenueSearched &&
                                                existingVenues.length > 0 &&
                                                existingVenues.map(
                                                    (venue, index) => (
                                                        <Flex
                                                            onClick={() => {
                                                                setExistingVenueSearched(
                                                                    true
                                                                );
                                                                setValue(
                                                                    "venue.name",
                                                                    existingVenues[
                                                                        index
                                                                    ].name
                                                                );
                                                                setValue(
                                                                    "venue.address",
                                                                    existingVenues[
                                                                        index
                                                                    ].address
                                                                );
                                                                setValue(
                                                                    "venue.city",
                                                                    existingVenues[
                                                                        index
                                                                    ].city
                                                                );
                                                                setValue(
                                                                    "venue.state",
                                                                    existingVenues[
                                                                        index
                                                                    ].state
                                                                );
                                                                setValue(
                                                                    "venue.country",
                                                                    existingVenues[
                                                                        index
                                                                    ].country
                                                                );
                                                                setValue(
                                                                    "venue.postcodeZip",
                                                                    existingVenues[
                                                                        index
                                                                    ]
                                                                        .postcodeZip
                                                                );
                                                                setExistingVenues(
                                                                    []
                                                                );
                                                            }}
                                                            p={2}
                                                            _hover={{
                                                                bg: "gray.100",
                                                                cursor: "pointer",
                                                            }}
                                                            w="full"
                                                            direction="column"
                                                            key={venue.id}
                                                        >
                                                            <Text>
                                                                {venue.name}
                                                            </Text>
                                                            <Text>{`${[
                                                                venue.address,
                                                                venue.city,
                                                                venue.state,
                                                                venue.country,
                                                            ].join(
                                                                ", "
                                                            )}`}</Text>
                                                        </Flex>
                                                    )
                                                )}
                                            {!isAddingEventManually &&
                                                existingVenueSearched &&
                                                existingVenues.length === 0 && (
                                                    <Text
                                                        w="full"
                                                        fontSize="lg"
                                                    >
                                                        No Venues found
                                                    </Text>
                                                )}
                                        </VStack>
                                        <Box
                                            w="full"
                                            opacity={
                                                isAddingEventManually ? 1 : 0
                                            }
                                            h={
                                                isAddingEventManually
                                                    ? "unset"
                                                    : 0
                                            }
                                            overflow={
                                                isAddingEventManually
                                                    ? "unset"
                                                    : "hidden"
                                            }
                                        >
                                            <TextInput
                                                title="Name"
                                                type="text"
                                                size="lg"
                                                fieldProps={register(
                                                    "venue.name"
                                                )}
                                                height="60px"
                                                variant="outline"
                                                error={
                                                    errors.venue?.name?.message
                                                }
                                                required
                                            />
                                            <Box w="full">
                                                {isSearchingForAddress ? (
                                                    <VStack
                                                        w="full"
                                                        alignItems="flex-start"
                                                    >
                                                        <Button
                                                            mb={6}
                                                            mt={4}
                                                            onClick={() =>
                                                                setIsSearchingForAddress(
                                                                    false
                                                                )
                                                            }
                                                            variant="link"
                                                        >
                                                            Enter location
                                                            manually
                                                        </Button>
                                                        <Flex
                                                            w="full"
                                                            alignItems="center"
                                                            gap={4}
                                                        >
                                                            <GooglePlacesSearch
                                                                onPlaceChange={(
                                                                    place
                                                                ) => {
                                                                    setValue(
                                                                        "venue.address",
                                                                        place.address
                                                                    );
                                                                    setValue(
                                                                        "venue.city",
                                                                        place.city
                                                                    );
                                                                    setValue(
                                                                        "venue.state",
                                                                        place.state
                                                                    );
                                                                    setValue(
                                                                        "venue.country",
                                                                        place.country
                                                                    );
                                                                    setValue(
                                                                        "venue.postcodeZip",
                                                                        place.postcodeZip
                                                                    );
                                                                }}
                                                            />
                                                        </Flex>
                                                    </VStack>
                                                ) : (
                                                    <Button
                                                        mb={7}
                                                        onClick={() =>
                                                            setIsSearchingForAddress(
                                                                true
                                                            )
                                                        }
                                                        variant="link"
                                                    >
                                                        Search for a location
                                                    </Button>
                                                )}
                                            </Box>
                                            <VStack
                                                h={
                                                    !isSearchingForAddress
                                                        ? "unset"
                                                        : 0
                                                }
                                                overflow={
                                                    !isSearchingForAddress
                                                        ? "unset"
                                                        : "hidden"
                                                }
                                                opacity={
                                                    !isSearchingForAddress
                                                        ? 1
                                                        : 0
                                                }
                                                w="full"
                                                spacing={4}
                                            >
                                                <TextInput
                                                    title="Street Address"
                                                    type="text"
                                                    size="lg"
                                                    fieldProps={register(
                                                        "venue.address"
                                                    )}
                                                    height="60px"
                                                    variant="outline"
                                                    error={
                                                        errors.venue?.address
                                                            ?.message
                                                    }
                                                    required
                                                />
                                                <TextInput
                                                    title="City/Town"
                                                    type="text"
                                                    size="lg"
                                                    fieldProps={register(
                                                        "venue.city"
                                                    )}
                                                    height="60px"
                                                    variant="outline"
                                                    error={
                                                        errors.venue?.city
                                                            ?.message
                                                    }
                                                    required
                                                />
                                                <TextInput
                                                    title="County/State"
                                                    type="text"
                                                    size="lg"
                                                    fieldProps={register(
                                                        "venue.state"
                                                    )}
                                                    height="60px"
                                                    variant="outline"
                                                    error={
                                                        errors.venue?.state
                                                            ?.message
                                                    }
                                                    required
                                                />
                                                <TextInput
                                                    title="Country"
                                                    type="text"
                                                    size="lg"
                                                    fieldProps={register(
                                                        "venue.country"
                                                    )}
                                                    height="60px"
                                                    variant="outline"
                                                    error={
                                                        errors.venue?.country
                                                            ?.message
                                                    }
                                                    required
                                                />
                                                <TextInput
                                                    title="Postcode/Zip"
                                                    type="text"
                                                    size="lg"
                                                    fieldProps={register(
                                                        "venue.postcodeZip"
                                                    )}
                                                    height="60px"
                                                    variant="outline"
                                                    error={
                                                        errors.venue
                                                            ?.postcodeZip
                                                            ?.message
                                                    }
                                                    required
                                                />
                                            </VStack>
                                        </Box>
                                    </VStack>
                                </VStack>
                            </VStack>
                            <HStack w="full" justifyContent="flex-end">
                                <Button
                                    variant="ghost"
                                    colorScheme="red"
                                    mr={3}
                                    onClick={handleModalClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={handleSubmit(onSave)}
                                    colorScheme="blue"
                                >
                                    Save
                                </Button>
                            </HStack>
                        </VStack>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddEventModal;
