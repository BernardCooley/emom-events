import prisma from "@/lib/prisma";
import { UpdateEventInput } from "@/types";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { id, event } = await req.json();

    const i: string = id;
    const e: UpdateEventInput = event;

    try {
        const newEvent = await prisma?.event.update({
            where: {
                id: i,
            },
            data: e,
        });

        const response = NextResponse.json(newEvent, {
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
