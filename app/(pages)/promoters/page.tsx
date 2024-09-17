"use client";

import React from "react";
import { promoters } from "@/data/events";
import ItemList from "@/app/components/ItemList";
import { Promoter } from "@/types";

interface Props {}

const Promoters = ({}: Props) => {
    const fields = ["email", "country"] satisfies (keyof Promoter)[];

    return <ItemList fields={fields} data={promoters} page="promoters" />;
};

export default Promoters;
