import React from "react";
import { Button, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import { TextInput } from "./TextInput";
import { SearchIcon } from "@chakra-ui/icons";
import { UseFormRegister } from "react-hook-form";
import { FormData } from "./AddEventModal";
import { VenueItem } from "@/types";

interface Props {
    register: UseFormRegister<FormData>;
    onAddManuallyClick: () => void;
    onVenueSearchChange: (searchTerm: string) => void;
    handleSearchVenue: () => void;
    venueSearchTerm: string;
    isManual: boolean;
    onSearchClick: () => void;
    showResults: boolean;
    venues: VenueItem[] | null;
    handleVenueClick: (index: number) => void;
}

const VenueSearch = ({
    onAddManuallyClick,
    register,
    onVenueSearchChange,
    handleSearchVenue,
    venueSearchTerm,
    isManual,
    onSearchClick,
    showResults,
    venues,
    handleVenueClick,
}: Props) => {
    return (
        <>
            {isManual ? (
                <Button mb={4} onClick={onSearchClick} variant="link">
                    Search for an existing Venue
                </Button>
            ) : (
                <VStack w="full" gap={6}>
                    <VStack gap={6} w="full" alignItems="start">
                        <Button onClick={onAddManuallyClick} variant="link">
                            Add Venue manually
                        </Button>
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
                        {showResults &&
                            venues &&
                            venues.length > 0 &&
                            venues.map((venue, index) => (
                                <Flex
                                    onClick={() => handleVenueClick(index)}
                                    p={2}
                                    _hover={{
                                        bg: "gray.100",
                                        cursor: "pointer",
                                    }}
                                    w="full"
                                    direction="column"
                                    key={venue.id}
                                >
                                    <Text>{venue.name}</Text>
                                    <Text>{`${[
                                        venue.address,
                                        venue.city,
                                        venue.state,
                                        venue.country,
                                    ].join(", ")}`}</Text>
                                </Flex>
                            ))}
                        {showResults && !venues && (
                            <Text w="full" fontSize="lg">
                                No Venues found
                            </Text>
                        )}
                    </VStack>
                </VStack>
            )}
        </>
    );
};

export default VenueSearch;
