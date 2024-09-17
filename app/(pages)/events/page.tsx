"use client";

import React from "react";
import { events } from "@/data/events";
import ItemList from "@/app/components/ItemList";
import { Event } from "@/types";

interface Props {}

const Page = ({}: Props) => {
    const fields = [
        "description",
        "timeFrom",
        "timeTo",
    ] satisfies (keyof Event)[];

    return <ItemList fields={fields} data={events} page="events" />;
};

export default Page;
