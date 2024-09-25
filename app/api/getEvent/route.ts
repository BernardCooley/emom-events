import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { eventId } = await req.json();

    try {
        const event = await prisma?.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                id: true,
                name: true,
                timeFrom: true,
                timeTo: true,
                description: true,
                imageIds: true,
                promoter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                venue: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                        state: true,
                        country: true,
                        postcodeZip: true,
                        latitude: true,
                        longitude: true,
                    },
                },
                lineup: true,
                websites: true,
                preBookEmail: true,
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
