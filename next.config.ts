import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                pathname: "/**",
            },
        ],
    },

    // Enable compression for all responses (better for crawlers)
    compress: true,

    // Add custom headers for SEO and performance
    async headers() {
        return [
            {
                source: "/sitemap.xml",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/xml; charset=utf-8",
                    },
                    {
                        key: "Cache-Control",
                        value: "public, max-age=3600, s-maxage=86400",
                    },
                ],
            },
            {
                source: "/robots.txt",
                headers: [
                    {
                        key: "Content-Type",
                        value: "text/plain",
                    },
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400",
                    },
                ],
            },
            {
                source: "/:path((?!api|_next).*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
                    },
                ],
            },
        ];
    },

    // Enable PoweredByHeader removal for security
    poweredByHeader: false,

    // Generate ETags for better caching
    generateEtags: true,

    // Enable React strict mode for development
    reactStrictMode: true,
};

export default nextConfig;