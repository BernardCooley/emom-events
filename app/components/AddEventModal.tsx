import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Center,
    Collapse,
    Divider,
    Flex,
    HStack,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    VisuallyHidden,
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
import AddressPanel from "./AddressPanel";
import VenueSearch from "./VenueSearch";
import {
    getFirebaseImageBlob,
    uploadFirebaseImage,
} from "@/firebase/functions";
import { Event, Venue } from "@prisma/client";
import ImageCropper from "./ImageCropper";
import {
    formatForDateTimeField,
    getUrlFromBlob,
    handleProfileImageChange,
} from "@/utils";
import GooglePlacesSearch from "./GooglePlacesSearch";
import FileUpload from "./FileUpload";
import { CloseIcon } from "@chakra-ui/icons";
import TextFieldChipGroup from "./TextFieldChipGroup";

export interface FormData {
    name: Event["name"];
    timeFrom: Event["timeFrom"];
    timeTo: Event["timeTo"];
    description: Event["description"];
    lineup: Event["lineup"];
    venue: {
        id: Venue["id"];
        name: Venue["name"];
        address: Venue["address"];
        city: Venue["city"];
        state: Venue["state"];
        country: Venue["country"];
        postcodeZip: Venue["postcodeZip"];
        latitude: Venue["latitude"];
        longitude: Venue["longitude"];
    };
    venueSearchTerm: string;
    artist: Event["lineup"][number];
    imageId: Event["imageIds"][number];
    googlePlaceSearch: string;
    website: Event["websites"][number];
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
            id: z.string(),
            name: z.string().min(1, "Venue name is required"),
            address: z.string(),
            city: z.string().min(1, "Venue city is required"),
            state: z.string().min(1, "Venue state is required"),
            country: z.string().min(1, "Venue country is required"),
            postcodeZip: z.string(),
            latitude: z.number(),
            longitude: z.number(),
        }),
        venueSearchTerm: z.string(),
        artist: z.string(),
        imageId: z.string().min(1, {
            message: "An Event image is required",
        }),
        googlePlaceSearch: z.string(),
        website: z.string(),
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
    existingEventImage: FirebaseImageBlob | null;
    onSuccess: () => void;
    onFail: () => void;
    eventId?: string;
};

