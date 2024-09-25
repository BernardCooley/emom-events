import prisma from "@/lib/prisma";
import { EventOrderByWithRelationInput } from "@/types";
import { formatDateString } from "@/utils";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { data } = await req.json();

    const dateFrom = data.dateFrom
        ? `${data.dateFrom}T00:00`
        : `${formatDateString(new Date().toISOString()).date}T00:00`;

    // TODO returning some events past the dateTo date
    const dateTo = data.dateTo ? `${data.dateTo}T23:59` : null;

    const searchTermQuery = data.searchTerm
        ? {
              OR: [
                  {
                      name: {
                          contains: data.searchTerm,
                          mode: Prisma.QueryMode.insensitive,
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
                              mode: Prisma.QueryMode.insensitive,
                          },
                      },
                  },
                  {
                      OR: [
                          {
                              venue: {
                                  name: {
                                      contains: data.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  address: {
                                      contains: data.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  city: {
                                      contains: data.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  state: {
                                      contains: data.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  country: {
                                      contains: data.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  postcodeZip: {
                                      contains: data.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                      ],
                  },
              ],
          }
        : {};

    const dataRangeQuery = {
        AND: [
            {
                timeFrom: {
                    gte: dateFrom,
                },
            },
            dateTo
                ? {
                      timeTo: {
                          lte: dateTo,
                      },
                  }
                : {},
        ],
    };

    const getOrderBy = (orderBy: string): EventOrderByWithRelationInput => {
        switch (orderBy) {
            case "nameAsc":
                return { name: "asc" };
            case "nameDesc":
                return { name: "desc" };
            case "timeFromAsc":
                return { timeFrom: "asc" };
            case "timeFromDesc":
                return { timeFrom: "desc" };
            case "promoterAsc":
                return { promoter: { name: "asc" } };
            case "promoterDesc":
                return { promoter: { name: "desc" } };
            case "venueAsc":
                return { venue: { name: "asc" } };
            case "venueDesc":
                return { venue: { name: "desc" } };
            default:
                return { timeFrom: "asc" };
        }
    };

    const combinedQuery = {
        AND: [...(data.searchTerm ? [searchTermQuery] : []), dataRangeQuery],
    };

    try {
        const event = await prisma?.event.findMany({
            skip: data.skip,
            take: data.limit,
            where: combinedQuery,
            orderBy: getOrderBy(data.orderBy),
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
                        email: true,
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
                websites: true,
                preBookEmail: true,
            },
        });

        const response = NextResponse.json(event, {
            status: 200,
        });

        return response;
    } catch (error: any) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        console.error(error);

        return NextResponse.json(
            { error: error },
            {
                status: error.status || 500,
            }
        );
    }
}
