import React from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { TextInput } from "./TextInput";
import { SmallAddIcon } from "@chakra-ui/icons";
import ChipGroup from "../ChipGroup";
import { Control } from "react-hook-form";

interface Props {
    onEnter: () => void;
    fieldValue: string;
    onRemoveChip: (index: number) => void;
    chips: string[];
    control: Control<any>;
    title: string;
    name: string;
}

const TextFieldChipGroup = ({
    onEnter,
    fieldValue,
    onRemoveChip,
    chips,
    control,
    title,
    name,
}: Props) => {
    return (
        <>
            <TextInput
                type="text"
                title={title}
                size="lg"
                name={name}
                control={control}
                onEnter={onEnter}
                rightIcon={
                    fieldValue?.length > 0 && (
                        <IconButton
                            mt={2}
                            h="44px"
                            w="36px"
                            minW="unset"
                            aria-label="Website"
                            icon={<SmallAddIcon fontSize="28px" />}
                            onClick={onEnter}
                        />
                    )
                }
            />

            <Box w="full" mt={6}>
                <ChipGroup
                    title="Websites: "
                    onRemoveChip={(index) => onRemoveChip(index)}
                    chips={chips.map((chip) => ({
                        label: chip,
                        value: chip.toLowerCase(),
                    }))}
                />
            </Box>
        </>
    );
};

export default TextFieldChipGroup;
