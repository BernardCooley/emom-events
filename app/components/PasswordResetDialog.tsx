import React, { forwardRef, LegacyRef, RefObject } from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    HStack,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./FormInputs/TextInput";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/clientApp";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export interface FormData {
    email: string;
}

const schema: ZodType<FormData> = z.object({
    email: z.string().email().min(1, "Email is required."),
});

const ResetPasswordDialog = forwardRef(
    ({ isOpen, onClose }: Props, ref: LegacyRef<HTMLButtonElement>) => {
        const toast = useToast();
        const formMethods = useForm<FormData>({
            mode: "onChange",
            resolver: zodResolver(schema),
            defaultValues: {
                email: "",
            },
        });

        const {
            handleSubmit,
            formState: { errors },
            control,
        } = formMethods;

        const onSubmit = async (formData: FormData) => {
            sendPasswordResetEmail(auth, formData.email)
                .then(() => {
                    toast({
                        title: `Password reset email sent to ${formData.email}.`,
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    onClose();
                })
                .catch(() => {
                    toast({
                        title: "Error sending password reset email. Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                });
        };

        return (
            <AlertDialog
                closeOnEsc={false}
                closeOnOverlayClick={false}
                isOpen={isOpen}
                leastDestructiveRef={ref as RefObject<HTMLButtonElement>}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Reset password
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <VStack gap={6}>
                                    <Box>
                                        Enter your email address below to reset
                                        your password.
                                    </Box>

                                    <TextInput
                                        type="email"
                                        size="lg"
                                        name="email"
                                        error={errors.email?.message}
                                        control={control}
                                    />

                                    <HStack
                                        w="full"
                                        gap={6}
                                        justifyContent="center"
                                    >
                                        <Button
                                            colorScheme="red"
                                            variant="outline"
                                            ref={ref}
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            colorScheme="blue"
                                            type="submit"
                                            ml={3}
                                        >
                                            Reset
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </AlertDialogBody>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        );
    }
);

ResetPasswordDialog.displayName = "ResetPasswordDialog";

export default ResetPasswordDialog;
