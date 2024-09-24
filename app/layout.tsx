import { Providers } from "@/providers";
import "./globals.css";
import { Box } from "@chakra-ui/react";
import SideMenu from "./components/SideMenu";
import SessionProvider from "./../sessionProvider";
import Header from "./components/Header";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <SessionProvider>
                        <Box position="relative">
                            <Header />
                            <SideMenu placement="right" />
                            <Box p={[4, 8, 12]}>{children}</Box>
                        </Box>
                    </SessionProvider>
                </Providers>
            </body>
        </html>
    );
}
