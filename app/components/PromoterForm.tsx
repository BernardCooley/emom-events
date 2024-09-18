"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Center, Heading, VStack } from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./TextInput";
import { addPromoter, updatePromoter } from "@/bff";
import { Promoter } from "@prisma/client";
import FileUpload from "./FileUpload";
import { uploadFirebaseImage } from "@/firebase/functions";
import ImageGrid from "./ImageGrid";

export interface FormData {
    name: string;
    city: string;
    state: string;
    country: string;
    images: string[];
    email: string;
}

const schema: ZodType<FormData> = z.object({
    name: z.string().min(1, "Name is required"),
    city: z.string(),
    state: z.string(),
    country: z.string().min(1, "Country is required"),
    images: z.array(z.string()),
    email: z.string().email(),
});

type Props = {
    defaultValues?: FormData;
    onSuccess: (promoter: Promoter) => void;
    isEditing?: boolean;
};

const PromoterForm = ({
    defaultValues,
    onSuccess,
    isEditing = false,
}: Props) => {
    const [images, setImages] = useState<File[]>([]);
    const [isSaving, setIsSaving] = useState(false);
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
            city: defaultValues?.city || "",
            state: defaultValues?.state || "",
            country: defaultValues?.country || "",
            images: defaultValues?.images || [],
            email: defaultValues?.email || "",
        },
    });

    useEffect(() => {
        if (images.length) {
            setValue("images", [
                ...watchImages,
                ...images.map((image) => URL.createObjectURL(image)),
            ]);
        }
    }, [images]);

    const watchImages = watch("images");

    const onSave = async (formData: FormData) => {
        setIsSaving(true);
        if (!isEditing) {
            if (images.length) {
                const imageIds = await Promise.all(
                    images.map(async (image) => {
                        await uploadFirebaseImage(
                            "promoterImages",
                            image,
                            formData.email
                        );
                        return image.name;
                    })
                );
                const resp = await addPromoter({
                    data: {
                        id: formData.email,
                        name: formData.name,
                        city: formData.city,
                        state: formData.state,
                        country: formData.country,
                        imageIds: imageIds,
                        email: formData.email,
                    },
                });
                if (resp) {
                    onSuccess(resp);
                }
            }
        } else {
            const resp = await updatePromoter({
                data: {
                    id: formData.email,
                    name: formData.name,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    imageIds: formData.images,
                    email: formData.email,
                },
            });
            if (resp) {
                onSuccess(resp);
            }
        }
        setIsSaving(false);
    };

    return (
        <Box w="50%" position="relative">
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
                                setImages((prevImages) => [
                                    ...prevImages,
                                    file,
                                ]);
                            }}
                            fieldLabel="Images"
                            accept="image/*"
                            buttonText="Upload an image..."
                        />
                        <ImageGrid
                            images={images.map((image) =>
                                URL.createObjectURL(image)
                            )}
                            onRemove={(files) => setValue("images", files)}
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
