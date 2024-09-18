import React, { useRef } from "react";
import {
    Box,
    Button,
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
import ChipGroup from "./ChipGroup";

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
}

const schema: ZodType<FormData> = z.object({
    name: z.string().min(1, "Name is required"),
    timeFrom: z.string().min(1, "Start time is required"),
    timeTo: z.string().min(1, "End time is required"),
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
});

type Props = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: FormData;
};

const AddEventModal = ({ isOpen, onClose, defaultValues }: Props) => {
    const addArtistRef = useRef<HTMLInputElement>(null);
    const {
        handleSubmit,
        register,
        setValue,
        watch,
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

    const onSave = async (formData: FormData) => {
        console.log(formData);
    };

    return (
        <Modal
            closeOnOverlayClick={false}
            closeOnEsc={false}
            isOpen={isOpen}
            onClose={onClose}
            size="6xl"
        >
            <ModalOverlay />
            <ModalContent h="80vh" overflowY="scroll">
                <ModalHeader>Add Event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
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
                                <TextInput
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
                                    ref={addArtistRef}
                                    title="Add Artist"
                                    type="text"
                                    size="lg"
                                    height="60px"
                                    variant="outline"
                                    onEnter={() => {
                                        const val = addArtistRef.current?.value;

                                        if (val) {
                                            setValue(
                                                "lineup",
                                                Array.from(
                                                    new Set([
                                                        ...watchLineup,
                                                        val?.toLowerCase(),
                                                    ])
                                                )
                                            );
                                            addArtistRef.current!.value = "";
                                        }
                                    }}
                                />
                                <ChipGroup
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
                                    >
                                        <TextInput
                                            title="Name"
                                            type="text"
                                            size="lg"
                                            fieldProps={register("venue.name")}
                                            height="60px"
                                            variant="outline"
                                            error={errors.venue?.name?.message}
                                            required
                                        />
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
                                                errors.venue?.address?.message
                                            }
                                            required
                                        />
                                        <TextInput
                                            title="City/Town"
                                            type="text"
                                            size="lg"
                                            fieldProps={register("venue.city")}
                                            height="60px"
                                            variant="outline"
                                            error={errors.venue?.city?.message}
                                            required
                                        />
                                        <TextInput
                                            title="County/State"
                                            type="text"
                                            size="lg"
                                            fieldProps={register("venue.state")}
                                            height="60px"
                                            variant="outline"
                                            error={errors.venue?.state?.message}
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
                                                errors.venue?.country?.message
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
                                                errors.venue?.postcodeZip
                                                    ?.message
                                            }
                                            required
                                        />
                                    </VStack>
                                </VStack>
                            </VStack>
                            <HStack w="full" justifyContent="flex-end">
                                <Button
                                    variant="ghost"
                                    colorScheme="red"
                                    mr={3}
                                    onClick={onClose}
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