const AddEventModal = ({
    isOpen,
    onClose,
    defaultValues,
    existingEventImage,
    promoterId,
    onSuccess,
    onFail,
    eventId,
}: Props) => {
    const imageGridRef = useRef<HTMLDivElement>(null);
    const [imageToUpload, setImageToUpload] = useState<File | null>(null);
    const [croppedImage, setCroppedImage] = useState<FirebaseImageBlob | null>(
        null
    );
    const [isSaving, setIsSaving] = useState(false);
    const [venueSearched, setVenueSearched] = useState(false);
    const [showAddressPanel, setShowAddressPanel] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState<VenueItem | null>(null);
    const [eventImage, setEventImage] = useState<FirebaseImageBlob | null>(
        existingEventImage
    );
    const [isVenueManual, setIsVenueManual] = useState(false);
    const [venues, setVenues] = useState<VenueItem[] | null>([]);
    const [libraries] = useState<Library[]>(["places"]);
    const todayDateFormatted = formatForDateTimeField(new Date());

    useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: libraries,
    });

    const formMethods = useForm<FormData>({
        mode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            name: defaultValues?.name || "",
            timeFrom: defaultValues?.timeFrom || "",
            timeTo: defaultValues?.timeTo || "",
            description: defaultValues?.description || "",
            lineup: defaultValues?.lineup || [],
            venue: {
                id: defaultValues?.venue.id || "",
                name: defaultValues?.venue.name || "",
                address: defaultValues?.venue.address || "",
                city: defaultValues?.venue.city || "",
                state: defaultValues?.venue.state || "",
                country: defaultValues?.venue.country || "",
                postcodeZip: defaultValues?.venue.postcodeZip || "",
                latitude: defaultValues?.venue.latitude || 0,
                longitude: defaultValues?.venue.longitude || 0,
            },
            imageId: defaultValues?.imageId || "",
            googlePlaceSearch: "",
            websites: defaultValues?.websites || [],
        },
    });

    const {
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        trigger,
        control,
        formState: { errors },
    } = formMethods;

    const watchLineup = watch("lineup");
    const watchWebsites = watch("websites");
    const watchWebsite = watch("website");

    useEffect(() => {
        if (showAddressPanel) trigger("venue");
    }, [showAddressPanel, trigger]);

    useEffect(() => {
        if (croppedImage ? true : false) {
            imageGridRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [croppedImage]);

    useEffect(() => {
        if (croppedImage) {
            setEventImage(croppedImage);
            setValue("imageId", croppedImage.name);
            trigger("imageId");
        }
    }, [croppedImage, setValue, trigger]);

    const getImages = useCallback(async () => {
        if (defaultValues?.imageId && eventId) {
            const imageBlob = await getFirebaseImageBlob(
                `eventImages/${eventId}/${defaultValues.imageId}`,
                defaultValues.imageId
            );

            if (imageBlob) setEventImage(imageBlob);
        }
    }, [defaultValues, eventId]);

    useEffect(() => {
        reset(defaultValues);
        if (defaultValues?.venue) {
            setSelectedVenue({
                id: defaultValues.venue.id,
                name: defaultValues.venue.name,
                address: defaultValues.venue.address,
                city: defaultValues.venue.city,
                state: defaultValues.venue.state,
                country: defaultValues.venue.country,
                postcodeZip: defaultValues.venue.postcodeZip,
                latitude: defaultValues.venue.latitude,
                longitude: defaultValues.venue.longitude,
            });
            setIsVenueManual(true);
        }

        getImages();
    }, [defaultValues, reset, eventId, getImages]);

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
                    latitude: formData.venue.latitude,
                    longitude: formData.venue.longitude,
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
                    websites: formData.websites,
                    imageIds: eventImage ? [eventImage.name] : [],
                    tickets: [],
                    lineup: formData.lineup,
                },
            });

            if (newEvent && eventImage) {
                await uploadFirebaseImage(
                    "eventImages",
                    new File([eventImage.blob], eventImage.name),
                    newEvent.id
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
        let newVenue: VenueItem | null = null;

        const imageIds = await handleProfileImageChange(
            "eventImages",
            eventId as string,
            eventImage,
            existingEventImage
        );

        const venueUpdated =
            defaultValues?.venue.address !== formData.venue.address ||
            defaultValues.venue.city !== formData.venue.city ||
            defaultValues.venue.state !== formData.venue.state ||
            defaultValues.venue.country !== formData.venue.country ||
            defaultValues.venue.postcodeZip !== formData.venue.postcodeZip ||
            defaultValues.venue.latitude !== formData.venue.latitude ||
            defaultValues.venue.longitude !== formData.venue.longitude;

        if (venueUpdated) {
            newVenue = await addVenue({
                data: {
                    name: formData.venue.name,
                    address: formData.venue.address,
                    city: formData.venue.city,
                    state: formData.venue.state,
                    country: formData.venue.country,
                    postcodeZip: formData.venue.postcodeZip,
                    latitude: formData.venue.latitude,
                    longitude: formData.venue.longitude,
                },
            });
        }

        const updatedEvent = await updateEvent({
            id: eventId as string,
            event: {
                name: formData.name,
                timeFrom: formData.timeFrom,
                timeTo: formData.timeTo,
                description: formData.description,
                imageIds: imageIds,
                lineup: formData.lineup,
                venueId: newVenue ? newVenue.id : defaultValues?.venue.id,
                websites: formData.websites,
            },
        });

        if (updatedEvent) {
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
            searchTerm: getValues("venueSearchTerm"),
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

    const handleWebsiteAdd = () => {
        let val = getValues("website");
        if (!val.startsWith("https://")) {
            val = `https://${val}`;
        }

        if (val.length > 0) {
            setValue("websites", Array.from(new Set([...watchWebsites, val])));
            setValue("website", "");
        }
    };

    const handleModalClose = () => {
        setVenues(null);
        setIsVenueManual(false);
        setEventImage(null);
        setSelectedVenue(null);
        setVenueSearched(false);
        setIsSaving(false);
        setShowAddressPanel(false);
        setImageToUpload(null);
        setCroppedImage(null);
        reset();
        onClose();
    };

    const handleVenueClick = (venue: VenueItem) => {
        setSelectedVenue(venue);
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
        setValue("venue.latitude", venue.latitude);
        setValue("venue.longitude", venue.longitude);
        setShowAddressPanel(true);
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
                    <ImageCropper
                        onCancel={() => {
                            setImageToUpload(null);
                        }}
                        image={imageToUpload}
                        onSuccess={(image) => {
                            setCroppedImage(image);
                            setImageToUpload(null);
                        }}
                    />

                    <Collapse in={!imageToUpload}>
                        <form
                            onSubmit={handleSubmit(onSave, (errors) =>
                                console.log(errors)
                            )}
                        >
                            <VStack gap={6}>
                                <VStack gap={6} w="full">
                                    <VStack gap={6} w="full">
                                        <TextInput
                                            type="text"
                                            title="Name"
                                            size="lg"
                                            name="name"
                                            error={errors.name?.message}
                                            control={control}
                                            required
                                        />
                                        <TextInput
                                            type="text"
                                            title="Description"
                                            size="lg"
                                            name="description"
                                            error={errors.description?.message}
                                            control={control}
                                            required
                                            isTextArea
                                        />
                                        <VStack w="full" alignItems="start">
                                            <Flex w="full">
                                                <Text fontSize="lg">Venue</Text>
                                                <Box color="gpRed.500" pl={1}>
                                                    *
                                                </Box>
                                            </Flex>

                                            {selectedVenue ||
                                            showAddressPanel ? (
                                                <>
                                                    <AddressPanel
                                                        errors={errors}
                                                        address={{
                                                            name: getValues(
                                                                "venue.name"
                                                            ),
                                                            address:
                                                                getValues(
                                                                    "venue.address"
                                                                ),
                                                            city: getValues(
                                                                "venue.city"
                                                            ),
                                                            state: getValues(
                                                                "venue.state"
                                                            ),
                                                            country:
                                                                getValues(
                                                                    "venue.country"
                                                                ),
                                                            postcodeZip:
                                                                getValues(
                                                                    "venue.postcodeZip"
                                                                ),
                                                        }}
                                                        onEdit={() => {
                                                            setVenues(null);
                                                            setIsVenueManual(
                                                                false
                                                            );
                                                            setValue(
                                                                "venueSearchTerm",
                                                                ""
                                                            );
                                                            setVenueSearched(
                                                                false
                                                            );
                                                            setShowAddressPanel(
                                                                false
                                                            );
                                                            setSelectedVenue(
                                                                null
                                                            );
                                                        }}
                                                    />
                                                    {errors?.venue && (
                                                        <VStack
                                                            fontSize="14px"
                                                            color="#e53e3e"
                                                        >
                                                            <Text>
                                                                {
                                                                    errors.venue
                                                                        .city
                                                                        ?.message
                                                                }
                                                            </Text>
                                                            <Text>
                                                                {
                                                                    errors.venue
                                                                        .country
                                                                        ?.message
                                                                }
                                                            </Text>
                                                            <Text>
                                                                {
                                                                    errors.venue
                                                                        .state
                                                                        ?.message
                                                                }
                                                            </Text>
                                                        </VStack>
                                                    )}
                                                </>
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
                                                        isEditing={
                                                            defaultValues
                                                                ? true
                                                                : false
                                                        }
                                                        onRevert={() => {
                                                            setVenueAddressFields(
                                                                {
                                                                    id: "",
                                                                    name: getValues(
                                                                        "venue.name"
                                                                    ),
                                                                    address:
                                                                        defaultValues
                                                                            ?.venue
                                                                            .address ||
                                                                        "",
                                                                    city:
                                                                        defaultValues
                                                                            ?.venue
                                                                            .city ||
                                                                        "",
                                                                    state:
                                                                        defaultValues
                                                                            ?.venue
                                                                            .state ||
                                                                        "",
                                                                    country:
                                                                        defaultValues
                                                                            ?.venue
                                                                            .country ||
                                                                        "",
                                                                    postcodeZip:
                                                                        defaultValues
                                                                            ?.venue
                                                                            .postcodeZip ||
                                                                        "",
                                                                    latitude:
                                                                        defaultValues
                                                                            ?.venue
                                                                            .latitude ||
                                                                        0,
                                                                    longitude:
                                                                        defaultValues
                                                                            ?.venue
                                                                            .longitude ||
                                                                        0,
                                                                }
                                                            );
                                                        }}
                                                        control={control}
                                                        errors={errors}
                                                        isManual={isVenueManual}
                                                        onAddManuallyClick={() => {
                                                            setIsVenueManual(
                                                                true
                                                            );
                                                            setVenueSearched(
                                                                false
                                                            );
                                                        }}
                                                        handleSearchVenue={
                                                            handleSearchVenue
                                                        }
                                                        venueSearchTerm={watch(
                                                            "venueSearchTerm"
                                                        )}
                                                        onExistingVenueSearchClick={() => {
                                                            setVenues(null);
                                                            setIsVenueManual(
                                                                false
                                                            );
                                                            setValue(
                                                                "venueSearchTerm",
                                                                ""
                                                            );
                                                            setVenueSearched(
                                                                false
                                                            );
                                                        }}
                                                        showResults={
                                                            venues !== null &&
                                                            venues.length > 0 &&
                                                            !selectedVenue
                                                        }
                                                        venues={venues}
                                                        handleVenueClick={(
                                                            val
                                                        ) =>
                                                            handleVenueClick(
                                                                val
                                                            )
                                                        }
                                                        venueSearched={
                                                            venueSearched
                                                        }
                                                    />

                                                    <VStack
                                                        gap={10}
                                                        w="full"
                                                        sx={
                                                            isVenueManual
                                                                ? {}
                                                                : {
                                                                      opacity: 0,
                                                                      h: 0,
                                                                      overflow:
                                                                          "hidden",
                                                                  }
                                                        }
                                                    >
                                                        <TextInput
                                                            type="text"
                                                            title="Name"
                                                            size="lg"
                                                            name="venue.name"
                                                            error={
                                                                errors.venue
                                                                    ?.name
                                                                    ?.message
                                                            }
                                                            control={control}
                                                        />

                                                        <GooglePlacesSearch
                                                            control={control}
                                                            onPlaceChange={(
                                                                place
                                                            ) => {
                                                                setVenueAddressFields(
                                                                    {
                                                                        name: getValues(
                                                                            "venue.name"
                                                                        ),
                                                                        id: "",
                                                                        ...place,
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </VStack>
                                                </VStack>
                                            )}
                                        </VStack>
                                        <FileUpload
                                            onImageSelected={(file) =>
                                                setImageToUpload(file)
                                            }
                                            allowErrors
                                            fieldLabel="Images"
                                            accept="image/*"
                                            buttonText="Upload an image..."
                                            error={errors.imageId?.message}
                                            required
                                        />
                                        {eventImage && (
                                            <Box position="relative" w="300px">
                                                <IconButton
                                                    rounded="full"
                                                    right={1}
                                                    top={1}
                                                    h="28px"
                                                    w="28px"
                                                    minW="unset"
                                                    position="absolute"
                                                    aria-label="Remove image"
                                                    icon={<CloseIcon />}
                                                    onClick={() => {
                                                        setEventImage(null);
                                                        setValue("imageId", "");
                                                        trigger("imageId");
                                                    }}
                                                />

                                                <Image
                                                    src={getUrlFromBlob(
                                                        eventImage
                                                    )}
                                                    alt=""
                                                />
                                            </Box>
                                        )}
                                        <VisuallyHidden ref={imageGridRef}>
                                            image grid ref
                                        </VisuallyHidden>
                                        <TextInput
                                            type="datetime-local"
                                            title="From"
                                            size="lg"
                                            name="timeFrom"
                                            error={errors.timeFrom?.message}
                                            control={control}
                                            required
                                            min={todayDateFormatted}
                                        />
                                        <TextInput
                                            min={watch("timeFrom")}
                                            type="datetime-local"
                                            title="To"
                                            size="lg"
                                            name="timeTo"
                                            control={control}
                                        />
                                        <TextFieldChipGroup
                                            onEnter={handleArtistAdd}
                                            fieldValue={watch("artist")}
                                            onRemoveChip={(index) =>
                                                setValue(
                                                    "lineup",
                                                    watchLineup.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                            chips={watchLineup}
                                            control={control}
                                        />
                                        <TextFieldChipGroup
                                            onEnter={handleWebsiteAdd}
                                            fieldValue={watchWebsite}
                                            onRemoveChip={(index) =>
                                                setValue(
                                                    "websites",
                                                    watchWebsites.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                            chips={watchWebsites}
                                            control={control}
                                        />
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
                                        isLoading={isSaving}
                                        type="submit"
                                        colorScheme="blue"
                                    >
                                        {eventId
                                            ? "Update Event"
                                            : "Create Event"}
                                    </Button>
                                </HStack>
                            </VStack>
                        </form>
                    </Collapse>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddEventModal;
