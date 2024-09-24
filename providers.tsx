"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./chakraTheme";
import { EventContextProvider } from "./context/eventContext";
import { PromoterContextProvider } from "./context/promoterContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                <EventContextProvider>
                    <PromoterContextProvider>
                        {children}
                    </PromoterContextProvider>
                </EventContextProvider>
            </ChakraProvider>
        </CacheProvider>
    );
}
