import "server-only";

export type NexonResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function fetchNexon<T>(
  path: string,
  params: Record<string, string>,
  validate: (data: unknown) => data is T,
  revalidate?: number,
): Promise<NexonResult<T>> {
  const apiKey = process.env.NEXON_OPEN_API_KEY?.trim();

  if (!apiKey) {
    console.error("NEXON_OPEN_API_KEY is not configured.");
    return {
      success: false,
      error: "조회 서비스가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  try {
    const response = await fetch(
      `https://open.api.nexon.com/maplestory/v1/${path}?${new URLSearchParams(params)}`,
      {
        headers: {
          "x-nxopen-api-key": apiKey,
          Accept: "application/json",
        },
        // Bound both the connection and response body read in serverless requests.
        signal: AbortSignal.timeout(10_000),
        ...(revalidate === undefined
          ? { cache: "no-store" as const }
          : { next: { revalidate } }),
      },
    );

    if (!response.ok) {
      console.error("Nexon API request failed:", { path, status: response.status });
      return {
        success: false,
        error: response.status === 429
          ? "조회 요청이 많습니다. 잠시 후 다시 시도해주세요."
          : `정보 조회에 실패했습니다. (${response.status})`,
      };
    }

    const data: unknown = await response.json();

    if (!validate(data)) {
      console.error("Unexpected Nexon API response:", { path });
      return {
        success: false,
        error: "조회 정보가 올바르지 않습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    return { success: true, data };
  } catch (error) {
    // Avoid logging request headers or the API key through nested fetch errors.
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error("Nexon API connection failed:", { path, errorName });
    return {
      success: false,
      error: errorName === "TimeoutError" || errorName === "AbortError"
        ? "조회 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
        : "넥슨 API 서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
