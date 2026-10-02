import "server-only";

import type {
  MapleCharacterIdResponse,
} from "@/app/types/mapleCharacterTypes";

const NEXON_API_URL = "https://open.api.nexon.com";

type CharacterOcidResult =
  | {
    success: true;
    ocid: string;
  }
  | {
    success: false;
    error: string;
  };

export async function getCharacterOcidByName(
  characterName: string,
): Promise<CharacterOcidResult> {
  const apiKey = process.env.NEXON_OPEN_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "API 키가 설정되지 않았습니다.",
    };
  }

  const searchParams = new URLSearchParams({
    character_name: characterName.trim(),
  });

  try {
    const response = await fetch(
      `${NEXON_API_URL}/maplestory/v1/id?${searchParams.toString()}`,
      {
        headers: {
          "x-nxopen-api-key": apiKey,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "캐릭터를 찾을 수 없습니다.",
      };
    }

    const data =
      (await response.json()) as MapleCharacterIdResponse;

    if (!data.ocid) {
      return {
        success: false,
        error: "캐릭터 OCID를 찾지 못했습니다.",
      };
    }

    return {
      success: true,
      ocid: data.ocid,
    };
  } catch (error) {
    console.error("OCID 조회 오류:", error);

    return {
      success: false,
      error: "넥슨 API 서버에 연결하지 못했습니다.",
    };
  }
}