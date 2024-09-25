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
    } catch (error: unknown) {
        console.error("Error updating promoter:", error);
        if (error instanceof CustomError) {
            console.log("CustomError");
            return NextResponse.json(
                { error: error.message },
                { status: error.status || 500 }
            );
        } else if (error instanceof Error) {
            console.log("Error");
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.log("Unknown error");
            return NextResponse.json(
                { error: "An unknown error occurred" },
                { status: 500 }
            );
        }
    }
}
