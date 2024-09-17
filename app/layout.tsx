import { Providers } from "@/providers";
import "./globals.css";
import { Box } from "@chakra-ui/react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Box p={[4, 8, 12]}>{children}</Box>
                </Providers>
            </body>
        </html>
    );
}
