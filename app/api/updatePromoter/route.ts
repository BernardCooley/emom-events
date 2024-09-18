import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { data } = await req.json();

    try {
        const promoter = await prisma?.promoter.update({
            where: {
                id: data.email,
            },
            data,
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
