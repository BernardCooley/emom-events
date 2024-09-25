import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Promoter } from "@prisma/client";
import { CustomError } from "@/types";

export async function POST(req: Request) {
    const { data } = await req.json();

    const d: Promoter = data;

    try {
        await prisma?.promoter.create({
            data: {
                name: d.name,
                city: d.city,
                state: d.state,
                country: d.country,
                email: d.email,
                imageIds: d.imageIds,
                showEmail: d.showEmail,
            },
        });

        const response = NextResponse.json(
            {},
            {
                status: 200,
            }
        );

        return response;
    } catch (error: unknown) {
        console.error("Error creating event:", error);
        if (error instanceof CustomError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status || 500 }
            );
        } else {
            return NextResponse.json(
                { error: "An unknown error occurred" },
                { status: 500 }
            );
        }
    }
}
