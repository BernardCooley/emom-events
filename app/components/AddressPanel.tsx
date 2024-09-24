import React from "react";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { FieldErrors } from "react-hook-form";
import { FormData } from "./AddEventModal";

interface Props {
    address: {
        name: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postcodeZip: string;
    };
    onEdit: () => void;
    errors: FieldErrors<FormData>;
}

const AddressPanel = ({ address, onEdit, errors }: Props) => {
    return (
        <HStack
            sx={
                errors?.venue
                    ? {
                          border: "2px solid red",
                      }
                    : {}
            }
            rounded="lg"
            gap={10}
            bg="gray.200"
            p={2}
            alignItems="flex-start"
        >
            <VStack pt={4} gap={0} alignItems="flex-start">
                <Text>{address.name}</Text>
                <Text>{address.address}</Text>
                <Text>{address.city}</Text>
                <Text>{address.state}</Text>
                <Text>{address.country}</Text>
                <Text>{address.postcodeZip}</Text>
            </VStack>

            <Button onClick={onEdit} variant="link">
                Edit
            </Button>
        </HStack>
    );
};

export default AddressPanel;
