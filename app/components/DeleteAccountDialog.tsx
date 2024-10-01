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
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { signIn, signOut, useSession } from "next-auth/react";
import { deletePromoter } from "@/bff";
import { PromoterDetails } from "@/types";
import { RegisterUser } from "@/firebase/authFunctions";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    promoter: PromoterDetails;
};

export interface FormData {
    password: string;
}

const DeleteAccountDialog = forwardRef(
    (
        { isOpen, onClose, promoter }: Props,
        ref: LegacyRef<HTMLButtonElement>
    ) => {
        const { data: session } = useSession();
        const schema: ZodType<FormData> = z.object({
            password: session?.user?.image
                ? z.string()
                : z.string().min(1, "Password is required."),
        });
        const toast = useToast();
        const formMethods = useForm<FormData>({
            mode: "onChange",
            resolver: zodResolver(schema),
            defaultValues: {
                password: "",
            },
        });

        const {
            handleSubmit,
            formState: { errors },
            control,
        } = formMethods;

        const onDeleteAccountAndProfile = async (password: string) => {
            const user = auth.currentUser;

            if (user) {
                deleteUser(user)
                    .then(() => {
                        deletePromoter({
                            promoterId: promoter.id,
                        })
                            .then(() => {
                                toast({
                                    title: "Account deleted. We're sorry to see you go!",
                                    status: "success",
                                    duration: 5000,
                                    isClosable: true,
                                });
                                onClose();
                                signOut({
                                    callbackUrl: "/events?accountDeleted=true",
                                });
                            })
                            .catch(() => {
                                RegisterUser(
                                    session?.user?.email || "",
                                    password
                                );
                                toast({
                                    title: "Failed to delete account. Please try again later.",
                                    status: "error",
                                    duration: 5000,
                                    isClosable: true,
                                });
                            });
                    })
                    .catch((error) => {
                        if (error.message.includes("requires-recent-login")) {
                            toast({
                                title: "Please log in again to delete your account",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                            });
                            signIn("credentials", {
                                email: session?.user?.email || "",
                                callbackUrl: `/promoter-dashboard?deleteAccount=true`,
                            });
                        } else {
                            toast({
                                title: "Failed to delete account. Please try again later.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                            });
                        }
                    });
            }
        };

        const onDeleteProfile = async () => {
            deletePromoter({
                promoterId: promoter.id,
            })
                .then(() => {
                    toast({
                        title: "Account deleted. We're sorry to see you go!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    onClose();
                    signOut({
                        callbackUrl: "/events?accountDeleted=true",
                    });
                })
                .catch(() => {
                    toast({
                        title: "Failed to delete account. Please try again later.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                });
        };

        const onSubmit = async (formData: FormData) => {
            if (session?.user?.image) {
                onDeleteProfile();
            } else {
                signInWithEmailAndPassword(
                    auth,
                    session?.user?.email || "",
                    formData.password
                )
                    .then(() => {
                        onDeleteAccountAndProfile(formData.password);
                    })
                    .catch(() => {
                        toast({
                            title: "Incorrect password",
                            description:
                                "The password you entered is incorrect. Please try again.",
                            status: "error",
                            isClosable: true,
                        });
                    });
            }
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
                            Delete Account
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <VStack gap={6}>
                                    <Box>
                                        Are you sure you want to delete your
                                        account? This will permanently delete
                                        your account and all associated data and
                                        events, and cannot be reversed.
                                    </Box>
                                    {!session?.user?.image && (
                                        <TextInput
                                            type="password"
                                            title="Old Password"
                                            size="lg"
                                            name="password"
                                            error={errors.password?.message}
                                            control={control}
                                            required
                                            helperText="Enter your password to confirm."
                                        />
                                    )}
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
                                            No
                                        </Button>
                                        <Button
                                            colorScheme="blue"
                                            type="submit"
                                            ml={3}
                                        >
                                            Yes
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

DeleteAccountDialog.displayName = "DeleteAccountDialog";

export default DeleteAccountDialog;
