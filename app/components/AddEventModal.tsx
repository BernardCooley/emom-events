import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TextInput } from "./TextInput";
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import {
    addEvent,
    addVenue,
    deleteVenue,
    searchVenue,
    updateEvent,
} from "@/bff";
import { FirebaseImageBlob, VenueItem } from "@/types";
import AddEventGeneralFields from "./AddEventGeneralFields";
import AddressPanel from "./AddressPanel";
import VenueSearch from "./VenueSearch";
import AddressSearch from "./AddressSearch";
import {
    deleteFirebaseImage,
    getFirebaseImageBlob,
    uploadFirebaseImage,
} from "@/firebase/functions";
import { Event, Venue } from "@prisma/client";

export interface FormData {
    name: Event["name"];
    timeFrom: Event["timeFrom"];
    timeTo: Event["timeTo"];
    description: Event["description"];
    lineup: Event["lineup"];
    venue: {
        name: Venue["name"];
        address: Venue["address"];
        city: Venue["city"];
        state: Venue["state"];
        country: Venue["country"];
        postcodeZip: Venue["postcodeZip"];
    };
    venueSearchTerm: string;
    artist: Event["lineup"][0];
    imageIds: Event["imageIds"];
    websites: Event["websites"];
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
            address: z.string(),
            city: z.string().min(1, "Venue city is required"),
            state: z.string().min(1, "Venue state is required"),
            country: z.string().min(1, "Venue country is required"),
            postcodeZip: z.string(),
        }),
        venueSearchTerm: z.string(),
        artist: z.string(),
        imageIds: z.array(z.string()).min(1, {
            message: "At least one image is required",
        }),
        websites: z.array(z.string()),
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
    onSuccess: () => void;
    onFail: () => void;
    eventId?: string;
};

