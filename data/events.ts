import { Event, Promoter, Venue } from "@/types";

export const events = [
    {
        id: "1",
        promoterId: "101",
        venueId: "201",
        name: "Music Festival",
        timeFrom: "2023-10-01T18:00:00Z",
        timeTo: "2023-10-01T23:00:00Z",
        description: "A grand music festival featuring various artists.",
        websites: [
            {
                name: "Official Site",
                url: "https://musicfestival.com",
            },
        ],
        imageIds: ["img1", "img2"],
        tickets: [
            {
                name: "General Admission",
                href: "https://tickets.com/general",
                price: 50,
            },
            {
                name: "VIP",
                href: "https://tickets.com/vip",
                price: 100,
            },
        ],
        lineup: [],
    },
    {
        id: "2",
        promoterId: "102",
        venueId: "202",
        name: "Art Exhibition",
        timeFrom: "2023-11-15T10:00:00Z",
        timeTo: "2023-11-15T17:00:00Z",
        description: "An exhibition showcasing contemporary art.",
        websites: [
            {
                name: "Official Site",
                url: "https://artexhibition.com",
            },
        ],
        imageIds: ["img2", "img2"],
        tickets: [
            {
                name: "General Admission",
                href: "https://tickets.com/general",
                price: 50,
            },
            {
                name: "VIP",
                href: "https://tickets.com/vip",
                price: 100,
            },
        ],
    },
    {
        id: "3",
        promoterId: "103",
        venueId: "203",
        name: "Tech Conference",
        timeFrom: "2023-12-05T09:00:00Z",
        timeTo: "2023-12-05T18:00:00Z",
        description: "A conference for tech enthusiasts.",
        websites: [
            {
                name: "Official Site",
                url: "https://techconference.com",
            },
        ],
        imageIds: ["img3", "img2"],
        tickets: [
            {
                name: "General Admission",
                href: "https://tickets.com/general",
                price: 50,
            },
            {
                name: "VIP",
                href: "https://tickets.com/vip",
                price: 100,
            },
        ],
    },
    {
        id: "4",
        promoterId: "104",
        venueId: "204",
        name: "Food Festival",
        timeFrom: "2023-09-20T11:00:00Z",
        timeTo: "2023-09-20T20:00:00Z",
        description: "A festival celebrating diverse cuisines.",
        websites: [
            {
                name: "Official Site",
                url: "https://foodfestival.com",
            },
        ],
        imageIds: ["img4", "img2"],
        tickets: [
            {
                name: "General Admission",
                href: "https://tickets.com/general",
                price: 50,
            },
            {
                name: "VIP",
                href: "https://tickets.com/vip",
                price: 100,
            },
        ],
    },
    {
        id: "5",
        promoterId: "105",
        venueId: "205",
        name: "Film Screening",
        timeFrom: "2023-08-10T19:00:00Z",
        timeTo: "2023-08-10T22:00:00Z",
        description: "A screening of an award-winning film.",
        websites: [
            {
                name: "Official Site",
                url: "https://filmscreening.com",
            },
        ],
        imageIds: ["img5", "img2"],
        tickets: [
            {
                name: "General Admission",
                href: "https://tickets.com/general",
                price: 50,
            },
            {
                name: "VIP",
                href: "https://tickets.com/vip",
                price: 100,
            },
        ],
    },
] satisfies Event[];

export const promoters = [
    {
        id: "101",
        name: "John Doe",
        email: "john.doe@example.com",
        city: "New York",
        state: "NY",
        country: "USA",
        websites: [
            {
                name: "John's Promotions",
                url: "https://johnspromotions.com",
            },
        ],
        imageIds: ["img3", "img1"],
        events: ["1"],
    },
    {
        id: "102",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        websites: [
            {
                name: "Jane's Events",
                url: "https://janesevents.com",
            },
        ],
        imageIds: ["img4", "img1"],
        events: ["2"],
    },
    {
        id: "103",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        websites: [
            {
                name: "Alice's Tech",
                url: "https://alicestech.com",
            },
        ],
        imageIds: ["img5", "img1"],
        events: ["3"],
    },
    {
        id: "104",
        name: "Bob Brown",
        email: "bob.brown@example.com",
        city: "Chicago",
        state: "IL",
        country: "USA",
        websites: [
            {
                name: "Bob's Food Fest",
                url: "https://bobsfoodfest.com",
            },
        ],
        imageIds: ["img6", "img1"],
        events: ["4"],
    },
    {
        id: "105",
        name: "Charlie Davis",
        email: "charlie.davis@example.com",
        city: "Austin",
        state: "TX",
        country: "USA",
        websites: [
            {
                name: "Charlie's Films",
                url: "https://charliesfilms.com",
            },
        ],
        imageIds: ["img7", "img1"],
        events: ["5"],
    },
] satisfies Promoter[];

export const venues = [
    {
        id: "201",
        name: "Central Park",
        address: "123 Park Ave",
        city: "New York",
        state: "NY",
        country: "USA",
        postcodeZip: "10001",
        events: ["1"],
        description: "A large park in the heart of New York City.",
        imageIds: ["img2", "img1"],
    },
    {
        id: "202",
        name: "Art Gallery",
        address: "456 Art St",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        postcodeZip: "90001",
        events: ["2"],
        description: "A gallery showcasing contemporary art.",
        imageIds: ["img3", "img1"],
    },
    {
        id: "203",
        name: "Tech Hub",
        address: "789 Tech Blvd",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        postcodeZip: "94103",
        events: ["3"],
        description: "A hub for tech enthusiasts.",
        imageIds: ["img4", "img1"],
    },
    {
        id: "204",
        name: "Food Plaza",
        address: "321 Food Ln",
        city: "Chicago",
        state: "IL",
        country: "USA",
        postcodeZip: "60601",
        events: ["4"],
        description: "A plaza with diverse cuisines.",
        imageIds: ["img5", "img1"],
    },
    {
        id: "205",
        name: "Cinema Hall",
        address: "654 Film Rd",
        city: "Austin",
        state: "TX",
        country: "USA",
        postcodeZip: "73301",
        events: ["5"],
        description: "A hall for film screenings.",
        imageIds: ["img6", "img1"],
    },
] satisfies Venue[];
