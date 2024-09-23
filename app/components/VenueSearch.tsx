import React from "react";
import { Button, IconButton, Text, VStack } from "@chakra-ui/react";
import { TextInput2 } from "./TextInput2";
import { SearchIcon } from "@chakra-ui/icons";
import { Control, FieldErrors } from "react-hook-form";
import { FormData } from "./AddEventModal";
import { VenueItem } from "@/types";
import MenuSelect from "./MenuSelect";

interface Props {
    onAddManuallyClick: () => void;
    handleSearchVenue: () => void;
    venueSearchTerm: string;
    isManual: boolean;
    onExistingVenueSearchClick: () => void;
    showResults: boolean;
    venues: VenueItem[] | null;
    handleVenueClick: (venue: VenueItem) => void;
    venueSearched: boolean;
    control: Control<FormData, any>;
    errors: FieldErrors<FormData>;
}

const VenueSearch = ({
    onAddManuallyClick,
    handleSearchVenue,
    venueSearchTerm,
    isManual,
    onExistingVenueSearchClick,
    showResults,
    venues,
    handleVenueClick,
    venueSearched,
    control,
    errors,
}: Props) => {
    return (
        <>
            {isManual ? (
                <Button
                    mb={4}
                    onClick={onExistingVenueSearchClick}
                    variant="link"
                >
                    Search for an existing Venue
                </Button>
            ) : (
                <VStack w="full" gap={6}>
                    <VStack gap={6} w="full" alignItems="start">
                        <TextInput2
                            onEnter={handleSearchVenue}
                            type="text"
                            title="Search for an existing Venue"
                            size="lg"
                            name="venueSearchTerm"
                            error={errors.venueSearchTerm?.message}
                            control={control}
                            required
                            rightIcon={
                                venueSearchTerm?.length > 0 && (
                                    <IconButton
                                        mt={5}
                                        h="58px"
                                        w="58px"
                                        minW="unset"
                                        aria-label="Search"
                                        icon={<SearchIcon />}
                                        onClick={handleSearchVenue}
                                    />
                                )
                            }
                        />
                    </VStack>
                    <VStack alignItems="start" gap={2} w="full" mt={-10}>
                        {showResults && venues && (
                            <MenuSelect
                                handleCantFind={() => onAddManuallyClick()}
                                cantFindText="Can't find? Add Venue manually"
                                useCheckIcon={false}
                                optionsContainerMaxHeight="300px"
                                optionsWidth="full"
                                dropDownWidth="full"
                                text="Select a Venue"
                                options={venues
                                    .map((v) => {
                                        return {
                                            value: v.id,
                                            label: [
                                                v.name,
                                                v.address,
                                                v.city,
                                                v.state,
                                                v.country,
                                            ].join(", "),
                                        };
                                    })
                                    .map((v) => ({
                                        value: v.value,
                                        label: v.label,
                                    }))}
                                onOptionChange={(value) => {
                                    if (value[0] === "add") {
                                        onAddManuallyClick();
                                        return;
                                    }

                                    const selectedVenue = venues.find(
                                        (v) => v.id === value[0]
                                    );
                                    handleVenueClick(selectedVenue!!);
                                }}
                            />
                        )}
                        {venues && venues.length === 0 && venueSearched && (
                            <VStack w="full" pt={2} gap={4} alignItems="start">
                                <Text w="full" fontSize="lg">
                                    No Venues found
                                </Text>
                                <Button
                                    onClick={onAddManuallyClick}
                                    variant="link"
                                >
                                    Add Venue manually
                                </Button>
                            </VStack>
                        )}
                    </VStack>
                </VStack>
            )}
        </>
    );
};

export default VenueSearch;
