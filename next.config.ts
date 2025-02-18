import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pollinations.ai"], // ✅ อนุญาตโหลดภาพจาก pollinations.ai
  },
};

export default nextConfig;
