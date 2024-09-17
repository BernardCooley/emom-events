"use client";

import { Box, SimpleGrid, GridItem } from "@chakra-ui/react";
import NavigationCard from "./components/NavigationCard";

export default function Home() {
    const pages = ["events", "promoters", "venues"];

    return (
        <Box position="relative">
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={10}>
                {pages.map((page) => (
                    <GridItem key={page}>
                        <NavigationCard page={page} />
                    </GridItem>
                ))}
            </SimpleGrid>
        </Box>
    );
}
