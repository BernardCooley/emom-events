import { Event, Promoter, Venue } from "@prisma/client";
import {
    AddEventInput,
    AddPromoterInput,
    AddVenueInput,
    EventDetails,
    EventRequestProps,
    PromoterDetails,
    UpdateEventInput,
    UpdatePromoterInput,
    VenueDetails,
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

type FetchPromoterPropsByEmail = {
    email: string;
};

export const fetchPromoterByEmail = async ({
    email,
}: FetchPromoterPropsByEmail): Promise<PromoterDetails | null> => {
    try {
        const promoter: PromoterDetails | null = await fetchWithErrorHandling(
            "/api/getPromoterByEmail",
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

type FetchPromoterPropsById = {
    id: string;
};

export const fetchPromoterById = async ({
    id,
}: FetchPromoterPropsById): Promise<PromoterDetails | null> => {
    try {
        const promoter: PromoterDetails | null = await fetchWithErrorHandling(
            "/api/getPromoterById",
            "POST",
            {
                id,
            }
        );
        return promoter;
    } catch (error) {
        throw error;
    }
};

type AddPromoterProps = {
    data: AddPromoterInput;
};

type GetVenueProps = {
    id: string;
};

export const fetchVenue = async ({
    id,
}: GetVenueProps): Promise<VenueDetails | null> => {
    try {
        const venue: VenueDetails | null = await fetchWithErrorHandling(
            "/api/getVenue",
            "POST",
            {
                id,
            }
        );

        return venue;
    } catch (error) {
        throw error;
    }
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
    data: UpdatePromoterInput;
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
    searchTerm: string;
};

export const searchVenue = async ({
    searchTerm,
}: SearchVenueProps): Promise<VenueItem[] | null> => {
    try {
        const venue: VenueItem[] | null = await fetchWithErrorHandling(
            "/api/searchVenue",
            "POST",
            {
                searchTerm,
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

type DeletePromoterProps = {
    promoterId: string;
};

export const deletePromoter = async ({
    promoterId,
}: DeletePromoterProps): Promise<Promoter | null> => {
    try {
        const deletePromoter: Promoter | null = await fetchWithErrorHandling(
            "/api/deletePromoter",
            "POST",
            {
                promoterId,
            }
        );

        return deletePromoter;
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
    data?: EventRequestProps | null;
};

export const fetchEvents = async ({
    data,
}: FetchEventsProps): Promise<EventDetails[] | null> => {
    try {
        const events: EventDetails[] | null = await fetchWithErrorHandling(
            "/api/getEvents",
            "POST",
            { data }
        );

        return events;
    } catch (error) {
        throw error;
    }
};

type UpdateEventProps = {
    id: string;
    data: UpdateEventInput;
};

export const updateEvent = async ({
    id,
    data,
}: UpdateEventProps): Promise<EventDetails | null> => {
    try {
        const updatedEvent: EventDetails | null = await fetchWithErrorHandling(
            "/api/updateEvent",
            "POST",
            {
                id,
                data,
            }
        );

        return updatedEvent;
    } catch (error) {
        throw error;
    }
};