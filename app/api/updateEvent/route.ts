import prisma from "@/lib/prisma";
import { CustomError } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { id, event } = await req.json();

    try {
        const newEvent = await prisma?.event.update({
            where: {
                id,
            },
            data: event,
        });

        const response = NextResponse.json(newEvent, {
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
