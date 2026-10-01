"use server";

import type {
  OverallFirstRankState,
  OverallRankingResponse,
} from "@/app/types/mapleRankingTypes";

const NEXON_API_URL = "https://open.api.nexon.com";

function getYesterdayKst() {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  return new Date(
    Date.now() + KST_OFFSET - ONE_DAY,
  )
    .toISOString()
    .slice(0, 10);
}

export async function getOverallFirstRank(): Promise<OverallFirstRankState> {
  const apiKey = process.env.NEXON_OPEN_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "NEXON_OPEN_API_KEY가 설정되지 않았습니다.",
    };
  }

  const searchParams = new URLSearchParams({
    date: getYesterdayKst(),
    world_type: "0",
    page: "1",
  });

  try {
    const response = await fetch(
      `${NEXON_API_URL}/maplestory/v1/ranking/overall?${searchParams.toString()}`,
      {
        headers: {
          "x-nxopen-api-key": apiKey,
          Accept: "application/json",
        },

        // 랭킹을 1시간 동안 캐싱
        next: {
          revalidate: 3600,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("종합 랭킹 API 오류:", {
        status: response.status,
        body: errorText,
      });

      return {
        success: false,
        error: `종합 랭킹 조회에 실패했습니다. (${response.status})`,
      };
    }

    const data =
      (await response.json()) as OverallRankingResponse;

    // 배열에서 종합 랭킹 1위 찾기
    const firstRank =
      data.ranking.find((item) => item.ranking === 1) ??
      data.ranking[0];

    if (!firstRank) {
      return {
        success: false,
        error: "종합 랭킹 정보가 없습니다.",
      };
    }

    return {
      success: true,
      ranking: firstRank,
    };
  } catch (error) {
    console.error("종합 랭킹 연결 오류:", error);

    return {
      success: false,
      error: "넥슨 랭킹 서버에 연결하지 못했습니다.",
    };
  }
}