"use client";

import { getCharacterId } from "@/app/actions/mapleCharacter";
import type { MapleCharacterSearchState } from "@/app/types/mapleCharacterTypes";

// Keep this catch on the client so it also handles Server Action transport failures.
export async function searchCharacter(
  previousState: MapleCharacterSearchState,
  formData: FormData,
): Promise<MapleCharacterSearchState> {
  try {
    return await getCharacterId(previousState, formData);
  } catch {
    return {
      success: false,
      error: "검색 요청을 보내지 못했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
