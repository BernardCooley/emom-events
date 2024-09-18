import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Collapse,
    Flex,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import Chip from "./Chip";
import { SelectOption } from "@/types";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";

type Props = {
    showAll?: boolean;
    containerWidth?: string;
    chips: SelectOption[];
    chipHeight?: number;
    showRightIcon?: boolean;
    sortChips?: boolean;
    onRemoveChip?: (id: number) => void;
};

const ChipGroup = ({
    showAll = true,
    containerWidth = "full",
    chips,
    chipHeight = 32,
    showRightIcon = true,
    sortChips = false,
    onRemoveChip,
}: Props) => {
    const { isOpen, onToggle } = useDisclosure();
    const [chipContainerHeight, setChipContainerHeight] = useState(0);
    const [currentChips, setCurrentChips] = useState<SelectOption[]>(chips);

    useEffect(() => {
        if (sortChips) {
            setCurrentChips(
                chips.sort((a, b) => a.label.localeCompare(b.label))
            );
        } else {
            setCurrentChips(chips);
        }
    }, [chips]);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setChipContainerHeight(ref.current?.clientHeight || 0);
        }, 0);

        return () => clearTimeout(timer);
    }, [chips]);

    return (
        <Box w="full" mt={-10}>
            <Box mb={chips && chips.length > 0 ? 2 : 0}>
                <Collapse
                    in={isOpen || showAll}
                    animateOpacity
                    startingHeight={chipHeight}
                >
                    <Flex gap={2} wrap="wrap" maxW={containerWidth} ref={ref}>
                        {currentChips?.map((chip, index) => {
                            return (
                                <Chip
                                    styles={{
                                        position: "relative",
                                        height: `${chipHeight}px`,
                                        fontSize: "15px",
                                        borderRadius: "4px",
                                        fontWeight: 400,
                                        backgroundColor:
                                            "brand.backgroundSecondary",
                                    }}
                                    rightIcon={
                                        showRightIcon ? (
                                            <IconButton
                                                rounded="full"
                                                right={1}
                                                top={1}
                                                h="28px"
                                                w="28px"
                                                minW="unset"
                                                position="absolute"
                                                aria-label="Remove image"
                                                icon={
                                                    <CloseIcon height="10px" />
                                                }
                                                onClick={() => {
                                                    if (onRemoveChip) {
                                                        onRemoveChip(index);
                                                    }
                                                }}
                                            />
                                        ) : null
                                    }
                                    key={chip.value}
                                    label={chip.label}
                                />
                            );
                        })}
                    </Flex>
                </Collapse>
            </Box>
            {!showAll && chipContainerHeight > chipHeight && (
                <Collapse
                    in={chipContainerHeight > chipHeight}
                    startingHeight={0}
                >
                    <Button
                        width="fit-content"
                        variant="unstyled"
                        color="brand.primary"
                        fontSize="15px"
                        onClick={onToggle}
                        rightIcon={<ChevronDownIcon />}
                    >
                        {`View ${isOpen ? "less" : "more"}`}
                    </Button>
                </Collapse>
            )}
        </Box>
    );
};

export default ChipGroup;
