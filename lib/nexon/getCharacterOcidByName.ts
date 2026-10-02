import "server-only";

import { fetchNexon } from "./client";
import { isCharacterId } from "./validators";

type CharacterOcidResult =
  | { success: true; ocid: string }
  | { success: false; error: string };

export async function getCharacterOcidByName(
  characterName: string,
): Promise<CharacterOcidResult> {
  if (!characterName.trim()) {
    return { success: false, error: "캐릭터 이름을 입력해주세요." };
  }

  const result = await fetchNexon(
    "id",
    { character_name: characterName.trim() },
    isCharacterId,
  );

  return result.success ? { success: true, ocid: result.data.ocid } : result;
}
