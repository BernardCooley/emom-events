"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    Heading,
    IconButton,
    Image,
    VStack,
} from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./TextInput";
import { addPromoter, updatePromoter } from "@/bff";
import { Promoter } from "@prisma/client";
import FileUpload from "./FileUpload";
import { uploadFirebaseImage } from "@/firebase/functions";
import { FirebaseImageBlob } from "@/types";
import ImageCropper from "./ImageCropper";
import { getUrlFromBlob, handleProfileImageChange } from "@/utils";
import { CloseIcon } from "@chakra-ui/icons";

export interface FormData {
    name: Promoter["name"];
    city: Promoter["city"];
    state: Promoter["state"];
    country: Promoter["country"];
    email: Promoter["email"];
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
    existingProfileImage: FirebaseImageBlob | null;
};

const PromoterForm = ({
    defaultValues,
    onSuccess,
    onFail,
    isEditing = false,
    existingProfileImage,
}: Props) => {
    const [imageToCrop, setImageToCrop] = useState<File | null>(null);
    const [croppedImage, setCroppedImage] = useState<FirebaseImageBlob | null>(
        null
    );
    const [profileImage, setProfileImage] = useState<FirebaseImageBlob | null>(
        existingProfileImage
    );
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (croppedImage) {
            setProfileImage(croppedImage);
        }
    }, [croppedImage]);

    const formMethods = useForm<FormData>({
        mode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            name: defaultValues?.name || "",
            city: defaultValues?.city || "",
            state: defaultValues?.state || "",
            country: defaultValues?.country || "",
            email: defaultValues?.email || "",
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = formMethods;

    const onCreatePromoter = async (formData: FormData) => {
        let imageIds: string[] = [];

        if (profileImage) {
            const newImage = await uploadFirebaseImage(
                "promoterImages",
                new File([profileImage.blob], profileImage.name),
                formData.email
            );

            if (newImage) imageIds.push(profileImage.name);
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
        const imageIds = await handleProfileImageChange(
            "promoterImages",
            formData.email,
            profileImage,
            existingProfileImage
        );

        const resp = await updatePromoter({
            id: formData.email,
            data: {
                name: formData.name,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                imageIds: imageIds,
                websites: [],
            },
        });

        if (resp) {
            onSuccess(resp);
        } else {
            onFail();
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
            <ImageCropper
                image={imageToCrop}
                onCancel={() => {
                    setImageToCrop(null);
                }}
                onSuccess={(image) => {
                    setCroppedImage(image);
                    setImageToCrop(null);
                }}
            />
            <Box
                opacity={isSaving ? 0.4 : 1}
                pointerEvents={isSaving ? "none" : "auto"}
            >
                <form onSubmit={handleSubmit(onSave)}>
                    <VStack gap={6}>
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
                            title="Country"
                            size="lg"
                            name="country"
                            error={errors.country?.message}
                            control={control}
                            required
                        />
                        <TextInput
                            type="text"
                            title="County/State"
                            size="lg"
                            name="state"
                            error={errors.state?.message}
                            control={control}
                        />
                        <TextInput
                            type="text"
                            title="City/Town"
                            size="lg"
                            name="city"
                            error={errors.city?.message}
                            control={control}
                        />

                        <FileUpload
                            onImageSelected={setImageToCrop}
                            fieldLabel="Images"
                            accept="image/*"
                            buttonText="Upload an image..."
                        />
                        {profileImage && (
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
                                    onClick={() => setProfileImage(null)}
                                />

                                <Image
                                    src={getUrlFromBlob(profileImage)}
                                    alt=""
                                />
                            </Box>
                        )}
                        <Button
                            isLoading={isSaving}
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
