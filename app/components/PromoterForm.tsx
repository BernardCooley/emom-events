"use client";

import React, { useState } from "react";
import { Box, Button, Center, Heading, VStack } from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./TextInput";
import { addPromoter, updatePromoter } from "@/bff";
import { Promoter } from "@prisma/client";
import FileUpload from "./FileUpload";
import { deleteFirebaseImage, uploadFirebaseImage } from "@/firebase/functions";
import ImageGrid from "./ImageGrid";
import { FirebaseImageBlob } from "@/types";

export interface FormData {
    name: string;
    city: string;
    state: string;
    country: string;
    email: string;
}

const schema: ZodType<FormData> = z.object({
    name: z.string().min(1, "Name is required"),
    city: z.string(),
    state: z.string(),
    country: z.string().min(1, "Country is required"),
    email: z.string().email(),
});

type Props = {
    defaultValues?: FormData;
    onSuccess: (promoter: Promoter) => void;
    onFail: () => void;
    isEditing?: boolean;
    existingImages?: FirebaseImageBlob[];
};

const PromoterForm = ({
    defaultValues,
    onSuccess,
    onFail,
    isEditing = false,
    existingImages,
}: Props) => {
    const [images, setImages] = useState<FirebaseImageBlob[]>(
        existingImages || []
    );
    const [isSaving, setIsSaving] = useState(false);
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: defaultValues?.name || "",
            city: defaultValues?.city || "",
            state: defaultValues?.state || "",
            country: defaultValues?.country || "",
            email: defaultValues?.email || "",
        },
    });

    const onCreatePromoter = async (formData: FormData) => {
        let imageIds: string[] = [];
        if (images.length) {
            imageIds = await Promise.all(
                images.map(async (image) => {
                    await uploadFirebaseImage(
                        "promoterImages",
                        new File([image.blob], image.name),
                        formData.email
                    );
                    return image.name;
                })
            );
        }
        const resp = await addPromoter({
            data: {
                id: formData.email,
                name: formData.name,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                imageIds: imageIds,
                email: formData.email,
                websites: [],
            },
        });
        if (resp) {
            onSuccess(resp);
        } else {
            onFail();
        }
    };

    const onUpdatePromoter = async (formData: FormData) => {
        let imageIds: string[] = [];

        const purgedImages = images?.filter(
            (img) => !existingImages?.find((i) => i.name === img.name)
        );

        const imagesToDelete = existingImages?.filter(
            (img) => !images.find((i) => i.name === img.name)
        );

        if (purgedImages.length) {
            imageIds = await Promise.all(
                purgedImages.map(async (image) => {
                    await uploadFirebaseImage(
                        "promoterImages",
                        new File([image.blob], image.name),
                        formData.email
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
                        "promoterImages",
                        fileToDelete.name,
                        formData.email
                    );
                })
            );
        }

        const resp = await updatePromoter({
            id: formData.email,
            data: {
                name: formData.name,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                imageIds: images.map((img) => img.name),
                websites: [],
            },
        });

        if (resp) {
            onSuccess(resp);
        }
    };

    const onSave = async (formData: FormData) => {
        setIsSaving(true);
        if (isEditing) {
            await onUpdatePromoter(formData);
        } else {
            await onCreatePromoter(formData);
        }
        setIsSaving(false);
    };

    return (
        <Box w={["100%", "100%", "100%", "50%"]} position="relative">
            {isSaving && (
                <Center position="absolute" w="full" h="70vh">
                    <Heading>Saving...</Heading>
                </Center>
            )}
            <Box
                opacity={isSaving ? 0.4 : 1}
                pointerEvents={isSaving ? "none" : "auto"}
            >
                <form onSubmit={handleSubmit(onSave)}>
                    <VStack gap={6}>
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
                            title="Country"
                            type="text"
                            size="lg"
                            fieldProps={register("country")}
                            height="60px"
                            variant="outline"
                            error={errors.country?.message}
                            required
                        />
                        <TextInput
                            title="County/State"
                            type="text"
                            size="lg"
                            fieldProps={register("state")}
                            height="60px"
                            variant="outline"
                            error={errors.state?.message}
                        />
                        <TextInput
                            title="City/Town"
                            type="text"
                            size="lg"
                            fieldProps={register("city")}
                            height="60px"
                            variant="outline"
                            error={errors.city?.message}
                        />

                        <FileUpload
                            onUpload={(file) => {
                                setImages(
                                    images.concat({
                                        blob: file,
                                        name: file.name,
                                    })
                                );
                            }}
                            fieldLabel="Images"
                            accept="image/*"
                            buttonText="Upload an image..."
                        />
                        <ImageGrid
                            images={images}
                            onRemove={(files) => setImages(files)}
                        />
                        <Button
                            onClick={handleSubmit(onSave)}
                            colorScheme="blue"
                            mt={10}
                        >
                            Save
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Box>
    );
};

export default PromoterForm;
