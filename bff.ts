import { Event, Promoter, Venue } from "@prisma/client";
import {
    AddEventInput,
    AddVenueInput,
    EventDetails,
    EventRequestProps,
    PromoterDetails,
    VenueItem,
} from "./types";

export class GoneError extends Error {
    statusCode = 410;
}
export class NotFoundError extends Error {
    statusCode = 404;
}
export class BadRequestError extends Error {
    statusCode = 400;
}
export class UnauthorisedError extends Error {
    statusCode = 401;
}
export class InternalError extends Error {
    statusCode = 500;
}

export const handleFetchErrors = (response: Response) => {
    switch (response.status) {
        case 401:
            throw new UnauthorisedError(response.statusText);
        case 400:
            throw new BadRequestError(response.statusText);
        case 404:
            throw new NotFoundError(response.statusText);
        case 410:
            throw new GoneError(response.statusText);
        default:
            null;
    }
};

export const fetchWithErrorHandling = async <T>(
    endpoint: RequestInfo,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    body?: object
) => {
    try {
        const res = await fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            return (await res.json()) as T;
        }
        handleFetchErrors(res);
    } catch (e) {
        throw e;
    }
    return null;
};

type FetchPromoterProps = {
    email: string;
};

export const fetchPromoter = async ({
    email,
}: FetchPromoterProps): Promise<PromoterDetails | null> => {
    try {
        const promoter: PromoterDetails | null = await fetchWithErrorHandling(
            "/api/getPromoter",
            "POST",
            {
                email,
            }
        );
        return promoter;
    } catch (error) {
        throw error;
    }
};

type AddPromoterProps = {
    data: Promoter;
};

export const addPromoter = async ({
    data,
}: AddPromoterProps): Promise<Promoter | null> => {
    try {
        const newPromoter: Promoter | null = await fetchWithErrorHandling(
            "/api/addPromoter",
            "POST",
            {
                data,
            }
        );

        return newPromoter;
    } catch (error) {
        throw error;
    }
};

type UpdatePromoterProps = {
    id: string;
    data: {
        name?: Promoter["name"];
        city?: Promoter["city"];
        state?: Promoter["state"];
        country?: Promoter["country"];
        websites?: Promoter["websites"];
        imageIds?: Promoter["imageIds"];
    };
};

export const updatePromoter = async ({
    id,
    data,
}: UpdatePromoterProps): Promise<Promoter | null> => {
    try {
        const updatedPromoter: Promoter | null = await fetchWithErrorHandling(
            "/api/updatePromoter",
            "POST",
            {
                id,
                data,
            }
        );

        return updatedPromoter;
    } catch (error) {
        throw error;
    }
};

type SearchVenueProps = {
    name: string;
};

export const searchVenue = async ({
    name,
}: SearchVenueProps): Promise<VenueItem[] | null> => {
    try {
        const venue: VenueItem[] | null = await fetchWithErrorHandling(
            "/api/searchVenue",
            "POST",
            {
                name,
            }
        );

        return venue;
    } catch (error) {
        throw error;
    }
};

type AddEventProps = {
    data: AddEventInput;
};

export const addEvent = async ({
    data,
}: AddEventProps): Promise<Event | null> => {
    try {
        const event: Event | null = await fetchWithErrorHandling(
            "/api/addEvent",
            "POST",
            {
                data,
            }
        );

        return event;
    } catch (error) {
        throw error;
    }
};

type AddVenueProps = {
    data: AddVenueInput;
};

export const addVenue = async ({
    data,
}: AddVenueProps): Promise<Venue | null> => {
    try {
        const venue: Venue | null = await fetchWithErrorHandling(
            "/api/addVenue",
            "POST",
            {
                data,
            }
        );

        return venue;
    } catch (error) {
        throw error;
    }
};

type DeleteVenueProps = {
    venueId: string;
};

export const deleteVenue = async ({
    venueId,
}: DeleteVenueProps): Promise<Venue | null> => {
    try {
        const deleteVenue: Venue | null = await fetchWithErrorHandling(
            "/api/deleteVenue",
            "POST",
            {
                venueId,
            }
        );

        return deleteVenue;
    } catch (error) {
        throw error;
    }
};

type FetchEventProps = {
    eventId: string;
};

export const fetchEvent = async ({
    eventId,
}: FetchEventProps): Promise<EventDetails | null> => {
    try {
        const event: EventDetails | null = await fetchWithErrorHandling(
            "/api/getEvent",
            "POST",
            {
                eventId,
            }
        );

        return event;
    } catch (error) {
        throw error;
    }
};

type FetchEventsProps = {
    data?: EventRequestProps | {};
};

export const fetchEvents = async ({
    data,
}: FetchEventsProps): Promise<EventDetails[] | null> => {
    try {
        const events: EventDetails[] | null = await fetchWithErrorHandling(
            "/api/getEvents",
            "POST",
            { data: data }
        );

        return events;
    } catch (error) {
        throw error;
    }
};

type UpdateEventProps = {
    id: string;
    event: {
        name: EventDetails["name"];
        timeFrom: EventDetails["timeFrom"];
        timeTo?: EventDetails["timeTo"];
        description: EventDetails["description"];
        imageIds: EventDetails["imageIds"];
        lineup?: EventDetails["lineup"];
    };
    venue: {
        name: VenueItem["name"];
        address: VenueItem["address"];
        city: VenueItem["city"];
        state: VenueItem["state"];
        country: VenueItem["country"];
        postcodeZip: VenueItem["postcodeZip"];
    };
};

export const updateEvent = async ({
    id,
    event,
    venue,
}: UpdateEventProps): Promise<EventDetails | null> => {
    try {
        const updatedEvent: EventDetails | null = await fetchWithErrorHandling(
            "/api/updateEvent",
            "POST",
            {
                id,
                event,
                venue,
            }
        );

        return updatedEvent;
    } catch (error) {
        throw error;
    }
};