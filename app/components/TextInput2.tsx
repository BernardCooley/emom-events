import {
    FormControl,
    FormErrorMessage,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Textarea,
} from "@chakra-ui/react";
import React, { CSSProperties, ReactNode } from "react";
import { useController, Control, FieldValues, Path } from "react-hook-form";
import FieldTitle from "./FieldTitle";

export interface TextInputProps<T extends FieldValues> {
    placeholder?: string;
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
    type?: string;
    min?: string;
    onEnter?: () => void;
    width?: string;
    isTextArea?: boolean;
}
export const TextInput2 = <T extends FieldValues>({
    control,
    name,
    required,
    title,
    leftIcon,
    placeholder,
    size,
    styles,
    height,
    disabled,
    rightIcon,
    helperText,
    error,
    type = "text",
    min,
    onEnter,
    width = "full",
    isTextArea = false,
}: TextInputProps<T>) => {
    const { field } = useController({
        control: control,
        name: name,
    });

    return (
        <FormControl w={width} isInvalid={!!error} style={styles}>
            <FieldTitle
                title={title}
                required={required}
                helperText={helperText}
            />
            <InputGroup>
                {leftIcon && <InputLeftElement>{leftIcon}</InputLeftElement>}
                {isTextArea ? (
                    <Textarea
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onEnter && onEnter();
                            }
                        }}
                        {...field}
                        placeholder={placeholder}
                        size={size}
                        value={field?.value ?? ""}
                        backgroundColor="white"
                        height={height}
                        disabled={disabled}
                        aria-label={title}
                    />
                ) : (
                    <Input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onEnter && onEnter();
                            }
                        }}
                        min={min}
                        type={type}
                        {...field}
                        placeholder={placeholder}
                        size={size}
                        value={field?.value ?? ""}
                        backgroundColor="white"
                        height={height}
                        disabled={disabled}
                        aria-label={title}
                    />
                )}

                {rightIcon && (
                    <InputRightElement>{rightIcon}</InputRightElement>
                )}
            </InputGroup>

            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};
TextInput2.displayName = "TextInput2";
