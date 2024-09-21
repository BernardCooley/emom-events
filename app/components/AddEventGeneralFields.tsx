import React, { useEffect } from "react";
import { IconButton, VStack } from "@chakra-ui/react";
import { TextInput } from "./TextInput";
import { TextAreaInput } from "./TextAreaInput";
import FileUpload from "./FileUpload";
import ImageGrid from "./ImageGrid";
import ChipGroup from "./ChipGroup";
import { SmallAddIcon } from "@chakra-ui/icons";
import { FirebaseImageBlob } from "@/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "./AddEventModal";

interface Props {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    images: FirebaseImageBlob[];
    onImageSelect: (images: FirebaseImageBlob[]) => void;
    onImageRemove: (images: FirebaseImageBlob[]) => void;
    onArtistChange: (artist: string) => void;
    onArtistAdd: () => void;
    artistValue: string;
    lineupValue: string[];
    onArtistRemove: (index: number) => void;
    croppedImageToUpload: FirebaseImageBlob | null;
    onImageSelected: (file: File) => void;
}

const AddEventGeneralFields = ({
    images,
    onImageSelect,
    onImageRemove,
    onArtistChange,
    onArtistAdd,
    artistValue,
    lineupValue,
    onArtistRemove,
    register,
    errors,
    croppedImageToUpload,
    onImageSelected,
}: Props) => {
    useEffect(() => {
        if (croppedImageToUpload) {
            onImageSelect(images.concat(croppedImageToUpload));
        }
    }, [croppedImageToUpload]);

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
                error={errors.imageIds?.message}
            />
            <ImageGrid
                columns={[6]}
                images={images}
                onRemove={(files) => onImageRemove(files)}
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
            />

            {/* TODO fix jumping images when typing */}
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
