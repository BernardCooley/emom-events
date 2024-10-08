"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    HStack,
    IconButton,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./FormInputs/TextInput";
import { addPromoter, updatePromoter } from "@/bff";
import { Promoter } from "@prisma/client";
import FileUpload from "./FormInputs/FileUpload";
import { uploadFirebaseImage } from "@/firebase/functions";
import { FirebaseImageBlob } from "@/types";
import ImageCropper from "./ImageCropper";
import { getUrlFromBlob, handleProfileImageChange } from "@/utils";
import { CloseIcon } from "@chakra-ui/icons";
import { usePromoterContext } from "@/context/promoterContext";
import { SwitchInput } from "./FormInputs/SwitchInput";

export interface FormData {
    name: Promoter["name"];
    city: Promoter["city"];
    state: Promoter["state"];
    country: Promoter["country"];
    email: Promoter["email"];
    showEmail: Promoter["showEmail"];
}

const schema: ZodType<FormData> = z.object({
    name: z.string().min(1, "Name is required"),
    city: z.string(),
    state: z.string(),
    country: z.string().min(1, "Country is required"),
    email: z.string().email(),
    showEmail: z.boolean(),
});

type Props = {
    defaultValues?: FormData;
    onSuccess: (promoter: Promoter) => void;
    onFail: () => void;
    isEditing?: boolean;
    existingProfileImage: FirebaseImageBlob | null;
    onCancel?: () => void;
};

const PromoterForm = ({
    defaultValues,
    onSuccess,
    onFail,
    isEditing = false,
    existingProfileImage,
    onCancel,
}: Props) => {
    const { promoter } = usePromoterContext();
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
            showEmail: defaultValues?.showEmail || false,
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = formMethods;

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues]);

    const onCreatePromoter = async (formData: FormData) => {
        const imageIds: string[] = [];

        const newPromoter = await addPromoter({
            data: {
                name: formData.name,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                imageIds: [],
                email: formData.email,
                websites: [],
                showEmail: formData.showEmail,
            },
        });

        if (newPromoter) {
            if (profileImage) {
                const newImage = await uploadFirebaseImage(
                    "promoterImages",
                    new File([profileImage.blob], profileImage.name),
                    newPromoter.id
                );

                if (newImage) imageIds.push(profileImage.name);

                if (imageIds.length > 0) {
                    const resp = await updatePromoter({
                        id: newPromoter.id,
                        data: {
                            imageIds: imageIds,
                        },
                    });

                    if (resp) {
                        onSuccess(resp);
                    } else {
                        onFail();
                    }
                }
            } else {
                onSuccess(newPromoter);
            }
        } else {
            onFail();
        }
    };

    const onUpdatePromoter = async (formData: FormData) => {
        if (!promoter) return null;

        const imageIds = await handleProfileImageChange(
            "promoterImages",
            promoter.id,
            profileImage,
            existingProfileImage
        );

        const resp = await updatePromoter({
            id: promoter.id,
            data: {
                name: formData.name,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                imageIds: imageIds,
                websites: [],
                showEmail: formData.showEmail,
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
                    <Text>Saving...</Text>
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
                <form
                    onSubmit={handleSubmit(onSave, (error) => {
                        console.error(error);
                    })}
                >
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
                            control={control}
                        />
                        <TextInput
                            type="text"
                            title="City/Town"
                            size="lg"
                            name="city"
                            control={control}
                        />
                        <SwitchInput
                            orientation="row"
                            width="full"
                            title="Show your email address on your public profile"
                            size="lg"
                            control={control}
                            name="showEmail"
                            error={errors.showEmail?.message}
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
                        <HStack w="full" justifyContent="center" gap={6}>
                            <Button
                                variant="outline"
                                isLoading={isSaving}
                                onClick={onCancel}
                                colorScheme="red"
                                mt={10}
                            >
                                Cancel
                            </Button>
                            <Button
                                isLoading={isSaving}
                                type="submit"
                                colorScheme="blue"
                                mt={10}
                            >
                                Save
                            </Button>
                        </HStack>
                    </VStack>
                </form>
            </Box>
        </Box>
    );
};

export default PromoterForm;
