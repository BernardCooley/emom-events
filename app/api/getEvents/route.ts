import prisma from "@/lib/prisma";
import { formatDateString } from "@/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { data } = await req.json();

    const date = data.dateFrom
        ? data.dateFrom
        : `${formatDateString(new Date().toISOString()).date}T00:00`;

    const searchTermQuery = data.searchTerm
        ? {
              OR: [
                  {
                      name: {
                          contains: data.searchTerm,
                          mode: "insensitive",
                      },
                  },
                  {
                      lineup: {
                          has: data.searchTerm,
                      },
                  },
                  {
                      promoter: {
                          name: {
                              contains: data.searchTerm,
                              mode: "insensitive",
                          },
                      },
                  },
                  {
                      OR: [
                          {
                              venue: {
                                  name: {
                                      contains: data.searchTerm,
                                      mode: "insensitive",
                                  },
                              },
                          },
                          {
                              venue: {
                                  address: {
                                      contains: data.searchTerm,
                                      mode: "insensitive",
                                  },
                              },
                          },
                          {
                              venue: {
                                  city: {
                                      contains: data.searchTerm,
                                      mode: "insensitive",
                                  },
                              },
                          },
                          {
                              venue: {
                                  state: {
                                      contains: data.searchTerm,
                                      mode: "insensitive",
                                  },
                              },
                          },
                          {
                              venue: {
                                  country: {
                                      contains: data.searchTerm,
                                      mode: "insensitive",
                                  },
                              },
                          },
                          {
                              venue: {
                                  postcodeZip: {
                                      contains: data.searchTerm,
                                      mode: "insensitive",
                                  },
                              },
                          },
                      ],
                  },
              ],
          }
        : {};

    const dataRangeQuery = {
        timeFrom: {
            gte: date,
        },
    };

    const combinedQuery = {
        AND: [...(data.searchTerm ? [searchTermQuery] : []), dataRangeQuery],
    };

    try {
        const event = await prisma?.event.findMany({
            skip: data.skip,
            take: data.limit,
            where: combinedQuery,
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
                        latitude: true,
                        longitude: true,
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
