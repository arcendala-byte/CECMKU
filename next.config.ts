import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "56mb",
    },
  },
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: [
    "192.168.100.8",
    "192.168.1.159",
    "dnl9xt4p-3000.uks1.devtunnels.ms",
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arcndala.co.ke",
      },
      // Add other common domains you might use for candidate photos:
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
            {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },

    ],
  },
};

export default nextConfig;