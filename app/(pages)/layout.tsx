import React from "react";
import { Box } from "@chakra-ui/react";
import SideMenu from "../components/SideMenu";

interface Props {
    children: React.ReactNode;
}

const ComponentName = ({ children }: Props) => {
    return (
        <Box position="relative">
            <Box position="absolute" right={-10} top={-10}>
                <SideMenu placement="right" />
            </Box>
            {children}
        </Box>
    );
};

export default ComponentName;
