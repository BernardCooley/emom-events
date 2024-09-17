"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import { useParams } from "next/navigation";

interface Props {}

const Venue = ({}: Props) => {
    const { venueId } = useParams();
    return <Box>{venueId}</Box>;
};

export default Venue;
