import { v4 as uuidv4 } from "uuid";
import { deleteFirebaseImage, uploadFirebaseImage } from "./firebase/functions";
import { Dimensions, FirebaseImageBlob } from "./types";

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

export const getUrlFromBlob = (blob: FirebaseImageBlob): string => {
    return URL.createObjectURL(new File([blob.blob], blob.name));
};

export const getImageDimensions = (
    file: File,
    callback: (dimensions: { width: number; height: number }) => void
) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = function () {
        callback({ width: img.width, height: img.height });
        URL.revokeObjectURL(objectUrl); // Clean up the object URL
    };

    img.src = objectUrl;
};

type HandleImageUploadProps = {
    fileSizeLimit: number;
    dimensions: Dimensions;
    file: File;
    onError: (errorMessage: string) => void;
    onSuccess: () => void;
};

export const dataURItoBlob = (dataURI: string) => {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    var blob = new Blob([ab], { type: mimeString });
    return blob;
};

export const convertBytesToMbs = (bytes: number) => {
    return Number((bytes / 1024 / 1024).toFixed(0));
};

export const handleProfileImageChange = async (
    folder: string,
    id: string,
    newImage?: FirebaseImageBlob | null,
    existingImage?: FirebaseImageBlob | null
): Promise<string[]> => {
    if (!newImage) return [];

    if (!existingImage) {
        await uploadFirebaseImage(
            folder,
            new File([newImage.blob], newImage.name),
            id
        );
        return [newImage.name];
    }

    if (existingImage.name === newImage.name) return [existingImage.name];

    if (existingImage.name !== newImage.name) {
        await uploadFirebaseImage(
            folder,
            new File([newImage.blob], newImage.name),
            id
        );
        await deleteFirebaseImage(folder, existingImage.name, id);
        return [newImage.name];
    }

    return [];
};

export const generateRandomEvent = () => {
    const randomString = () => Math.random().toString(36).substring(2, 15);
    const randomDate = () =>
        new Date(Date.now() + Math.random() * 1e10).toISOString();

    return {
        id: uuidv4(),
        name: randomString(),
        timeFrom: randomDate(),
        timeTo: "",
        description: randomString(),
        imageIds: [
            `DALL·E ${new Date().getFullYear()}-${String(
                Math.floor(Math.random() * 12) + 1
            ).padStart(2, "0")}-${String(
                Math.floor(Math.random() * 31) + 1
            ).padStart(2, "0")} ${String(
                Math.floor(Math.random() * 24)
            ).padStart(2, "0")}.${String(
                Math.floor(Math.random() * 60)
            ).padStart(2, "0")}.${String(
                Math.floor(Math.random() * 60)
            ).padStart(2, "0")} - Abstract image.png`,
        ],
        promoter: {
            id: "bernardcooley@gmail.com",
            name: `Pulsewave ${randomString()}`,
        },
        venue: {
            id: uuidv4(),
            name: randomString(),
            address: `${Math.floor(
                Math.random() * 100
            )} ${randomString()} Street`,
            city: randomString(),
            state: randomString(),
            country: randomString(),
            postcodeZip: `${Math.floor(Math.random() * 10000)}`,
        },
        lineup: [randomString()],
    };
};


export const formatDateString = (
    input: string
): {
    dateTime: string;
    date: string;
    time: string;
    year: string;
    month: string;
    day: string;
    hours: string;
    minutes: string;
} => {
    const date = new Date(input);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return {
        dateTime: `${year}-${month}-${day}T${hours}:${minutes}`,
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
        year: year.toString(),
        month,
        day,
        hours,
        minutes,
    };
};