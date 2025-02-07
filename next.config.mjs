/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    experimental: {
        serverActions: {
            allowedOrigins: process.env.NODE_ENV === 'development' ? [
                'localhost:3000', // localhost
                'silver-sniffle-rx6wpjvrw4j257wq-3000.app.github.dev', // Codespaces
            ] : [],
        },
    },
    async headers() {
        if (process.env.NODE_ENV === 'development') {
            return [
                {
                    source: "/(.*)",
                    headers: [
                        {
                            key: "Access-Control-Allow-Origin",
                            value: "*", // Or specify the exact origin instead of "*"
                        },
                        {
                            key: "Access-Control-Allow-Headers",
                            value: "X-Requested-With, Content-Type, X-Forwarded-Host",
                        },
                    ],
                },
            ];
        }
        return [];
    },
};

export default nextConfig;
