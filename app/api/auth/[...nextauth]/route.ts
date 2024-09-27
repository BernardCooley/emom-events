import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import FacebookProvider from "next-auth/providers/facebook";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Email",
                    type: "text",
                    placeholder: "",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                let user: User | null = null;

                if (credentials?.username && credentials?.password) {
                    const firebaseUser = await signInWithEmailAndPassword(
                        auth,
                        credentials.username,
                        credentials.password
                    );

                    if (firebaseUser) {
                        user = {
                            id: firebaseUser.user.uid,
                            name: firebaseUser.user.displayName || "",
                            email: firebaseUser.user.email || "",
                        };
                    }
                }
                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
