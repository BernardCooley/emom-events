import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { searchTerm } = await req.json();

    try {
        const venue = await prisma?.venue.findMany({
            where: {
                OR: [
                    {
                        name: {
                            search: searchTerm,
                        },
                        address: {
                            search: searchTerm,
                        },
                        city: {
                            search: searchTerm,
                        },
                        state: {
                            search: searchTerm,
                        },
                        country: {
                            search: searchTerm,
                        },
                        postcodeZip: {
                            search: searchTerm,
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
