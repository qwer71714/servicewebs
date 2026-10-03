import type { NextConfig } from "next";

import { isTestApiKey } from "./lib/nexon/apiKey";

const apiKey = process.env.NEXON_OPEN_API_KEY?.trim();

if (process.env.VERCEL === "1" && !apiKey) {
  throw new Error(
    "NEXON_OPEN_API_KEY is required on Vercel. Add it to the deployment's Production or Preview environment, then redeploy.",
  );
}

if (process.env.VERCEL_ENV === "production" && apiKey && isTestApiKey(apiKey)) {
  throw new Error(
    "A test-prefixed NEXON_OPEN_API_KEY cannot be deployed to Vercel Production. Configure a production Nexon Open API key, then redeploy.",
  );
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
