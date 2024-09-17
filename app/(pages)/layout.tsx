import React from "react";
import { Box } from "@chakra-ui/react";

interface Props {
    children: React.ReactNode;
}

const ComponentName = ({ children }: Props) => {
    return <Box position="relative">{children}</Box>;
};

export default ComponentName;
