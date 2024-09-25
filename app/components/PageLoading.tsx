import React from "react";
import { Center, Spinner } from "@chakra-ui/react";

interface Props {}

const PageLoading = ({}: Props) => {
    return (
        <Center w="full" h="80vh">
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            />
        </Center>
    );
};

export default PageLoading;
