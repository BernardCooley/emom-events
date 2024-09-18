import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./credentials";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const storage = getStorage(app);
