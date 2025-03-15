import type { NextConfig } from "next";
import type { Header } from "next/dist/lib/load-custom-routes";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://registrasi-staging.kampunginggris.id/api/";
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`, // Hapus `/api/` ganda
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
    ],
  },
};

export default nextConfig;
