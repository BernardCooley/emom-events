import React, { useRef } from "react";
import {
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
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
                                    error={errors.lineup?.message}
                                    onEnter={() => {
                                        const val = addArtistRef.current?.value;

                                        if (val) {
                                            setValue("lineup", [
                                                ...watchLineup,
                                                val,
                                            ]);
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
