import {
    deleteObject,
    getBlob,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
import { storage } from "./clientApp";
import { FirebaseImageBlob } from "@/types";
import { FirebaseError } from "firebase/app";

export const uploadFirebaseImage = async (
    folder: string,
    file: File,
    subFolder?: string
): Promise<string> => {
    const path = [folder, subFolder, file.name].join("/");
    try {
        const storageRef = ref(storage, path);

        const response = await uploadBytes(storageRef, file);
        return getDownloadURL(response.ref);
    } catch (err: unknown) {
        if (err instanceof FirebaseError) {
            throw new Error(err.message);
        }
        return "";
    }
};

export const deleteFirebaseImage = async (
    folder: string,
    name: string,
    subfolder?: string
) => {
    const path = [folder, subfolder, name].join("/");
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
            name,
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