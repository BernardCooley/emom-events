export type PromoterDetails = {
    id: string;
    name: string;
    email: string;
    city: string;
    state: string;
    country: string;
    websites: string[];
    imageIds: string[];
    events: EventDetails[];
};

export type VenueDetails = {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postcodeZip: string;
    events: string[];
};

export type EventDetails = {
    id: string;
    name: string;
    timeFrom: string;
    timeTo?: string;
    description: string;
    imageIds: string;
    promoter: {
        id: string;
        name: string;
    };
    venue: {
        id: string;
        name: string;
        city: string;
        country: string;
    };
    lineup?: string[];
};

export type FirebaseImageBlob = {
    blob: Blob;
    name: string;
};

export type SelectOption = {
    value: string;
    label: string;
};

export type VenueItem = {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postcodeZip: string;
};

export type AddEventInput = {
    promoterId: string;
    venueId: string;
    name: string;
    timeFrom: string;
    timeTo: string;
    description: string;
    websites: string[];
    imageIds: string[];
    tickets: string[];
    lineup: string[];
};

export type AddVenueInput = {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postcodeZip: string;
    description?: string;
    links?: string[];
};
