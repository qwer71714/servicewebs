const TEST_API_KEY_PREFIXES = ["tes_", "test_"] as const;

export function isTestApiKey(apiKey: string): boolean {
  return TEST_API_KEY_PREFIXES.some((prefix) => apiKey.startsWith(prefix));
}

export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === "production";
}
