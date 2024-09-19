import React, { useRef } from "react";
import { Box } from "@chakra-ui/react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { TextInput } from "./TextInput";
import { getAddress } from "@/utils";

interface Props {
    onPlaceChange: (address: {
        address: string;
        city: string;
        state: string;
        country: string;
        postcodeZip: string;
    }) => void;
}

const GooglePlacesSearch = ({ onPlaceChange }: Props) => {
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
        });
    };

    return (
        <Box w="full" position="relative" zIndex={5000}>
            <StandaloneSearchBox
                onLoad={(ref) => (placesRef.current = ref)}
                onPlacesChanged={handlePlaceChange}
            >
                <TextInput
                    title="Search for a location"
                    type="text"
                    size="lg"
                    height="60px"
                    variant="outline"
                />
            </StandaloneSearchBox>
        </Box>
    );
};

export default GooglePlacesSearch;
