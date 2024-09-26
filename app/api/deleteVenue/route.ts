import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    const { venueId } = await req.json();

    const v: string = venueId;

    try {
        const deleteVenue = await prisma?.venue.delete({
            where: {
                id: v,
            },
        });

        const response = NextResponse.json(
            { deleteVenue },
            {
                status: 200,
            }
        );

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
