import { PrismaClient } from "@prisma/client";

declare global {
    interface Global {
        prisma: PrismaClient;
    }
}
export {};

let prisma: PrismaClient | undefined;

if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "production") {
        prisma = new PrismaClient();
    } else {
        const globalWithPrisma = global as typeof globalThis & {
            prisma: PrismaClient;
        };
        if (!globalWithPrisma.prisma) {
            globalWithPrisma.prisma = new PrismaClient();
        }
        prisma = globalWithPrisma.prisma;
    }
}

export default prisma;
