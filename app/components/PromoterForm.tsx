"use client";

import React from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    SimpleGrid,
    Image,
    VStack,
    IconButton,
} from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./TextInput";
import { CloseIcon } from "@chakra-ui/icons";
import Upload from "rc-upload";
import { addPromoter } from "@/bff";
import { Promoter } from "@prisma/client";

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
};

const PromoterForm = ({ defaultValues, onSuccess }: Props) => {
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

    const watchImages = watch("images");

    const onSave = async (formData: FormData) => {
        const resp = await addPromoter({
            data: {
                id: "",
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
    };

    return (
        <Box w="50%">
            <form onSubmit={handleSubmit(onSave)}>
                <VStack>
                    <TextInput
                        title="Name"
                        type="text"
                        size="sm"
                        fieldProps={register("name")}
                        height="40px"
                        variant="filled"
                        error={errors.name?.message}
                        required
                    />
                    <TextInput
                        title="Country"
                        type="text"
                        size="sm"
                        fieldProps={register("country")}
                        height="40px"
                        variant="filled"
                        error={errors.country?.message}
                        required
                    />
                    <TextInput
                        title="State"
                        type="text"
                        size="sm"
                        fieldProps={register("state")}
                        height="40px"
                        variant="filled"
                        error={errors.state?.message}
                    />
                    <TextInput
                        title="City"
                        type="text"
                        size="sm"
                        fieldProps={register("city")}
                        height="40px"
                        variant="filled"
                        error={errors.city?.message}
                    />

                    <FormControl>
                        <FormLabel fontSize="lg" mb={0}>
                            <Flex>
                                <Box>Images</Box>
                            </Flex>
                        </FormLabel>
                        <Upload
                            customRequest={(options) => {
                                setValue("images", [
                                    ...watchImages,
                                    URL.createObjectURL(options.file as File),
                                ]);
                            }}
                            accept="image/*"
                            style={{
                                content: "rhaethj",
                                width: "200px",
                                height: "50px",
                                border: "1px solid black",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            Upload a file...
                        </Upload>
                    </FormControl>
                    <SimpleGrid columns={3} gap={4}>
                        {watchImages?.length > 0 &&
                            watchImages?.map((file) => (
                                <Box position="relative" key={file}>
                                    <IconButton
                                        rounded="full"
                                        right={1}
                                        top={1}
                                        position="absolute"
                                        aria-label="Remove image"
                                        icon={<CloseIcon />}
                                        onClick={() => {
                                            setValue(
                                                "images",
                                                watchImages.filter(
                                                    (img) => img !== file
                                                )
                                            );
                                        }}
                                    />
                                    <Image src={file} alt="" />
                                </Box>
                            ))}
                    </SimpleGrid>
                    <Button mt={10} type="submit">
                        Save
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default PromoterForm;
