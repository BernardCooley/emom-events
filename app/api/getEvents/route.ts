import prisma from "@/lib/prisma";
import { formatDateString } from "@/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { data } = await req.json();

    const date = data.dateFrom
        ? data.dateFrom
        : `${formatDateString(new Date().toISOString()).date}T00:00`;

    const dataRangeQuery = data.dateTo
        ? {
              AND: [
                  {
                      timeFrom: {
                          gte: date,
                      },
                  },
                  {
                      timeFrom: {
                          lte: data.dateTo,
                      },
                  },
              ],
          }
        : {
              timeFrom: {
                  gte: date,
              },
          };

    try {
        const event = await prisma?.event.findMany({
            skip: data.skip,
            take: data.limit,
            where: dataRangeQuery,
            select: {
                id: true,
                name: true,
                timeFrom: true,
                timeTo: true,
                description: true,
                imageIds: true,
                promoter: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                venue: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                        state: true,
                        country: true,
                        postcodeZip: true,
                    },
                },
                lineup: true,
            },
        });

        const response = NextResponse.json(event, {
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
