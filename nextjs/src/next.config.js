/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: {
        config: {
            watchOptions: {
                polling: 1000,
                ignored: /node_modules/,
            },
        },
    },
};

module.exports = nextConfig;
