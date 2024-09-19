export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};


export const getAddress = (
    place: any
): {
    address: string;
    city: string;
    state: string;
    country: string;
    postcodeZip: string;
} => {
    const getLocationComponent = (place: any[], type: string) => {
        return place.find((item) => item.types.includes(type))?.long_name;
    };

    const fullAddress = {
        address: "",
        city: "",
        state: "",
        country: "",
        postcodeZip: "",
    };

    const streetNumber = getLocationComponent(
        place.address_components,
        "street_number"
    );
    const streetAddress = getLocationComponent(
        place.address_components,
        "route"
    );
    if (streetNumber || streetAddress)
        fullAddress.address = `${[streetNumber, streetAddress].join(" ")}`;

    const city = getLocationComponent(place.address_components, "postal_town");
    const cityLocality = getLocationComponent(
        place.address_components,
        "locality"
    );
    if (city) {
        fullAddress.city = city;
    } else {
        if (cityLocality) fullAddress.city = cityLocality;
    }

    const state = getLocationComponent(
        place.address_components,
        "administrative_area_level_1"
    );
    if (state) fullAddress.state = state;

    const country = getLocationComponent(place.address_components, "country");
    if (country) fullAddress.country = country;

    const postcodeZip = getLocationComponent(
        place.address_components,
        "postal_code"
    );
    if (postcodeZip) fullAddress.postcodeZip = postcodeZip;

    return fullAddress;
};

export const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
};