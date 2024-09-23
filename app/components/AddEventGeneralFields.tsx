import React, { useEffect, useRef } from "react";
import {
    Box,
    IconButton,
    Image,
    VisuallyHidden,
    VStack,
} from "@chakra-ui/react";
import { TextInput } from "./TextInput";
import FileUpload from "./FileUpload";
import ChipGroup from "./ChipGroup";
import { CloseIcon, SmallAddIcon } from "@chakra-ui/icons";
import { FirebaseImageBlob } from "@/types";
import { Control, FieldErrors } from "react-hook-form";
import { FormData } from "./AddEventModal";
import { getUrlFromBlob } from "@/utils";

interface Props {
    errors: FieldErrors<FormData>;
    eventImage: FirebaseImageBlob | null;
    onImageRemove: () => void;
    onArtistAdd: () => void;
    artistValue: string;
    lineupValue: string[];
    onArtistRemove: (index: number) => void;
    onImageSelected: (file: File) => void;
    isCropCompleted: boolean;
    control: Control<FormData, any>;
}

const AddEventGeneralFields = ({
    eventImage,
    onImageRemove,
    onArtistAdd,
    artistValue,
    lineupValue,
    onArtistRemove,
    errors,
    onImageSelected,
    isCropCompleted,
    control,
}: Props) => {
    const imageGridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isCropCompleted) {
            imageGridRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isCropCompleted]);

    return (
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
            <FileUpload
                onImageSelected={onImageSelected}
                allowErrors
                fieldLabel="Images"
                accept="image/*"
                buttonText="Upload an image..."
                required
                error={errors.imageId?.message}
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
                        onClick={onImageRemove}
                    />

                    <Image src={getUrlFromBlob(eventImage)} alt="" />
                </Box>
            )}
            <VisuallyHidden ref={imageGridRef}>image grid ref</VisuallyHidden>
            <TextInput
                type="datetime-local"
                title="From"
                size="lg"
                name="timeFrom"
                error={errors.timeFrom?.message}
                control={control}
                required
            />
            <TextInput
                type="datetime-local"
                title="To"
                size="lg"
                name="timeTo"
                error={errors.timeTo?.message}
                control={control}
            />

            {/* TODO fix jumping eventImage when typing */}
            <TextInput
                type="text"
                title="Add Artist"
                size="lg"
                name="artist"
                error={errors.artist?.message}
                control={control}
                onEnter={onArtistAdd}
                rightIcon={
                    artistValue?.length > 0 && (
                        <IconButton
                            mt={2}
                            h="44px"
                            w="36px"
                            minW="unset"
                            aria-label="Search"
                            icon={<SmallAddIcon fontSize="28px" />}
                            onClick={onArtistAdd}
                        />
                    )
                }
            />
            <Box w="full" mt={6}>
                <ChipGroup
                    title="Lineup: "
                    onRemoveChip={(index) => {
                        onArtistRemove(index);
                    }}
                    chips={lineupValue.map((artist) => ({
                        label: artist,
                        value: artist.toLowerCase(),
                    }))}
                />
            </Box>
        </VStack>
    );
};

export default AddEventGeneralFields;
