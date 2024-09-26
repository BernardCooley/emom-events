import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { data } = await req.json();

    try {
        const promoter = await prisma?.promoter.create({
            data: {
                name: data.name,
                city: data.city,
                state: data.state,
                country: data.country,
                imageIds: data.imageIds,
                email: data.email,
                websites: data.websites,
                showEmail: data.showEmail,
            },
        });

        const response = NextResponse.json(promoter, {
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
