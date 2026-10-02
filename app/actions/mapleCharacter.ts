"use server";

import type { MapleCharacterSearchState } from "@/app/types/mapleCharacterTypes";
import { getCharacterOcidByName } from "@/lib/nexon/getCharacterOcidByName";

export async function getCharacterId(
  _previousState: MapleCharacterSearchState,
  formData: FormData,
): Promise<MapleCharacterSearchState> {
  const characterName = formData.get("characterName");

  if (typeof characterName !== "string" || !characterName.trim()) {
    return { success: false, error: "캐릭터 이름을 입력해주세요." };
  }

  const normalizedName = characterName.trim();
  const result = await getCharacterOcidByName(normalizedName);

  return result.success
    ? { ...result, characterName: normalizedName }
    : result;
}
