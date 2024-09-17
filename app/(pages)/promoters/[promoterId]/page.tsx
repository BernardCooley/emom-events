"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import { useParams } from "next/navigation";

interface Props {}

const Promoter = ({}: Props) => {
    const { promoterId } = useParams();
    return <Box>{promoterId}</Box>;
};

export default Promoter;
