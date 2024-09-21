import React, { useEffect, useRef } from "react";
import {
    Box,
    IconButton,
    Image,
    VisuallyHidden,
    VStack,
} from "@chakra-ui/react";
import { TextInput } from "./TextInput";
import { TextAreaInput } from "./TextAreaInput";
import FileUpload from "./FileUpload";
import ChipGroup from "./ChipGroup";
import { CloseIcon, SmallAddIcon } from "@chakra-ui/icons";
import { FirebaseImageBlob } from "@/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "./AddEventModal";
import { getUrlFromBlob } from "@/utils";

interface Props {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    eventImage: FirebaseImageBlob | null;
    onImageRemove: () => void;
    onArtistChange: (artist: string) => void;
    onArtistAdd: () => void;
    artistValue: string;
    lineupValue: string[];
    onArtistRemove: (index: number) => void;
    onImageSelected: (file: File) => void;
    isCropCompleted: boolean;
}

const AddEventGeneralFields = ({
    eventImage,
    onImageRemove,
    onArtistChange,
    onArtistAdd,
    artistValue,
    lineupValue,
    onArtistRemove,
    register,
    errors,
    onImageSelected,
    isCropCompleted,
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
            />

            {/* TODO fix jumping eventImage when typing */}
            <TextInput
                fieldProps={register("artist")}
                onChange={(e) => {
                    onArtistChange(e.target.value);
                }}
                title="Add Artist"
                type="text"
                size="lg"
                height="60px"
                variant="outline"
                onEnter={onArtistAdd}
                rightIcon={
                    artistValue?.length > 0 && (
                        <IconButton
                            mt={5}
                            h="58px"
                            w="58px"
                            minW="unset"
                            aria-label="Search"
                            icon={<SmallAddIcon fontSize="28px" />}
                            onClick={onArtistAdd}
                        />
                    )
                }
            />

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
        </VStack>
    );
};

export default AddEventGeneralFields;
