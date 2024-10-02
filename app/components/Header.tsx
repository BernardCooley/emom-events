"use client";

import React from "react";
import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {}

const Header = ({}: Props) => {
    const router = useRouter();
    const { data: session } = useSession();
    const pathname = usePathname();
    const pageName = pathname.split("/")[pathname.split("/").length - 1];

    const menuItems = [
        {
            name: "Home",
            path: "",
            show: true,
        },
        {
            name: "Events",
            path: "events",
            show: true,
        },
        {
            name: "Host Dashboard",
            path: "promoter-dashboard",
            show: session?.user ? true : false,
        },
    ];

    return (
        <Box
            display={{
                base: "none",
                md: "block",
            }}
            w="full"
            h="40px"
            shadow="md"
        >
            <HStack
                h="full"
                alignItems="center"
                justifyContent="flex-end"
                w="full"
            >
                {menuItems
                    .filter((item) => item.show)
                    .map((item) => (
                        <Button
                            sx={
                                pageName === item.path
                                    ? {
                                          fontSize: "26px",
                                          color: "gray.800",
                                          pointerEvents: "none",
                                          cursor: "not-allowed",
                                      }
                                    : {
                                          fontSize: "18px",
                                          color: "gray.500",
                                      }
                            }
                            onClick={() => {
                                router.push(`/${item.path}`);
                            }}
                            key={item.path}
                            variant="ghost"
                        >
                            {item.name}
                        </Button>
                    ))}
                <Flex px={4} h="full" bg="gray.400" alignItems="center">
                    {session ? (
                        <Button
                            color="white"
                            variant="link"
                            onClick={() => signOut()}
                        >
                            Sign out
                        </Button>
                    ) : (
                        <HStack>
                            <Button
                                color="white"
                                variant="link"
                                onClick={() => router.push("/auth")}
                            >
                                Host login
                            </Button>
                        </HStack>
                    )}
                </Flex>
            </HStack>
        </Box>
    );
};

export default Header;
