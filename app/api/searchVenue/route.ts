import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name } = await req.json();

    try {
        const venue = await prisma?.venue.findMany({
            where: {
                name: {
                    search: name,
                },
            },

            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                state: true,
                country: true,
                postcodeZip: true,
            },
        });

        const response = NextResponse.json(venue, {
            status: 200,
        });

        return response;
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            { error: error },
            {
                status: error.status || 500,
            }
        );
    }
}
