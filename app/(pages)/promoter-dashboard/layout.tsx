import React from "react";
import { Box } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
    children: React.ReactNode;
}

const ComponentName = async ({ children }: Props) => {
    const session = await getServerSession();

    if (!session || !session.user) {
        redirect("/");
    }

    return <Box position="relative">{children}</Box>;
};

export default ComponentName;
