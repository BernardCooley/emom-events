import { Providers } from "@/providers";
import "./globals.css";
import { Box } from "@chakra-ui/react";
import SideMenu from "./components/SideMenu";
import SessionProvider from "./../sessionProvider";
import Header from "./components/Header";
import type { Metadata, Viewport } from "next";

const APP_NAME = "Emom Events App";
const APP_DEFAULT_TITLE = "My Awesome Emom Events App";
const APP_TITLE_TEMPLATE = "%s - Emom Events App";
const APP_DESCRIPTION = "Best Emom Events App in the world!";

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
};

export const viewport: Viewport = {
    themeColor: "#FFFFFF",
};

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
                            <Box p={[4, 8, 12]} pt={[4]}>
                                {children}
                            </Box>
                        </Box>
                    </SessionProvider>
                </Providers>
            </body>
        </html>
    );
}
