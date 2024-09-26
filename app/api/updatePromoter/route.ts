import prisma from "@/lib/prisma";
import { UpdatePromoterInput } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { id, promoter } = await req.json();

    const i: string = id;
    const p: UpdatePromoterInput = promoter;

    try {
        const newPromoter = await prisma?.promoter.update({
            where: {
                id: i,
            },
            data: p,
        });

        const response = NextResponse.json(newPromoter, {
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
