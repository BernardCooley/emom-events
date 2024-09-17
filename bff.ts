import { Promoter } from "@prisma/client";

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
}: FetchPromoterProps): Promise<Promoter | null> => {
    try {
        const promoter: Promoter | null = await fetchWithErrorHandling(
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
