import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browsers ask for /favicon.ico by themselves; serve the SVG icon instead of a 404.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
};

export default nextConfig;
