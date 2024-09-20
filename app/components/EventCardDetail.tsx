import React from "react";
import { Box, Heading, Link, Text } from "@chakra-ui/react";

interface Props {
    title: string;
    value: string;
    href?: string;
}

const EventCardDetail = ({ title, value, href }: Props) => {
    return (
        <Box>
            <Heading size="xs" textTransform="uppercase">
                {title}
            </Heading>
            {href ? (
                <Link href={href}>
                    <Text pt="2" fontSize="sm">
                        {value}
                    </Text>
                </Link>
            ) : (
                <Text pt="2" fontSize="sm">
                    {value}
                </Text>
            )}
        </Box>
    );
};

export default EventCardDetail;
