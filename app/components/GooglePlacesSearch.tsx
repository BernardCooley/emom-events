import React, { useRef } from "react";
import { Box } from "@chakra-ui/react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { TextInput } from "./TextInput";
import { getAddress } from "@/utils";
import { Control } from "react-hook-form";
import { FormData } from "./AddEventModal";

interface Props {
    onPlaceChange: (address: {
        address: string;
        city: string;
        state: string;
        country: string;
        postcodeZip: string;
        latitude: number;
        longitude: number;
    }) => void;
    control: Control<FormData, any>;
}

const GooglePlacesSearch = ({ onPlaceChange, control }: Props) => {
    const placesRef = useRef<any>(null);

    const handlePlaceChange = () => {
        const [place] = placesRef.current.getPlaces();
        const addressComponents = getAddress(place);
        onPlaceChange({
            address: addressComponents.address,
            city: addressComponents.city,
            state: addressComponents.state,
            country: addressComponents.country,
            postcodeZip: addressComponents.postcodeZip,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
        });
    };

    return (
        <Box w="full" position="relative" zIndex={5000}>
            <StandaloneSearchBox
                onLoad={(ref) => (placesRef.current = ref)}
                onPlacesChanged={handlePlaceChange}
            >
                <TextInput
                    placeholder=""
                    name="googlePlaceSearch"
                    control={control}
                    title="Search for an address"
                    type="text"
                    size="lg"
                />
            </StandaloneSearchBox>
        </Box>
    );
};

export default GooglePlacesSearch;
