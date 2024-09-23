import React from "react";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import GooglePlacesSearch from "./GooglePlacesSearch";
import { TextInput } from "./TextInput";
import { Control, FieldErrors } from "react-hook-form";
import { FormData } from "./AddEventModal";

interface Props {
    onManualButtonClick: () => void;
    onPlaceChange: (place: any) => void;
    isManual: boolean;
    onSearchClick: () => void;
    errors: FieldErrors<FormData>;
    onAcceptVenue: () => void;
    control: Control<FormData, any>;
}

const AddressSearch = ({
    onManualButtonClick,
    onPlaceChange,
    isManual,
    onSearchClick,
    errors,
    onAcceptVenue,
    control,
}: Props) => {
    return (
        <Box w="full">
            {isManual ? (
                <VStack w="full" alignItems="start">
                    <Button
                        mt={4}
                        mb={7}
                        onClick={onSearchClick}
                        variant="link"
                    >
                        Search for an address
                    </Button>

                    <VStack
                        alignItems="start"
                        h={isManual ? "unset" : 0}
                        overflow={isManual ? "unset" : "hidden"}
                        opacity={isManual ? 1 : 0}
                        w="full"
                        spacing={4}
                    >
                        <TextInput
                            type="text"
                            title="Street Address"
                            size="lg"
                            name="venue.address"
                            error={errors.venue?.address?.message}
                            control={control}
                        />
                        <TextInput
                            type="text"
                            title="City/Town"
                            size="lg"
                            name="venue.city"
                            error={errors.venue?.city?.message}
                            control={control}
                            required
                        />
                        <TextInput
                            type="text"
                            title="County/State"
                            size="lg"
                            name="venue.state"
                            error={errors.venue?.state?.message}
                            control={control}
                            required
                        />
                        <TextInput
                            type="text"
                            title="Country"
                            size="lg"
                            name="venue.country"
                            error={errors.venue?.country?.message}
                            control={control}
                            required
                        />
                        <TextInput
                            type="text"
                            title="Postcode/Zip"
                            size="lg"
                            name="venue.postcodeZip"
                            error={errors.venue?.postcodeZip?.message}
                            control={control}
                        />
                        <VStack
                            h="80px"
                            color="red"
                            w="full"
                            gap={4}
                            alignItems="start"
                        >
                            <Button
                                border={errors.venue ? "1px solid" : "none"}
                                borderColor={errors.venue ? "red" : "none"}
                                onClick={onAcceptVenue}
                            >
                                Accept Venue
                            </Button>
                            {errors.venue && (
                                <Text>Errors occur. Please see above</Text>
                            )}
                        </VStack>
                    </VStack>
                </VStack>
            ) : (
                <VStack w="full" alignItems="flex-start">
                    <Button
                        mb={5}
                        mt={4}
                        onClick={onManualButtonClick}
                        variant="link"
                    >
                        Enter address manually
                    </Button>
                    <Flex w="full" alignItems="center" gap={4}>
                        <GooglePlacesSearch
                            control={control}
                            onPlaceChange={(place) => {
                                onPlaceChange(place);
                                onAcceptVenue();
                            }}
                        />
                    </Flex>
                </VStack>
            )}
        </Box>
    );
};

export default AddressSearch;
