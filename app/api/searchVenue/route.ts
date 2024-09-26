import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { searchTerm } = await req.json();

    const s: string = searchTerm;

    try {
        const venue = await prisma?.venue.findMany({
            where: {
                OR: [
                    {
                        name: {
                            search: s,
                        },
                        address: {
                            search: s,
                        },
                        city: {
                            search: s,
                        },
                        state: {
                            search: s,
                        },
                        country: {
                            search: s,
                        },
                        postcodeZip: {
                            search: s,
                        },
                    },
                ],
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
