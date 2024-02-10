/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_COVALENT_API_KEY: process.env.NEXT_COVALENT_API_KEY,
        NEXT_PUBLIC_ETHPLORER_API_KEY: process.env.NEXT_ETHPLORER_API_KEY,
        NEXT_PUBLIC_BLOCKCHAIR_API_KEY: process.env.NEXT_BLOCKCHAIR_API_KEY,
    },
    // Include any other Next.js config options you need
};

export default nextConfig;
