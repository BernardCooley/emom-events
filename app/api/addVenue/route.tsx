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
        console.error(error);
        return NextResponse.json(
            { error: error },
            {
                status: 500,
            }
        );
    }
}
