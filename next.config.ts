import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/mylink" : "";

const nextConfig: NextConfig = {
  ...(isProd ? { output: "export" } : {}),
  distDir: isProd ? ".next-build" : ".next",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  transpilePackages: [
    "firebase",
    "@firebase/app",
    "@firebase/firestore",
    "@firebase/component",
    "@firebase/util",
  ],
};

export default nextConfig;
