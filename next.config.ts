import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const isGhPages = isProd && !isVercel;
const basePath = isGhPages ? "/mylink" : "";

const nextConfig: NextConfig = {
  ...(isGhPages ? { output: "export" } : {}),
  distDir: isGhPages ? ".next-build" : ".next",
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
