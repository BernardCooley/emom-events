/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, z } from "zod";
import {
    Box,
    Button,
    Flex,
    FormErrorMessage,
    IconButton,
    ToastProps,
    useToast,
    Text,
    VStack,
    Link,
    FormControl,
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
import { addPromoter } from "@/bff";
import { Promoter } from "@prisma/client";
import { useRouter } from "next/navigation";

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
}

const schema: ZodType<FormData> = z
    .object({
        email: z.string().email(),
        username: z
            .string()
            .min(3, { message: "Username must be 3 characters or more." }),
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
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [authError, setAuthError] = useState<string>("");
    const toast = useToast();
    const id = "registerToast";
    const [email, setEmail] = useState("");

    const formMethods = useForm<FormData>({
        mode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
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

    const onRegister = async (formData: FormData) => {
        setEmail(formData.email);
        setSubmitting(true);

        let newUser: UserCredential | null = null;

        try {
            newUser = await RegisterUser(formData.email, formData.password);
        } catch (error) {
            showToast({
                title: "Error registering.",
                description:
                    "Please check your email and password and try again.",
                status: "error",
            });
            setAuthError(
                "Error registering. Please check your email and password and try again."
            );
        }

        let newPromoter: Promoter | null = null;

        if (newUser) {
            try {
                newPromoter = await addPromoter({
                    data: {
                        id: newUser.user?.uid,
                        name: formData.username,
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
                setAuthError("");
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

        if (newPromoter) {
            router.push("/promoter-dashboard");
        } else {
            await DeleteUser();
        }

        setSubmitting(false);
    };

    return (
        <Flex m="auto" direction="column" w={["100%", "80%", "70%", "60%"]}>
            {!submitted ? (
                <form onSubmit={handleSubmit(onRegister)}>
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
                                type="text"
                                title="Username"
                                size="lg"
                                name="username"
                                error={errors.username?.message}
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
                        href="/auth/signin"
                        as={Link}
                        mb={4}
                        variant="link"
                    >
                        Already have a Host account? Log in here
                    </Button>
                    {authError.length > 0 && (
                        <FormControl>
                            <Box h="16px" mt="8px">
                                <FormErrorMessage>{authError}</FormErrorMessage>
                            </Box>
                        </FormControl>
                    )}
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
