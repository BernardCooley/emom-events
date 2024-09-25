import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CustomError } from "@/types";

export async function POST(req: Request) {
    const { data } = await req.json();

    try {
        const event = await prisma?.event.create({
            data: {
                promoterId: data.promoterId,
                venueId: data.venueId,
                name: data.name,
                timeFrom: data.timeFrom,
                timeTo: data.timeTo,
                description: data.description,
                websites: data.websites,
                imageIds: data.imageIds,
                tickets: data.tickets,
                lineup: data.lineup,
                preBookEmail: data.preBookEmail,
            },
        });

        const response = NextResponse.json(event, {
            status: 200,
        });

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
