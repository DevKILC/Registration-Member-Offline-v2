import type { NextConfig } from "next";
import type { Header } from "next/dist/lib/load-custom-routes";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  async headers(): Promise<Header[]> {
    // Pastikan NEXT_PUBLIC_API_URL ada, jika tidak gunakan fallback
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
          }
        ]
      }
    ];
  },
  images: {
    domains: ["files.kampunginggrislc.com", "idn-static-assets.s3-ap-southeast-1.amazonaws.com", "www.pngplay.com"], // Combined domains
  },
};


export default nextConfig;
