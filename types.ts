import { Event, Promoter, Venue } from "@prisma/client";

export type PromoterDetails = {
    id: Promoter["id"];
    name: Promoter["name"];
    email: Promoter["email"];
    city: Promoter["city"];
    state: Promoter["state"];
    country: Promoter["country"];
    websites: Promoter["websites"];
    imageIds: Promoter["imageIds"];
    events: EventDetails[];
    showEmail: Promoter["showEmail"];
};

export type VenueDetails = {
    id: Venue["id"];
    name: Venue["name"];
    address: Venue["address"];
    city: Venue["city"];
    state: Venue["state"];
    country: Venue["country"];
    postcodeZip: Venue["postcodeZip"];
    events: EventDetails[];
};

export type EventDetails = {
    id: Event["id"];
    name: Event["name"];
    timeFrom: Event["timeFrom"];
    timeTo?: Event["timeTo"];
    description: Event["description"];
    imageIds: Event["imageIds"];
    promoter: {
        id: Promoter["id"];
        name: Promoter["name"];
        email: Promoter["email"];
    };
    venue: VenueItem;
    lineup?: Event["lineup"];
    websites?: Event["websites"];
    venueId?: Event["venueId"];
    preBookEmail: Event["preBookEmail"];
};

export type FirebaseImageBlob = {
    blob: Blob;
    name: string;
};

export type SelectOption = {
    value: string;
    label: string;
    icon?: JSX.Element;
};

export type VenueItem = {
    id: Venue["id"];
    name: Venue["name"];
    address: Venue["address"];
    city: Venue["city"];
    state: Venue["state"];
    country: Venue["country"];
    postcodeZip: Venue["postcodeZip"];
    latitude: Venue["latitude"];
    longitude: Venue["longitude"];
};

export type UpdatePromoterInput = {
    name?: Promoter["name"];
    city?: Promoter["city"];
    state?: Promoter["state"];
    country?: Promoter["country"];
    websites?: Promoter["websites"];
    imageIds?: Promoter["imageIds"];
    showEmail?: Promoter["showEmail"];
    email?: Promoter["email"];
};

export type AddPromoterInput = {
    name: Promoter["name"];
    email: Promoter["email"];
    city: Promoter["city"];
    state: Promoter["state"];
    country: Promoter["country"];
    websites: Promoter["websites"];
    imageIds: Promoter["imageIds"];
    showEmail: Promoter["showEmail"];
};

export type UpdateEventInput = {
    name: EventDetails["name"];
    timeFrom: EventDetails["timeFrom"];
    timeTo?: EventDetails["timeTo"];
    description: EventDetails["description"];
    imageIds: EventDetails["imageIds"];
    lineup?: EventDetails["lineup"];
    venueId?: EventDetails["venueId"];
    websites?: EventDetails["websites"];
    preBookEmail?: EventDetails["preBookEmail"];
};

export type AddEventInput = {
    promoterId: string;
    venueId: string;
    name: Event["name"];
    timeFrom: Event["timeFrom"];
    timeTo: Event["timeTo"];
    description: Event["description"];
    websites: Event["websites"];
    imageIds: Event["imageIds"];
    tickets: Event["tickets"];
    lineup: Event["lineup"];
    preBookEmail: Event["preBookEmail"];
};

export type AddVenueInput = {
    name: Venue["name"];
    address: Venue["address"];
    city: Venue["city"];
    state: Venue["state"];
    country: Venue["country"];
    postcodeZip: Venue["postcodeZip"];
    links?: Venue["links"];
    latitude: Venue["latitude"];
    longitude: Venue["longitude"];
};

export type Dimensions = {
    width: number;
    height: number;
};

export type EventRequestProps = {
    skip: number;
    limit: number | null;
    dateFrom: string | null;
    dateTo: string | null;
    orderBy: string | null;
    searchTerm: string | null;
};

export type EventOrderByWithRelationInput = {
    name?: "asc" | "desc";
    timeFrom?: "asc" | "desc";
    promoter?: {
        name?: "asc" | "desc";
    };
    venue?: {
        name?: "asc" | "desc";
    };
};