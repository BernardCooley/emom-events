export type Event = {
    id: string;
    promoterId: string;
    venueId: string;
    name: string;
    timeFrom: string;
    timeTo: string;
    description: string;
    websites?: Website[];
    imageIds?: string[];
    tickets?: Ticket[];
    lineup?: Lineup[];
};

export type Promoter = {
    id: string;
    name: string;
    email: string;
    city?: string;
    state?: string;
    country: string;
    websites?: Website[];
    imageIds?: string[];
    events: Event["id"][];
};

export type Venue = {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postcodeZip: string;
    events: Event["id"][];
    description?: string;
    imageIds?: string[];
};

type Website = {
    name?: string;
    url: string;
};

type Ticket = {
    name?: string;
    href: string;
    price?: number;
};

type MediaLink = {
    name?: string;
    url: string;
};

type Lineup = {
    artist: string;
    time?: string;
    website?: string;
    mediaLinks?: MediaLink[];
};

export type PromoterDetails = {
    id: string;
    name: string;
    email: string;
    city: string;
    state: string;
    country: string;
    websites: Website;
    imageId: string;
    events: string[];
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
    promoterId: string;
    venueId: string;
    title: string;
    timeFrom: string;
    timeTo: string;
    description: string;
    websites: Website;
    imageId: string;
    promoterDetails: PromoterDetails | null;
    venueDetails: VenueDetails | null;
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