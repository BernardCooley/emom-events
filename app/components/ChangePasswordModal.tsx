import React from "react";
import {
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./FormInputs/TextInput";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useSession } from "next-auth/react";

export interface FormData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const schema: ZodType<FormData> = z
    .object({
        oldPassword: z.string().min(1, "Old password is required."),
        newPassword: z
            .string()
            .min(6, "Password must be 6 characters or more."),
        confirmPassword: z
            .string()
            .min(6, "Password must be 6 characters or more."),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: Props) => {
    const toast = useToast();
    const { data: session } = useSession();
    const formMethods = useForm<FormData>({
        mode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const {
        handleSubmit,
        setError,
        formState: { errors },
        control,
    } = formMethods;

    const onSubmit = (formData: FormData) => {
        console.log(formData);
        checkPassword(formData.oldPassword, formData.newPassword);
    };

    const checkPassword = async (oldPassword: string, newPassword: string) => {
        signInWithEmailAndPassword(
            auth,
            session?.user?.email || "",
            oldPassword
        )
            .then((user) => {
                updatePassword(user.user, newPassword)
                    .then(() => {
                        toast({
                            title: "Password updated",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                        });
                        onClose();
                    })
                    .catch(() => {
                        toast({
                            title: "Failed to update password. Please try again later.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    });
            })
            .catch(() => {
                setError("oldPassword", {
                    type: "manual",
                    message: "Old password is incorrect. Please try again.",
                });
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Change password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack gap={6}>
                            <TextInput
                                type="password"
                                title="Old Password"
                                size="lg"
                                name="oldPassword"
                                error={errors.oldPassword?.message}
                                control={control}
                                required
                            />
                            <TextInput
                                type="password"
                                title="New Password"
                                size="lg"
                                name="newPassword"
                                error={errors.newPassword?.message}
                                control={control}
                                required
                            />
                            <TextInput
                                type="password"
                                title="Confirm Password"
                                size="lg"
                                name="confirmPassword"
                                error={errors.confirmPassword?.message}
                                control={control}
                                required
                            />
                            <HStack gap={6}>
                                <Button
                                    onClick={onClose}
                                    colorScheme="red"
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" colorScheme="blue">
                                    Submit
                                </Button>
                            </HStack>
                        </VStack>
                    </form>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangePasswordModal;
