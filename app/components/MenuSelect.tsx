import React, { type ReactElement, useEffect, useState } from "react";

import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage,
    Menu,
    MenuButton,
    MenuItem,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Select,
    Text,
    type SelectProps,
} from "@chakra-ui/react";
import { SelectOption } from "@/types";

interface MenuSelectProps extends SelectProps {
    error?: string;
    value?: string[];
    multi?: boolean;
    defaultValue?: string[];
    text: string | ReactElement;
    options: SelectOption[];
    exclusiveOption?: string;
    optionsContainerMaxHeight?: string;
    dropDownWidth?: string;
    optionsWidth?: string;
    highlightWhenSelected?: boolean;
    testId?: string;
    onOptionChange: (selected: string[]) => void;
    clearAllButton?: boolean;
    useCheckIcon?: boolean;
    handleCantFind?: () => void;
    cantFindText?: string;
}

const MenuSelect = ({
    error,
    value,
    multi,
    defaultValue,
    text,
    options,
    exclusiveOption,
    optionsContainerMaxHeight = "auto",
    dropDownWidth = "auto",
    optionsWidth = "14rem",
    highlightWhenSelected,
    testId,
    onOptionChange,
    clearAllButton = false,
    useCheckIcon = true,
    handleCantFind,
    cantFindText,
    ...rest
}: MenuSelectProps) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
    const isControlled = value !== undefined;

    useEffect(() => {
        // Set default value
        if (!selectedOptions.length && defaultValue) {
            setSelectedOptions(defaultValue);
        }
    }, []);

    useEffect(() => {
        if (
            options &&
            exclusiveOption &&
            selectedOptions?.includes(exclusiveOption)
        ) {
            setDisabledOptions(
                options
                    .filter((option) => option.value !== exclusiveOption)
                    .map((option) => option.value)
            );
        } else {
            setDisabledOptions([]);
        }
    }, [selectedOptions]);

    useEffect(() => {
        // Set default value for multi select as defaultValue can change
        if (multi && defaultValue) {
            setSelectedOptions(defaultValue);
        }
    }, [defaultValue]);

    const selectedValues = isControlled ? value : selectedOptions;

    const handleChange = (value: string) => {
        let newOptions: string[] = [];
        if (!multi) {
            newOptions = [value];
            onOptionChange(newOptions);
            setSelectedOptions(newOptions);
            return;
        }

        if (selectedValues.includes(value)) {
            newOptions = selectedValues.filter((option) => option !== value);
        } else newOptions = [...selectedValues, value];

        if (!isControlled) {
            setSelectedOptions(newOptions);
        }
        onOptionChange(newOptions);
    };

    const borderColor =
        highlightWhenSelected && selectedValues.length > 0
            ? "brand.darkText"
            : undefined;

    return (
        <Flex w="full" direction="column" data-testid={testId}>
            <FormControl isInvalid={error ? true : false} w="full">
                <Menu closeOnSelect={!multi}>
                    <Select
                        _hover={
                            highlightWhenSelected && selectedValues.length > 0
                                ? {
                                      borderColor: "brand.darkText",
                                  }
                                : { borderColor: "gray.300" }
                        }
                        borderColor={borderColor}
                        width={dropDownWidth}
                        as={MenuButton}
                        type="button"
                        {...rest}
                    >
                        {typeof text === "string" ? (
                            <Text noOfLines={1}>{text}</Text>
                        ) : (
                            text
                        )}
                    </Select>
                    <MenuList
                        className="bernard123"
                        zIndex="11"
                        p="12px 0"
                        overflow="hidden"
                        maxH={optionsContainerMaxHeight}
                        overflowY="scroll"
                        w={optionsWidth}
                        minW={optionsWidth}
                        sx={{
                            "&::-webkit-scrollbar": {
                                width: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                borderRadius: "24px",
                            },
                        }}
                    >
                        {multi ? (
                            <MenuOptionGroup
                                type="checkbox"
                                value={selectedValues}
                            >
                                {clearAllButton && (
                                    <Flex alignItems="center" h="38px" w="full">
                                        <Button
                                            isDisabled={
                                                selectedValues.length === 0
                                            }
                                            fontSize="16px"
                                            pl={4}
                                            onClick={() => onOptionChange([])}
                                            variant="link"
                                        >
                                            Clear all
                                        </Button>
                                    </Flex>
                                )}
                                {options?.map((option) => {
                                    return (
                                        <MenuItem
                                            w="full"
                                            data-testid={option.value}
                                            disabled={
                                                disabledOptions
                                                    ?.map((option) => option)
                                                    .includes(option.value) ||
                                                false
                                            }
                                            as={Checkbox}
                                            key={option.value}
                                            value={option.value}
                                            isChecked={selectedValues.includes(
                                                option.value
                                            )}
                                            colorScheme="gpBlue"
                                            size="md"
                                            borderColor="brand.blockChip"
                                            maxW="100%"
                                            display="flex"
                                            onChange={() =>
                                                handleChange(option.value)
                                            }
                                        >
                                            <Text p={2}>{option.label}</Text>
                                        </MenuItem>
                                    );
                                })}
                            </MenuOptionGroup>
                        ) : (
                            <MenuOptionGroup
                                type="radio"
                                value={selectedValues[0]}
                            >
                                {options?.map((option) => {
                                    return option.icon ? (
                                        <MenuItem
                                            as={Button}
                                            type="button"
                                            key={option.value}
                                            value={option.value}
                                            isActive={selectedValues.includes(
                                                option.value
                                            )}
                                            onClick={() =>
                                                handleChange(option.value)
                                            }
                                            leftIcon={option.icon}
                                            variant="tertiary"
                                            justifyContent="flex-start"
                                        >
                                            <Text p={2}>{option.label}</Text>
                                        </MenuItem>
                                    ) : (
                                        <>
                                            {useCheckIcon ? (
                                                <MenuItemOption
                                                    pl={-12}
                                                    key={option.value}
                                                    value={option.value}
                                                    isChecked={selectedValues.includes(
                                                        option.value
                                                    )}
                                                    onClick={() =>
                                                        handleChange(
                                                            option.value
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        overflow="hidden"
                                                        maxHeight="30px"
                                                        whiteSpace="nowrap"
                                                        textOverflow="ellipsis"
                                                        p={2}
                                                    >
                                                        {option.label}
                                                    </Text>
                                                </MenuItemOption>
                                            ) : (
                                                <Flex
                                                    key={option.value}
                                                    onClick={() =>
                                                        handleChange(
                                                            option.value
                                                        )
                                                    }
                                                    p={2}
                                                    ml={1}
                                                    _hover={{
                                                        bg: "gray.100",
                                                        cursor: "pointer",
                                                    }}
                                                    w="full"
                                                    direction="column"
                                                >
                                                    <Text noOfLines={1}>
                                                        {option.label}
                                                    </Text>
                                                </Flex>
                                            )}
                                        </>
                                    );
                                })}
                                <Button
                                    pt={3}
                                    pl={3}
                                    onClick={handleCantFind}
                                    variant="link"
                                >
                                    {cantFindText}
                                </Button>
                            </MenuOptionGroup>
                        )}
                    </MenuList>
                </Menu>
                {error && (
                    <Box h="16px" mt="8px">
                        <FormErrorMessage>{error}</FormErrorMessage>
                    </Box>
                )}
            </FormControl>
        </Flex>
    );
};

export default MenuSelect;
