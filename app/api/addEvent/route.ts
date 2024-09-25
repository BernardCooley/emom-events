import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
