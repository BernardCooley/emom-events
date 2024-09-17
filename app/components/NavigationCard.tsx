import React from "react";
import { Card, CardBody, Center } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/utils";

interface Props {
    page: string;
}

const NavigationCard = ({ page }: Props) => {
    const router = useRouter();
    return (
        <Card
            onClick={() => router.push(`/${page}`)}
            _hover={{
                transform: "scale(1.05)",
                transition: "transform 0.2s",
                cursor: "pointer",
                bg: "gray.50",
                border: "2px solid gray.200",
            }}
            transition="transform 0.2s"
            height="400px"
        >
            <CardBody>
                <Center h="full" fontSize={40}>
                    {capitalizeFirstLetter(page)}
                </Center>
            </CardBody>
        </Card>
    );
};

export default NavigationCard;
