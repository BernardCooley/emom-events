"use client";

import React from "react";
import {
    Button,
    Center,
    Divider,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Props {}

const AuthPage = ({}: Props) => {
    const router = useRouter();

    return (
        <VStack w="full" gap={10}>
            <Heading variant="page-title">Please log in or register</Heading>
            <VStack
                w={["full", "50%"]}
                border="1px solid"
                borderColor="brand.secondary.300"
                rounded="lg"
                p={10}
                gap={8}
                shadow="lg"
            >
                <Text fontSize="xl">
                    Sign in or register with Google, Facebook or email and
                    password
                </Text>
                <VStack gap={6}>
                    <Button
                        onClick={() => {
                            signIn("google", {
                                callbackUrl: "/promoter-dashboard",
                            });
                        }}
                        w="full"
                        variant="outline"
                        leftIcon={<FcGoogle />}
                    >
                        <Center>
                            <Text>Sign in with Google</Text>
                        </Center>
                    </Button>
                    <Button
                        onClick={() => {
                            signIn("facebook", {
                                callbackUrl: "/promoter-dashboard",
                            });
                        }}
                        w={"full"}
                        colorScheme="facebook"
                        leftIcon={<FaFacebook />}
                    >
                        <Center>
                            <Text>Sign in with Facebook</Text>
                        </Center>
                    </Button>
                    <Button
                        onClick={() =>
                            signIn("credentails", {
                                callbackUrl: "/promoter-dashboard",
                            })
                        }
                        colorScheme="brand.primary"
                    >
                        Sign in with Email and Password
                    </Button>
                    <Divider colorScheme="red" />
                    <Text>OR</Text>
                    <Button
                        onClick={() => router.push("/auth/register")}
                        colorScheme="brand.primary"
                    >
                        Register with email and password
                    </Button>
                </VStack>
            </VStack>
            <Button
                onClick={() => router.push("/events")}
                colorScheme="brand.error"
                variant="outline"
            >
                Cancel
            </Button>
        </VStack>
    );
};

export default AuthPage;
