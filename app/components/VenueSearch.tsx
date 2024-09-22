import React from "react";
import { Button, IconButton, Text, VStack } from "@chakra-ui/react";
import { TextInput } from "./TextInput";
import { SearchIcon } from "@chakra-ui/icons";
import { UseFormRegister } from "react-hook-form";
import { FormData } from "./AddEventModal";
import { VenueItem } from "@/types";
import MenuSelect from "./MenuSelect";

interface Props {
    register: UseFormRegister<FormData>;
    onAddManuallyClick: () => void;
    onVenueSearchChange: (searchTerm: string) => void;
    handleSearchVenue: () => void;
    venueSearchTerm: string;
    isManual: boolean;
    onExistingVenueSearchClick: () => void;
    showResults: boolean;
    venues: VenueItem[] | null;
    handleVenueClick: (venue: VenueItem) => void;
    venueSearched: boolean;
}

const VenueSearch = ({
    onAddManuallyClick,
    register,
    onVenueSearchChange,
    handleSearchVenue,
    venueSearchTerm,
    isManual,
    onExistingVenueSearchClick,
    showResults,
    venues,
    handleVenueClick,
    venueSearched,
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
                        <TextInput
                            fieldProps={register("venueSearchTerm")}
                            onChange={(e) => {
                                onVenueSearchChange(e.target.value);
                            }}
                            title="Search for an existing Venue"
                            type="text"
                            size="lg"
                            height="60px"
                            variant="outline"
                            onEnter={handleSearchVenue}
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
