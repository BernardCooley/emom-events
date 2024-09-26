import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AddEventInput } from "@/types";


export async function POST(req: Request) {
    const { data } = await req.json();

    const d: AddEventInput = data;

    try {
        const event = await prisma?.event.create({
            data: {
                promoterId: d.promoterId,
                venueId: d.venueId,
                name: d.name,
                timeFrom: d.timeFrom,
                timeTo: d.timeTo,
                description: d.description,
                websites: d.websites,
                imageIds: d.imageIds,
                tickets: d.tickets,
                lineup: d.lineup,
                preBookEmail: d.preBookEmail,
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
