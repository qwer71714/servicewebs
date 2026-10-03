"use server";

import type { MapleCharacterSearchState } from "@/app/types/mapleCharacterTypes";
import { getCharacterOcidByName } from "@/lib/nexon/getCharacterOcidByName";
import { isMapleWorld } from "@/lib/nexon/worlds";

export async function getCharacterId(
  _previousState: MapleCharacterSearchState,
  formData: FormData,
): Promise<MapleCharacterSearchState> {
  const characterName = formData.get("characterName");
  const worldName = formData.get("worldName");

  if (typeof characterName !== "string" || !characterName.trim()) {
    return { success: false, error: "캐릭터 이름을 입력해주세요." };
  }

  if (worldName !== null && worldName !== "" && !isMapleWorld(worldName)) {
    return { success: false, error: "올바른 월드를 선택해주세요." };
  }

  const normalizedName = characterName.trim();
  const result = await getCharacterOcidByName(normalizedName);

  return result.success
    ? {
        ...result,
        characterName: normalizedName,
        ...(isMapleWorld(worldName) ? { worldName } : {}),
      }
    : result;
}
