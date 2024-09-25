import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CustomError } from "@/types";

export async function POST(req: Request) {
    const { venueId } = await req.json();

    try {
        const deleteVenue = await prisma?.venue.delete({
            where: {
                id: venueId,
            },
        });

        const response = NextResponse.json(
            { deleteVenue },
            {
                status: 200,
            }
        );

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
