import {
    Box,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Textarea,
} from "@chakra-ui/react";
import React, {
    CSSProperties,
    ComponentProps,
    LegacyRef,
    ReactNode,
    forwardRef,
} from "react";

interface Props {
    placeholder?: string;
    height?: string;
    size: string;
    title?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fieldProps?: ComponentProps<"textarea">;
    required?: boolean;
    styles?: CSSProperties;
    type?: string;
    variant?: string;
    isReadOnly?: boolean;
    allowErrors?: boolean;
    allowHelperText?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onEnter?: () => void;
}

export const TextAreaInput = forwardRef(
    (
        {
            placeholder = "",
            height = "70px",
            size,
            title = "",
            error,
            helperText = "",
            leftIcon,
            rightIcon,
            fieldProps,
            required = false,
            styles = {},
            variant = "primary",
            isReadOnly = false,
            allowErrors = true,
            allowHelperText = false,
            onChange,
            onEnter,
        }: Props,
        ref: LegacyRef<HTMLTextAreaElement>
    ) => {
        return (
            <FormControl isInvalid={error ? true : false} style={styles}>
                <FormLabel fontSize="lg" mb={0}>
                    <Flex>
                        <Box>{title}</Box>
                        {required && (
                            <Box color="gpRed.500" pl={1}>
                                *
                            </Box>
                        )}
                    </Flex>
                </FormLabel>
                {allowHelperText && (
                    <FormHelperText
                        fontSize="sm"
                        py={2}
                        mt={0}
                        color="brand.lightTitle"
                    >
                        {helperText}
                    </FormHelperText>
                )}
                <InputGroup>
                    {leftIcon && (
                        <InputLeftElement>{leftIcon}</InputLeftElement>
                    )}
                    <Textarea
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onEnter && onEnter();
                            }
                        }}
                        isReadOnly={isReadOnly}
                        variant={variant}
                        ref={ref}
                        placeholder={placeholder}
                        height={height}
                        {...(fieldProps ? fieldProps : {})}
                        boxSizing="border-box"
                        size={size}
                        aria-label={title}
                        onChange={onChange}
                    />
                    {rightIcon && (
                        <InputRightElement>{rightIcon}</InputRightElement>
                    )}
                </InputGroup>
                {allowErrors && (
                    <Box h="16px" mt="8px">
                        <FormErrorMessage>{error}</FormErrorMessage>
                    </Box>
                )}
            </FormControl>
        );
    }
);

TextAreaInput.displayName = "TextAreaInput";