const AddEventModal = ({
    isOpen,
    onClose,
    defaultValues,
    existingImages,
    promoterId,
    onSuccess,
    onFail,
    eventId,
}: Props) => {
    const [isSaving, setIsSaving] = useState(false);
    const [venueSearched, setVenueSearched] = useState(false);
    const [showAddressPanel, setShowAddressPanel] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState<VenueItem | null>(null);
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

    useEffect(() => {
        reset(defaultValues);
        if (defaultValues?.venue) {
            setSelectedVenue({
                id: "",
                name: defaultValues.venue.name,
                address: defaultValues.venue.address,
                city: defaultValues.venue.city,
                state: defaultValues.venue.state,
                country: defaultValues.venue.country,
                postcodeZip: defaultValues.venue.postcodeZip,
            });
            setIsVenueManual(true);
        }

        getImages();
    }, [defaultValues]);

    const getImages = async () => {
        if (defaultValues?.imageIds && eventId) {
            const imgs = await Promise.all(
                defaultValues?.imageIds.map(async (image) => {
                    return await getFirebaseImageBlob(
                        `eventImages/${eventId}/${image}`,
                        image
                    );
                })
            );
            const removeUndefined = imgs.filter(
                (img) => img !== undefined
            ) as FirebaseImageBlob[];

            if (imgs) setImages(removeUndefined);
        }
    };

    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        watch,
        reset,
        trigger,
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
            imageIds: [],
        },
    });

    const watchLineup = watch("lineup");
    const watchVenueSearchTerm = watch("venueSearchTerm");
    const watchArtist = watch("artist");

    const onCreateEvent = async (formData: FormData) => {
        let venue = null;

        if (!selectedVenue) {
            venue = await addVenue({
                data: {
                    name: formData.venue.name,
                    address: formData.venue.address,
                    city: formData.venue.city,
                    state: formData.venue.state,
                    country: formData.venue.country,
                    postcodeZip: formData.venue.postcodeZip,
                },
            });
        } else {
            venue = selectedVenue;
        }

        if (venue) {
            const newEvent = await addEvent({
                data: {
                    promoterId: promoterId,
                    venueId: venue.id,
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

            if (newEvent) {
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
                onSuccess();
                handleModalClose();
            } else {
                if (!selectedVenue) {
                    await deleteVenue({
                        venueId: venue.id,
                    });
                }
                onFail();
                handleModalClose();
            }
        } else {
            onFail();
            handleModalClose();
            console.error("Failed to add venue");
        }
    };

    const onUpdateEvent = async (formData: FormData) => {
        const updatedEvent = await updateEvent({
            id: eventId as string,
            event: {
                name: formData.name,
                timeFrom: formData.timeFrom,
                timeTo: formData.timeTo,
                description: formData.description,
                imageIds: images.map((image) => image.name),
                lineup: formData.lineup,
            },
            venue: {
                name: formData.venue.name,
                address: formData.venue.address,
                city: formData.venue.city,
                state: formData.venue.state,
                country: formData.venue.country,
                postcodeZip: formData.venue.postcodeZip,
            },
        });

        if (updatedEvent) {
            const imagesToUpload = images?.filter(
                (img) => !existingImages?.find((i) => i.name === img.name)
            );

            const imagesToDelete = existingImages?.filter(
                (img) => !images.find((i) => i.name === img.name)
            );

            if (imagesToUpload.length) {
                await Promise.all(
                    imagesToUpload.map(async (image) => {
                        await uploadFirebaseImage(
                            "eventImages",
                            new File([image.blob], image.name),
                            updatedEvent.id
                        );
                        return image.name;
                    })
                );
            }

            if (imagesToDelete && imagesToDelete.length) {
                await Promise.all(
                    imagesToDelete.map(async (img) => {
                        const fileToDelete = new File([img.blob], img.name);
                        await deleteFirebaseImage(
                            "eventImages",
                            fileToDelete.name,
                            updatedEvent.id
                        );
                    })
                );
            }
            onSuccess();
            handleModalClose();
        } else {
            onFail();
            handleModalClose();
        }
    };

    const onSave = async (formData: FormData) => {
        setIsSaving(true);
        if (eventId) {
            await onUpdateEvent(formData);
        } else {
            await onCreateEvent(formData);
        }
    };

    const handleSearchVenue = async () => {
        const venues = await searchVenue({
            name: getValues("venueSearchTerm"),
        });

        setVenueSearched(true);
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
        setSelectedVenue(null);
        setVenueSearched(false);
        setIsSaving(false);
        setShowAddressPanel(false);
        reset();
        onClose();
    };

    const handleVenueClick = (venue: VenueItem) => {
        setSelectedVenue(venue);
        setIsVenueManual(true);
        if (venues) {
            setValue("venue.name", venue.name);
            setVenueAddressFields(venue);
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
            isCentered
        >
            <ModalOverlay />
            <ModalContent pb={10} pt={4} h="90vh" overflowY="scroll">
                <ModalHeader>
                    {eventId ? "Edit Event" : "Create Event"}
                </ModalHeader>
                <Divider />
                <ModalCloseButton />
                {isSaving && (
                    <Center position="absolute" w="full">
                        <VStack position="relative" top={40} gap={6}>
                            <Spinner
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="blue.500"
                                size="xl"
                            />
                            <Text fontSize="xl">Saving Event...</Text>
                        </VStack>
                    </Center>
                )}
                <ModalBody
                    position="relative"
                    opacity={isSaving ? 0.3 : 1}
                    pointerEvents={isSaving ? "none" : "auto"}
                    mt={6}
                >
                    <form onSubmit={handleSubmit(onSave)}>
                        <VStack gap={6}>
                            <VStack gap={6} w="full">
                                <AddEventGeneralFields
                                    errors={errors}
                                    register={register}
                                    images={images}
                                    onImageSelect={(images) => {
                                        setImages(images);
                                        setValue(
                                            "imageIds",
                                            images.map((image) => image.name)
                                        );
                                        trigger("imageIds");
                                    }}
                                    onImageRemove={(images) => {
                                        setImages(images);
                                        setValue(
                                            "imageIds",
                                            images.map((image) => image.name)
                                        );
                                        trigger("imageIds");
                                    }}
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

                                    {selectedVenue || showAddressPanel ? (
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
                                                setSelectedVenue(null);
                                                setIsVenueManual(true);
                                                setIsAddressManual(true);
                                            }}
                                        />
                                    ) : (
                                        <VStack
                                            p={6}
                                            border="1px solid"
                                            borderColor={
                                                errors.venue
                                                    ? "red"
                                                    : "gray.300"
                                            }
                                            w="full"
                                            spacing={6}
                                            rounded="lg"
                                            alignItems="flex-start"
                                        >
                                            <VenueSearch
                                                isManual={isVenueManual}
                                                register={register}
                                                onAddManuallyClick={() => {
                                                    setIsVenueManual(true);
                                                    setIsAddressManual(false);
                                                    setVenueSearched(false);
                                                }}
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
                                                    setVenues(null);
                                                    setIsVenueManual(false);
                                                    setValue(
                                                        "venueSearchTerm",
                                                        ""
                                                    );
                                                    setVenueSearched(false);
                                                }}
                                                showResults={
                                                    venues !== null &&
                                                    venues.length > 0 &&
                                                    !selectedVenue
                                                }
                                                venues={venues}
                                                handleVenueClick={(val) =>
                                                    handleVenueClick(val)
                                                }
                                                venueSearched={venueSearched}
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
                                                        trigger("venue").then(
                                                            (validated) => {
                                                                if (validated) {
                                                                    setShowAddressPanel(
                                                                        true
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }}
                                                    register={register}
                                                    errors={errors}
                                                    isManual={isAddressManual}
                                                    onManualButtonClick={() =>
                                                        setIsAddressManual(true)
                                                    }
                                                    onPlaceChange={(place) => {
                                                        setIsAddressManual(
                                                            true
                                                        );
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
                                    isDisabled={isSaving}
                                    variant="ghost"
                                    colorScheme="red"
                                    mr={3}
                                    onClick={handleModalClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    isDisabled={isSaving}
                                    onClick={handleSubmit(onSave)}
                                    colorScheme="blue"
                                >
                                    {eventId ? "Update Event" : "Create Event"}
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
