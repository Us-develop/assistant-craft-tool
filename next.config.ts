import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Output "standalone" produces a minimal server in .next/standalone/,
  // which is ideal for Combell Node.js hosting: you can upload just
  // .next/standalone/ + .next/static/ + public/ and run `node server.js`.
  output: "standalone",
  poweredByHeader: false,
  logging: {
    fetches: { fullUrl: false },
  },
  async redirects() {
    return [
      {
        source: "/ai-for-marketeers/",
        destination: "/ai-for-marketeers",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
