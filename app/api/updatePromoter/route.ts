import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { id, data } = await req.json();

    try {
        const newPromoter = await prisma?.promoter.update({
            where: {
                id,
            },
            data,
        });

        const response = NextResponse.json(newPromoter, {
            status: 200,
        });

        return response;
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json(
            { error: error },
            {
                status: 500,
            }
        );
    }
}
