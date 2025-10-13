import type { NextConfig } from "next";
import type { Header } from "next/dist/lib/load-custom-routes";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Remove trailing slash and /api/ from the URL
    const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://registration-backend.kampunginggris.id")
      .replace(/\/api\/?$/, '') // Remove /api/ or /api from the end
      .replace(/\/$/, ''); // Remove any trailing slash
    
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  async headers(): Promise<Header[]> {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      "files.kampunginggrislc.com",
      "idn-static-assets.s3-ap-southeast-1.amazonaws.com",
      "studio.uxpincdn.com",
      "www.pngplay.com",
      "www.google.com",
    ],
  },
};

export default nextConfig;