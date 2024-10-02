/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["firebasestorage.googleapis.com"],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/events",
                permanent: true,
            },
        ];
    },
};
export default nextConfig;
