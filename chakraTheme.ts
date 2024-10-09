import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    fonts: {
        heading: "Roboto, Arial, Helvetica, sans-serif",
        body: "Roboto, Arial, Helvetica, sans-serif",
    },
    colors: {
        brand: {
            white: "#FFFFFF",
            primary: {
                "50": "#EFF6F6",
                "100": "#D2E5E5",
                "200": "#B5D4D4",
                "300": "#98C3C3",
                "400": "#7BB2B2",
                "500": "#5DA2A2",
                "600": "#4B8181",
                "700": "#386161",
                "800": "#254141",
                "900": "#132020",
            },
            secondary: {
                "50": "#F0F2F5",
                "100": "#D5DAE2",
                "200": "#BAC2CF",
                "300": "#9EAABC",
                "400": "#8393AA",
                "500": "#687B97",
                "600": "#536279",
                "700": "#3E4A5B",
                "800": "#2A313C",
                "900": "#15191E",
            },
            error: {
                "50": "#FBE9E9",
                "100": "#F5C2C2",
                "200": "#EE9B9B",
                "300": "#E77373",
                "400": "#E14C4C",
                "500": "#DA2525",
                "600": "#AF1D1D",
                "700": "#831616",
                "800": "#570F0F",
                "900": "#2C0707",
            },
        },
    },
    components: {
        Button: {
            variants: {
                filter: {
                    minWidth: "fit-content",
                    w: "auto",
                    whiteSpace: "nowrap",
                    h: 8,
                    px: 3,
                    rounded: "full",
                    bg: "transparent",
                    border: "1px solid",
                    borderColor: "brand.secondary.500",
                    color: "brand.secondary.500",
                    _hover: {
                        bg: "brand.secondary.600",
                        color: "brand.white",
                    },
                    _active: {
                        backgroundColor: "brand.secondary.700",
                        color: "brand.white",
                    },
                },
            },
        },
        Heading: {
            baseStyle: {
                fontWeight: 700,
                color: "brand.secondary.800",
            },
            variants: {
                "page-title": {
                    fontSize: "4xl",
                    w: "full",

                    textAlign: "center",
                    pb: 6,
                },
                "section-title": {
                    fontSize: "2xl",
                },
            },
        },
    },
});
