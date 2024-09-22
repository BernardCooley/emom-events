import { Center } from "@chakra-ui/react";
import React from "react";

interface Props {
    showButton?: boolean;
    positionY: "top" | "bottom";
    positionX: "left" | "right";
    icon: React.ReactNode;
}

const FloatingIconButton = ({
    showButton = true,
    positionX,
    positionY,
    icon,
}: Props) => {
    return (
        <>
            {showButton && (
                <Center
                    zIndex={999}
                    bottom={positionY === "bottom" ? 2 : undefined}
                    top={positionY === "top" ? 2 : undefined}
                    right={positionX === "right" ? 2 : undefined}
                    left={positionX === "left" ? 2 : undefined}
                    color="brand.primary-light"
                    bg="brand.primary"
                    shadow="2xl"
                    pos="fixed"
                    rounded="full"
                    p="8px"
                    _hover={{
                        cursor: "pointer",
                    }}
                >
                    {icon}
                </Center>
            )}
        </>
    );
};

export default FloatingIconButton;
