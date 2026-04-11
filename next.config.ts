import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pptxgenjs"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
