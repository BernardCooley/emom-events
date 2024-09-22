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
    };
    venue: VenueItem;
    lineup?: Event["lineup"];
    websites?: Event["websites"];
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
};

export type AddVenueInput = {
    name: Venue["name"];
    address: Venue["address"];
    city: Venue["city"];
    state: Venue["state"];
    country: Venue["country"];
    postcodeZip: Venue["postcodeZip"];
    links?: Venue["links"];
};

export type Dimensions = {
    width: number;
    height: number;
};