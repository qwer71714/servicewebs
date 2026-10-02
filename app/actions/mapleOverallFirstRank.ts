"use server";

import type { OverallFirstRankState } from "@/app/types/mapleRankingTypes";
import { fetchNexon } from "@/lib/nexon/client";
import { isRankingItem, isRankingResponse, isRecord } from "@/lib/nexon/validators";

function getYesterdayKst() {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return new Date(Date.now() + KST_OFFSET - ONE_DAY).toISOString().slice(0, 10);
}

export async function getOverallFirstRank(): Promise<OverallFirstRankState> {
  const result = await fetchNexon(
    "ranking/overall",
    { date: getYesterdayKst(), world_type: "0", page: "1" },
    isRankingResponse,
    3600,
  );

  if (!result.success) return result;

  const firstRank = result.data.ranking.find(
    (item) => isRecord(item) && item.ranking === 1,
  ) ?? result.data.ranking[0];

  if (!isRankingItem(firstRank)) {
    return { success: false, error: "종합 랭킹 정보가 없습니다." };
  }

  return { success: true, ranking: firstRank };
}
