import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    const { data } = await req.json();

    try {
        const event = await prisma?.venue.create({
            data: {
                name: data.name,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                postcodeZip: data.postcodeZip,
                latitude: data.latitude,
                longitude: data.longitude,
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
