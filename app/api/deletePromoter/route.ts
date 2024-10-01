import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { promoterId } = await req.json();

    try {
        const deletePromoter = await prisma?.promoter.delete({
            where: {
                id: promoterId,
            },
        });

        const response = NextResponse.json(
            { deletePromoter },
            {
                status: 200,
            }
        );

        return response;
    } catch (error: unknown) {
        console.error("Error deleting host account:", error);
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
