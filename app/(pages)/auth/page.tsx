"use client";

import React from "react";
import {
    Button,
    Center,
    Divider,
    Heading,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

interface Props {}

const AuthPage = ({}: Props) => {
    return (
        <VStack w="full" gap={10}>
            <Heading as="h2">Please log in or register</Heading>
            <VStack
                w={["full", "50%"]}
                border="1px solid"
                borderColor="gray.300"
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
                        w={"full"}
                        variant={"outline"}
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
                        colorScheme={"facebook"}
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
                        colorScheme="blue"
                    >
                        Sign in with Email and Password
                    </Button>
                    <Divider colorScheme="red" />
                    <Text>OR</Text>
                    <Button
                        href="/auth/register"
                        _hover={{
                            textDecoration: "none",
                            bg: "blue.600",
                        }}
                        as={Link}
                        colorScheme="blue"
                    >
                        Register with email and password
                    </Button>
                </VStack>
            </VStack>
            <Button
                href="/events"
                _hover={{
                    textDecoration: "none",
                    bg: "red.600",
                    color: "white",
                }}
                as={Link}
                colorScheme="red"
                variant="outline"
            >
                Cancel
            </Button>
        </VStack>
    );
};

export default AuthPage;
