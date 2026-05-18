import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Output "standalone" produces a minimal server in .next/standalone/,
  // which is ideal for Combell Node.js hosting: you can upload just
  // .next/standalone/ + .next/static/ + public/ and run `node server.js`.
  // Include KB HTML so the ai-for-marketeers route can read it at runtime
  // (see also content/ai-for-marketeers/index.html).
  outputFileTracingIncludes: {
    "/ai-for-marketeers": ["./content/ai-for-marketeers/index.html"],
  },
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
      {
        source: "/ai-for-marketeers/index.html",
        destination: "/ai-for-marketeers",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
