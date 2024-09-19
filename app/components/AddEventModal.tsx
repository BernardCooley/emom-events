import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Flex,
    HStack,
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
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import { addEvent, addVenue, searchVenue } from "@/bff";
import { FirebaseImageBlob, VenueItem } from "@/types";
import AddEventGeneralFields from "./AddEventGeneralFields";
import AddressPanel from "./AddressPanel";
import VenueSearch from "./VenueSearch";
import AddressSearch from "./AddressSearch";
import { uploadFirebaseImage } from "@/firebase/functions";

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
    promoterId: string;
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: FormData;
    existingImages?: FirebaseImageBlob[];
};

const AddEventModal = ({
    isOpen,
    onClose,
    defaultValues,
    existingImages,
    promoterId,
}: Props) => {
    const [showAddressPanel, setShowAddressPanel] = useState(false);
    const [selectedVenueIndex, setSelectedVenueIndex] = useState<number | null>(
        null
    );
    const [images, setImages] = useState<FirebaseImageBlob[]>(
        existingImages || []
    );
    const [isVenueManual, setIsVenueManual] = useState(false);
    const [venues, setVenues] = useState<VenueItem[] | null>([]);
    const [isAddressManual, setIsAddressManual] = useState(true);
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
        // TODO: Only add of its a new venue
        const newVenue = await addVenue({
            data: {
                name: formData.venue.name,
                address: formData.venue.address,
                city: formData.venue.city,
                state: formData.venue.state,
                country: formData.venue.country,
                postcodeZip: formData.venue.postcodeZip,
            },
        });

        if (newVenue) {
            const newEvent = await addEvent({
                data: {
                    promoterId: promoterId,
                    venueId: newVenue.id,
                    name: formData.name,
                    timeFrom: formData.timeFrom,
                    timeTo: formData.timeTo,
                    description: formData.description,
                    websites: [],
                    imageIds: images.map((image) => image.name),
                    tickets: [],
                    lineup: formData.lineup,
                },
            });

            if (newEvent && images.length) {
                await Promise.all(
                    images.map(async (image) => {
                        await uploadFirebaseImage(
                            "eventImages",
                            new File([image.blob], image.name),
                            newEvent.id
                        );
                        return image.name;
                    })
                );
            }
        } else {
            // TODO: Remove venue
        }
    };

    const handleSearchVenue = async () => {
        const venues = await searchVenue({
            name: getValues("venueSearchTerm"),
        });

        if (venues) setVenues(venues);
    };

    const handleArtistAdd = () => {
        const val = getValues("artist");

        if (val.length > 0) {
            setValue("lineup", Array.from(new Set([...watchLineup, val])));
            setValue("artist", "");
        }
    };

    const handleModalClose = () => {
        setVenues(null);
        setIsVenueManual(false);
        setIsAddressManual(true);
        setImages([]);
        setSelectedVenueIndex(null);
        reset();
        onClose();
    };

    const handleVenueClick = (index: number) => {
        setSelectedVenueIndex(index);
        setIsVenueManual(true);
        if (venues) {
            setValue("venue.name", venues[index].name);
            setVenueAddressFields(venues[index]);
        }
        setVenues(null);
    };

    const setVenueAddressFields = (venue: VenueItem) => {
        setValue("venue.address", venue.address);
        setValue("venue.city", venue.city);
        setValue("venue.state", venue.state);
        setValue("venue.country", venue.country);
        setValue("venue.postcodeZip", venue.postcodeZip);
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
                                <AddEventGeneralFields
                                    errors={errors}
                                    register={register}
                                    images={images}
                                    onImageSelect={(images) =>
                                        setImages(images)
                                    }
                                    onImageRemove={(images) =>
                                        setImages(images)
                                    }
                                    onArtistChange={(artist) =>
                                        setValue("artist", artist)
                                    }
                                    onArtistAdd={handleArtistAdd}
                                    artistValue={watchArtist}
                                    lineupValue={watchLineup}
                                    onArtistRemove={(index) =>
                                        setValue(
                                            "lineup",
                                            watchLineup.filter(
                                                (_, i) => i !== index
                                            )
                                        )
                                    }
                                />
                                <Divider />
                                <VStack w="full" alignItems="start">
                                    <Flex w="full">
                                        <Text fontSize="lg">Venue</Text>
                                        <Box color="gpRed.500" pl={1}>
                                            *
                                        </Box>
                                    </Flex>

                                    {selectedVenueIndex !== null ||
                                    showAddressPanel ? (
                                        <AddressPanel
                                            address={{
                                                name: getValues("venue.name"),
                                                address:
                                                    getValues("venue.address"),
                                                city: getValues("venue.city"),
                                                state: getValues("venue.state"),
                                                country:
                                                    getValues("venue.country"),
                                                postcodeZip:
                                                    getValues(
                                                        "venue.postcodeZip"
                                                    ),
                                            }}
                                            onEdit={() => {
                                                setShowAddressPanel(false);
                                                setSelectedVenueIndex(null);
                                                setIsVenueManual(true);
                                                setIsAddressManual(true);
                                            }}
                                        />
                                    ) : (
                                        <VStack
                                            p={6}
                                            border="1px solid"
                                            borderColor="gray.300"
                                            w="full"
                                            spacing={6}
                                            rounded="lg"
                                            alignItems="flex-start"
                                        >
                                            <VenueSearch
                                                isManual={isVenueManual}
                                                register={register}
                                                onAddManuallyClick={() =>
                                                    setIsVenueManual(true)
                                                }
                                                onVenueSearchChange={(val) =>
                                                    setValue(
                                                        "venueSearchTerm",
                                                        val
                                                    )
                                                }
                                                handleSearchVenue={
                                                    handleSearchVenue
                                                }
                                                venueSearchTerm={
                                                    watchVenueSearchTerm
                                                }
                                                onSearchClick={() => {
                                                    setIsVenueManual(false);
                                                    setValue(
                                                        "venueSearchTerm",
                                                        ""
                                                    );
                                                }}
                                                showResults={
                                                    venues!! &&
                                                    !selectedVenueIndex
                                                }
                                                venues={venues}
                                                handleVenueClick={(val) =>
                                                    handleVenueClick(val)
                                                }
                                            />

                                            <Box
                                                w="full"
                                                opacity={isVenueManual ? 1 : 0}
                                                h={isVenueManual ? "unset" : 0}
                                                overflow={
                                                    isVenueManual
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
                                                        errors.venue?.name
                                                            ?.message
                                                    }
                                                    required
                                                />

                                                <AddressSearch
                                                    onAcceptVenue={() => {
                                                        setShowAddressPanel(
                                                            true
                                                        );
                                                    }}
                                                    register={register}
                                                    errors={errors}
                                                    isManual={isAddressManual}
                                                    onManualButtonClick={() =>
                                                        setIsAddressManual(true)
                                                    }
                                                    onPlaceChange={(place) => {
                                                        setVenueAddressFields(
                                                            place
                                                        );
                                                    }}
                                                    onSearchClick={() =>
                                                        setIsAddressManual(
                                                            false
                                                        )
                                                    }
                                                />
                                            </Box>
                                        </VStack>
                                    )}
                                </VStack>
                            </VStack>
                            <HStack w="full" justifyContent="flex-end">
                                <Button
                                    variant="ghost"
                                    colorScheme="red"
                                    mr={3}
                                    onClick={handleModalClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit(onSave)}
                                    colorScheme="blue"
                                >
                                    Create Event
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
