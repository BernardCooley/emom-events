"use client";

import React, { useRef } from "react";
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { usePathname, useRouter } from "next/navigation";

interface Props {
    placement?: "top" | "right" | "bottom" | "left";
}

const SideMenu = ({ placement = "right" }: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const pageName = pathname.split("/")[1];

    const menuItems = [
        {
            name: "Home",
            path: "",
        },
        {
            name: "Events",
            path: "events",
        },
        {
            name: "Promoters",
            path: "promoters",
        },
        {
            name: "Venues",
            path: "venues",
        },
    ];

    return (
        <Box position="absolute" zIndex={200} right={4} top={4}>
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
                        {menuItems.map((item) => (
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
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default SideMenu;
