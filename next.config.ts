import type { NextConfig } from "next";

if (process.env.VERCEL === "1" && !process.env.NEXON_OPEN_API_KEY?.trim()) {
  throw new Error(
    "NEXON_OPEN_API_KEY is required on Vercel. Add it to the deployment's Production or Preview environment, then redeploy.",
  );
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
