"use client";

import React from "react";
import { venues } from "@/data/events";
import ItemList from "@/app/components/ItemList";
import { Venue } from "@/types";

interface Props {}

const Venues = ({}: Props) => {
    const fields = ["address", "country"] satisfies (keyof Venue)[];

    return <ItemList fields={fields} data={venues} page="venues" />;
};

export default Venues;
