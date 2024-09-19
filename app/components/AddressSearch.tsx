import React from "react";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import GooglePlacesSearch from "./GooglePlacesSearch";
import { TextInput } from "./TextInput";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "./AddEventModal";

interface Props {
    onManualButtonClick: () => void;
    onPlaceChange: (place: any) => void;
    isManual: boolean;
    onSearchClick: () => void;
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    onAcceptVenue: () => void;
}

const AddressSearch = ({
    onManualButtonClick,
    onPlaceChange,
    isManual,
    onSearchClick,
    register,
    errors,
    onAcceptVenue,
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
                            title="Street Address"
                            type="text"
                            size="lg"
                            fieldProps={register("venue.address")}
                            height="60px"
                            variant="outline"
                            error={errors.venue?.address?.message}
                        />
                        <TextInput
                            title="City/Town"
                            type="text"
                            size="lg"
                            fieldProps={register("venue.city")}
                            height="60px"
                            variant="outline"
                            error={errors.venue?.city?.message}
                            required
                        />
                        <TextInput
                            title="County/State"
                            type="text"
                            size="lg"
                            fieldProps={register("venue.state")}
                            height="60px"
                            variant="outline"
                            error={errors.venue?.state?.message}
                            required
                        />
                        <TextInput
                            title="Country"
                            type="text"
                            size="lg"
                            fieldProps={register("venue.country")}
                            height="60px"
                            variant="outline"
                            error={errors.venue?.country?.message}
                            required
                        />
                        <TextInput
                            title="Postcode/Zip"
                            type="text"
                            size="lg"
                            fieldProps={register("venue.postcodeZip")}
                            height="60px"
                            variant="outline"
                            error={errors.venue?.postcodeZip?.message}
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
                        Enter location manually
                    </Button>
                    <Flex w="full" alignItems="center" gap={4}>
                        <GooglePlacesSearch
                            onPlaceChange={(place) => {
                                onPlaceChange(place);
                            }}
                        />
                    </Flex>
                </VStack>
            )}
        </Box>
    );
};

export default AddressSearch;
