import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "firebase",
    "@firebase/app",
    "@firebase/firestore",
    "@firebase/component",
    "@firebase/util",
  ],
};

export default nextConfig;
