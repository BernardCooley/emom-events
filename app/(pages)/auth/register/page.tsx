/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, z } from "zod";
import {
    Button,
    Flex,
    IconButton,
    ToastProps,
    useToast,
    Text,
    VStack,
    useDisclosure,
    Heading,
} from "@chakra-ui/react";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { TextInput } from "@/app/components/FormInputs/TextInput";
import { UserCredential } from "firebase/auth";
import {
    DeleteUser,
    RegisterUser,
    SendVerificationEmail,
} from "@/firebase/authFunctions";
import { addPromoter, fetchPromoter } from "@/bff";
import { useRouter } from "next/navigation";
import EmailAlreadyExistsDialog from "@/app/components/EmailAlreadyExistsDialog";
import { FirebaseError } from "firebase/app";
import { signIn } from "next-auth/react";

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

const schema: ZodType<FormData> = z
    .object({
        email: z.string().email(),
        password: z
            .string()
            .min(6, { message: "Password must be 6 characters or more." }),
        confirmPassword: z
            .string()
            .min(6, { message: "Password must be 6 characters or more." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const SignUp = () => {
    const [promoterExists, setPromoterExists] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<UserCredential | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useToast();
    const id = "registerToast";
    const [email, setEmail] = useState("");

    const formMethods = useForm<FormData>({
        mode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
        getValues,
    } = formMethods;

    const showToast = useCallback(
        ({ status, title, description }: ToastProps) => {
            if (!toast.isActive(id)) {
                toast({
                    id,
                    title: title || "An error has occured.",
                    description: description || "Please try again later.",
                    status: status,
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
        [toast]
    );

    const onSubmit = async (formData: FormData) => {
        try {
            const newUser = await RegisterUser(
                formData.email,
                formData.password
            );

            setNewUser(newUser);

            const promoter = await fetchPromoter({
                email: formData.email,
            });

            setPromoterExists(promoter !== null);

            if (promoter) {
                onOpen();
            } else {
                onRegister(formData, newUser);
            }
        } catch (error: unknown) {
            if (
                error instanceof FirebaseError &&
                error.code === "auth/email-already-in-use"
            ) {
                showToast({
                    title: "Email address already registered.",
                    description:
                        "Please use a different email address or log in.",
                    status: "error",
                });
            } else {
                showToast({
                    title: "Error registering.",
                    description:
                        "Please check your email and password and try again.",
                    status: "error",
                });
            }
        }
    };

    const onRegister = async (
        formData: FormData,
        newUser?: UserCredential | null
    ) => {
        setEmail(formData.email);
        setSubmitting(true);

        if (newUser) {
            if (!promoterExists) {
                try {
                    await addPromoter({
                        data: {
                            id: newUser.user?.uid,
                            name: "",
                            country: "",
                            imageIds: [],
                            email: formData.email,
                            websites: [],
                            showEmail: false,
                        },
                    });
                } catch (error) {
                    await DeleteUser();
                    showToast({
                        title: "Error registering.",
                        description:
                            "Please check your email and password and try again.",
                        status: "error",
                    });
                }
                try {
                    await SendVerificationEmail(newUser.user);
                    setSubmitted(true);
                } catch (error) {
                    showToast({
                        title: "Error sending verification email.",
                        description:
                            "Please check your email and password and try again.",
                        status: "error",
                    });
                }
            }

            await SendVerificationEmail(newUser.user);
            setSubmitted(true);
        }

        setSubmitting(false);
    };

    return (
        <Flex m="auto" direction="column" w={["100%", "80%", "70%", "60%"]}>
            <Heading textAlign="center" size="lg" mb={8}>
                Register for a Host account
            </Heading>
            <EmailAlreadyExistsDialog
                isOpen={isOpen}
                onNo={() => {
                    if (newUser) DeleteUser();
                    onClose();
                    router.push("/auth");
                }}
                onClose={onClose}
                onYes={() => onRegister(getValues(), newUser)}
            />
            {!submitted ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack
                        w="full"
                        gap="18px"
                        p={[6, 12, 20]}
                        pt={10}
                        justifyContent="space-between"
                        position="relative"
                    >
                        <VStack w="full" gap={8}>
                            <TextInput
                                type="email"
                                title="Email"
                                size="lg"
                                name="email"
                                error={errors.email?.message}
                                control={control}
                                required
                            />
                            <TextInput
                                type={showPassword ? "text" : "password"}
                                title="Password"
                                size="lg"
                                name="password"
                                error={errors.password?.message}
                                control={control}
                                required
                                rightIcon={
                                    <IconButton
                                        _hover={{
                                            bg: "transparent",
                                            color: "brand.primary",
                                            transform: "scale(1.2)",
                                        }}
                                        shadow="lg"
                                        height="30px"
                                        position="absolute"
                                        right={2}
                                        top={8}
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        variant="ghost"
                                        h={1 / 2}
                                        colorScheme="teal"
                                        aria-label="Show password"
                                        fontSize="3xl"
                                        icon={
                                            showPassword ? (
                                                <AiOutlineEyeInvisible fontSize="inherit" />
                                            ) : (
                                                <AiFillEyeInvisible fontSize="inherit" />
                                            )
                                        }
                                    />
                                }
                            />
                            <TextInput
                                type={showConfirmPassword ? "text" : "password"}
                                title="Confirm password"
                                size="lg"
                                name="confirmPassword"
                                error={errors.confirmPassword?.message}
                                control={control}
                                required
                                rightIcon={
                                    <IconButton
                                        _hover={{
                                            bg: "transparent",
                                            color: "brand.primary",
                                            transform: "scale(1.2)",
                                        }}
                                        shadow="lg"
                                        height="30px"
                                        position="absolute"
                                        right={2}
                                        top={8}
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        variant="ghost"
                                        h={1 / 2}
                                        colorScheme="teal"
                                        aria-label="Show password"
                                        fontSize="3xl"
                                        icon={
                                            showConfirmPassword ? (
                                                <AiOutlineEyeInvisible fontSize="inherit" />
                                            ) : (
                                                <AiFillEyeInvisible fontSize="inherit" />
                                            )
                                        }
                                    />
                                }
                            />
                            <Button
                                isLoading={submitting}
                                type="submit"
                                variant="primary"
                            >
                                Register
                            </Button>
                        </VStack>
                    </VStack>
                    <Button
                        position="absolute"
                        bottom={0}
                        right={0}
                        onClick={() =>
                            signIn("promoter", {
                                callbackUrl: "/promoter-dashboard",
                            })
                        }
                        mb={4}
                        variant="link"
                    >
                        Already have a Host account? Log in here
                    </Button>
                </form>
            ) : (
                <Flex direction="column" alignItems="center" gap={10} pt={20}>
                    <Text textAlign="center" fontSize="2xl">
                        Registration successful
                    </Text>
                    <Text w="80%" textAlign="center" fontSize="lg">
                        A confirmation email has been sent to{" "}
                        <strong>{email}</strong>.
                    </Text>
                    <Text w="80%" textAlign="center" fontSize="lg">
                        Please check your email to verify your new account.
                    </Text>
                </Flex>
            )}
            {/* TODO - Message not showing up */}
        </Flex>
    );
};

export default SignUp;
