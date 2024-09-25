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
