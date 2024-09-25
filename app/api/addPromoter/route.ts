import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Promoter } from "@prisma/client";


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
