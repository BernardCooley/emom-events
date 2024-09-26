"use client";

import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    User,
    UserCredential,
    updateEmail,
    updatePassword,
} from "firebase/auth";
import { auth } from "./clientApp";

export const RegisterUser = async (
    email: string,
    password: string
): Promise<UserCredential | null> => {
    try {
        const user = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const ResetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const DeleteUser = async () => {
    console.log("DeleteUser");
    // try {
    //     const user = auth.currentUser;
    //     await user?.delete();

    //     if (user) {
    //         await deletePromoter({
    //             userId: user?.uid,
    //         });
    //     }
    // } catch (error) {
    //     console.error(error);
    //     throw error;
    // }
};

export const SendVerificationEmail = async (user: User) => {
    try {
        await sendEmailVerification(user);
    } catch (error) {
        throw error;
    }
};

export const UpdateUserEmail = async (email: string, user: User) => {
    try {
        await updateEmail(user, email);
    } catch (error: unknown) {
        console.error(error);
        throw error;
    }
};

export const UpdateUserPassword = async (password: string, user: User) => {
    try {
        await updatePassword(user, password);
    } catch (error: unknown) {
        console.error(error);
        throw error;
    }
};
