import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./clientApp";

export const uploadFirebaseImage = async (
    folder: string,
    file: File,
    userId?: string
): Promise<string> => {
    const path = `${folder}/${userId || ""}/${file.name}`;
    try {
        const storageRef = ref(storage, path);

        const response = await uploadBytes(storageRef, file);
        return getDownloadURL(response.ref);
    } catch (err: any) {
        return err;
    }
};
