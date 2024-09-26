import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AddVenueInput } from "@/types";

export async function POST(req: Request) {
    const { data } = await req.json();

    const d: AddVenueInput = data;

    try {
        const event = await prisma?.venue.create({
            data: {
                name: d.name,
                address: d.address,
                city: d.city,
                state: d.state,
                country: d.country,
                postcodeZip: d.postcodeZip,
                latitude: d.latitude,
                longitude: d.longitude,
            },
        });

        const response = NextResponse.json(event, {
            status: 200,
        });

        return response;
    } catch (error: unknown) {
        console.error("Error creating event:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json(
                { error: "An unknown error occurred" },
                { status: 500 }
            );
        }
    }
}
