import {
    deleteObject,
    getBlob,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
import { storage } from "./clientApp";
import { FirebaseImageBlob } from "@/types";

export const uploadFirebaseImage = async (
    folder: string,
    file: File,
    subFolder?: string
): Promise<string> => {
    const path = `${folder}/${subFolder || ""}/${file.name}`;
    try {
        const storageRef = ref(storage, path);

        const response = await uploadBytes(storageRef, file);
        return getDownloadURL(response.ref);
    } catch (err: any) {
        return err;
    }
};

export const deleteFirebaseImage = async (
    folder: string,
    name: string,
    email: string
) => {
    const path = `${folder}/${email}/${name}`;
    const pathReference = ref(storage, path);

    try {
        await deleteObject(pathReference);
    } catch (err) {}
};

export const getFirebaseImageBlob = async (
    path: string,
    name: string
): Promise<FirebaseImageBlob | undefined> => {
    const pathReference = ref(storage, path);

    try {
        const blob = await getBlob(pathReference);
        return {
            blob,
            name: `${name}`,
        };
    } catch (err) {
        return undefined;
    }
};

export const getFirebaseImageURL = async (
    path: string
): Promise<string | undefined> => {
    const pathReference = ref(storage, path);

    try {
        const url = await getDownloadURL(pathReference);
        return url;
    } catch (err) {
        return undefined;
    }
};