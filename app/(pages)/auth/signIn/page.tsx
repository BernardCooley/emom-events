/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, z } from "zod";
import {
    Button,
    Flex,
    Heading,
    IconButton,
    ToastProps,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { TextInput } from "@/app/components/FormInputs/TextInput";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { auth } from "@/firebase/clientApp";
import ResetPasswordDialog from "@/app/components/PasswordResetDialog";

interface FormData {
    email: string;
    password: string;
}

const schema: ZodType<FormData> = z.object({
    email: z.string().email(),
    password: z.string(),
});

const SignIn = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();
    const id = "registerToast";

    const formMethods = useForm<FormData>({
        mode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = formMethods;

    const showToast = useCallback(
        ({ status, title }: ToastProps) => {
            if (!toast.isActive(id)) {
                toast({
                    id,
                    title: title || "An error has occurred.",
                    status: status,
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
        [toast]
    );

    const onSubmit = async (formData: FormData) => {
        setSubmitting(true);
        signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then(() => {
                signIn("credentials", {
                    username: formData.email,
                    password: formData.password,
                    callbackUrl: "/promoter-dashboard",
                })
                    .then(() => {
                        setSubmitting(false);
                    })
                    .catch(() => {
                        showToast({
                            status: "error",
                            title: "Failed to sign in",
                            description: "Failed to sign in",
                        });
                        setSubmitting(false);
                    });
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential") {
                    showToast({
                        status: "error",
                        title: "Email or password is incorrect. Please try again.",
                    });
                } else {
                    showToast({
                        status: "error",
                        title: "Failed to sign in",
                        description: error.message,
                    });
                }
                setSubmitting(false);
            });
    };

    return (
        <Flex m="auto" direction="column" w={["100%", "80%", "70%", "60%"]}>
            <ResetPasswordDialog isOpen={isOpen} onClose={onClose} />
            <Heading variant="page-title">Log into your Host account</Heading>
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
                        <Button
                            colorScheme="blue"
                            isLoading={submitting}
                            type="submit"
                        >
                            Sign in
                        </Button>
                        <Button
                            isLoading={submitting}
                            onClick={onOpen}
                            variant="outline"
                        >
                            Forgot password? Reset here
                        </Button>
                    </VStack>
                </VStack>
                <Button
                    position="absolute"
                    bottom={0}
                    right={0}
                    onClick={() => {
                        router.push("/auth/register");
                    }}
                    mb={4}
                    variant="link"
                >
                    {"Don't have a Host account? Register here"}
                </Button>
            </form>
        </Flex>
    );
};

export default SignIn;
