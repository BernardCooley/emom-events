import prisma from "@/lib/prisma";
import { EventOrderByWithRelationInput, EventRequestProps } from "@/types";
import { formatDateString } from "@/utils";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { data } = await req.json();

    const d: EventRequestProps = data;

    const dateFrom = d.dateFrom
        ? `${d.dateFrom}T00:00`
        : `${formatDateString(new Date().toISOString()).date}T00:00`;

    // TODO returning some events past the dateTo date
    const dateTo = d.dateTo ? `${d.dateTo}T23:59` : null;

    const searchTermQuery = d.searchTerm
        ? {
              OR: [
                  {
                      name: {
                          contains: d.searchTerm,
                          mode: Prisma.QueryMode.insensitive,
                      },
                  },
                  {
                      lineup: {
                          has: d.searchTerm,
                      },
                  },
                  {
                      promoter: {
                          name: {
                              contains: d.searchTerm,
                              mode: Prisma.QueryMode.insensitive,
                          },
                      },
                  },
                  {
                      OR: [
                          {
                              venue: {
                                  name: {
                                      contains: d.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  address: {
                                      contains: d.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  city: {
                                      contains: d.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  state: {
                                      contains: d.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  country: {
                                      contains: d.searchTerm,
                                      mode: Prisma.QueryMode.insensitive,
                                  },
                              },
                          },
                          {
                              venue: {
                                  postcodeZip: {
                                      contains: d.searchTerm,
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
        AND: [...(d.searchTerm ? [searchTermQuery] : []), dataRangeQuery],
    };

    try {
        const event = await prisma?.event.findMany({
            skip: d.skip,
            take: d.limit ? d.limit : undefined,
            where: combinedQuery,
            orderBy: d.orderBy ? getOrderBy(d.orderBy) : { timeFrom: "asc" },
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
