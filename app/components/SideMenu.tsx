"use client";

import React, { useRef } from "react";
import {
    Box,
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    IconButton,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";

interface Props {
    placement?: "top" | "right" | "bottom" | "left";
}

const SideMenu = ({ placement = "right" }: Props) => {
    const { data: session } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef<HTMLButtonElement | null>(null);
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
            name: "Promoters",
            path: "promoters",
            show: true,
        },
        {
            name: "Venues",
            path: "venues",
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
                base: "block",
                md: "none",
            }}
            position="absolute"
            zIndex={200}
            right={4}
            top={4}
        >
            <IconButton
                ref={btnRef}
                bg="transparent"
                fontSize={20}
                onClick={onOpen}
                aria-label="menu-button"
                icon={<HamburgerIcon />}
            />
            <Drawer
                isOpen={isOpen}
                placement={placement}
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>

                    <DrawerBody>
                        <VStack w="full">
                            {menuItems
                                .filter((item) => item.show)
                                .map((item) => (
                                    <Button
                                        isDisabled={pageName === item.path}
                                        onClick={() => {
                                            onClose();
                                            router.push(`/${item.path}`);
                                        }}
                                        key={item.path}
                                        w="full"
                                        variant="ghost"
                                    >
                                        {item.name}
                                    </Button>
                                ))}
                        </VStack>
                    </DrawerBody>
                    <Divider />
                    <DrawerFooter>
                        {session ? (
                            <VStack w="full">
                                <Text>{session.user?.name}</Text>
                                <Button
                                    variant="link"
                                    onClick={() => signOut()}
                                >
                                    Sign out
                                </Button>
                            </VStack>
                        ) : (
                            <Button
                                variant="link"
                                onClick={() =>
                                    signIn("promoter", {
                                        callbackUrl: "/promoter-dashboard",
                                    })
                                }
                            >
                                Host login
                            </Button>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default SideMenu;
