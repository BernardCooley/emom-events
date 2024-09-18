import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email } = await req.json();

    try {
        const promoter = await prisma?.promoter.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                name: true,
                city: true,
                state: true,
                country: true,
                imageIds: true,
            },
        });

        const response = NextResponse.json(promoter, {
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
