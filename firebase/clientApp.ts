import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./credentials";
import { EmailAuthProvider, getAuth } from "firebase/auth";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const storage = getStorage(app);
const provider = new EmailAuthProvider();
const auth = getAuth(app);

export { storage, provider, auth };