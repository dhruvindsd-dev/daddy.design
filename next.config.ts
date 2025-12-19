import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: "export",
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
