"use client";

import React from "react";
import { Button, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

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
                <Text fontSize="xl">Register with email and password</Text>
                <HStack gap={6}>
                    <Button
                        href="/auth/register"
                        _hover={{
                            textDecoration: "none",
                            bg: "blue.600",
                        }}
                        as={Link}
                        colorScheme="blue"
                    >
                        Register
                    </Button>
                </HStack>
            </VStack>
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
                    Sign in with email and password or with google
                </Text>
                <HStack gap={6}>
                    <Button
                        onClick={() =>
                            signIn("promoter", {
                                callbackUrl: "/promoter-dashboard",
                            })
                        }
                        colorScheme="blue"
                    >
                        Sign in
                    </Button>
                </HStack>
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
