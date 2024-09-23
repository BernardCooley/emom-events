import React, { ReactNode } from "react";
import {
    Box,
    FormLabel,
    Flex,
    Text,
    FormHelperText,
    TypographyProps,
} from "@chakra-ui/react";

type Props = {
    title: string | undefined;
    required?: boolean;
    helperText?: ReactNode;
    titleSize?: TypographyProps["fontSize"];
    helperTextSize?: TypographyProps["fontSize"];
};

const FieldTitle = ({
    title,
    required,
    helperText,
    titleSize = "md",
    helperTextSize = "sm",
}: Props) => {
    return (
        <>
            <FormLabel mb={0} fontSize={titleSize}>
                <Flex>
                    <Text>{title}</Text>
                    {required && (
                        <Box color="gpRed.500" pl={1}>
                            *
                        </Box>
                    )}
                </Flex>
            </FormLabel>
            {helperText && (
                <FormHelperText fontSize={helperTextSize} mb="4">
                    {helperText}
                </FormHelperText>
            )}
        </>
    );
};

export default FieldTitle;
