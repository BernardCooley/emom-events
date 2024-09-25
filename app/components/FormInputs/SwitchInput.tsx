import {
    Flex,
    FormControl,
    FormErrorMessage,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Switch,
} from "@chakra-ui/react";
import React, { CSSProperties, ReactNode } from "react";
import { useController, Control, FieldValues, Path } from "react-hook-form";
import FieldTitle from "./FieldTitle";

export interface TextInputProps<T extends FieldValues> {
    size: string;
    height?: string;
    title?: string;
    error?: string;
    helperText?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    disabled?: boolean;
    required?: boolean;
    styles?: CSSProperties;
    control: Control<T>;
    name: Path<T>;
    width?: string;
    orientation?: "row" | "column";
}
export const SwitchInput = <T extends FieldValues>({
    control,
    name,
    required,
    title,
    leftIcon,
    size,
    styles,
    height,
    disabled,
    rightIcon,
    helperText,
    error,
    width = "full",
    orientation = "row",
}: TextInputProps<T>) => {
    const { field } = useController({
        control: control,
        name: name,
    });

    console.log("🚀 ~ field:", field);
    return (
        <FormControl w={width} isInvalid={!!error} style={styles}>
            <Flex
                direction={orientation}
                w="full"
                justifyContent={orientation === "row" ? "flex-start" : "center"}
                alignItems={orientation === "row" ? "center" : "start"}
            >
                <FieldTitle
                    title={title}
                    required={required}
                    helperText={helperText}
                />
                <InputGroup>
                    {leftIcon && (
                        <InputLeftElement>{leftIcon}</InputLeftElement>
                    )}

                    <Switch
                        defaultChecked={field?.value}
                        height={height}
                        disabled={disabled}
                        aria-label={title}
                        backgroundColor="white"
                        {...field}
                        size={size}
                        value={field?.value ?? "false"}
                    />

                    {rightIcon && (
                        <InputRightElement>{rightIcon}</InputRightElement>
                    )}
                </InputGroup>
            </Flex>

            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};
SwitchInput.displayName = "SwitchInput";
