import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    /**  ⛔️  Skip ESLint during `next build` (Vercel uses this command) */
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
