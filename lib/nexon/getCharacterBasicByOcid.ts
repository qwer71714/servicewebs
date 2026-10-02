import "server-only";

import { fetchNexon } from "./client";
import { isCharacterBasic } from "./validators";

export async function getCharacterBasicByOcid(ocid: string) {
  if (!ocid.trim()) {
    return { success: false as const, error: "OCID가 없습니다." };
  }

  return fetchNexon(
    "character/basic",
    { ocid: ocid.trim() },
    isCharacterBasic,
  );
}
