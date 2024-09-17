import { Providers } from "@/providers";
import "./globals.css";
import { Box } from "@chakra-ui/react";
import SideMenu from "./components/SideMenu";
import SessionProvider from "./../sessionProvider";

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
                        <Box p={[4, 8, 12]}>
                            <SideMenu placement="right" />
                            {children}
                        </Box>
                    </SessionProvider>
                </Providers>
            </body>
        </html>
    );
}
