import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { id } = await req.json();

    try {
        const venue = await prisma?.venue.findUnique({
            where: {
                id,
            },
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
                links: true,
                events: {
                    select: {
                        id: true,
                        name: true,
                        timeFrom: true,
                        timeTo: true,
                        description: true,
                        imageIds: true,
                        venue: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
                                city: true,
                                state: true,
                                country: true,
                            },
                        },
                        websites: true,
                        lineup: true,
                        promoter: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        preBookEmail: true,
                    },
                },
                createAt: true,
            },
        });

        const response = NextResponse.json(venue, {
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
