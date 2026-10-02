import "server-only";

import type {
  MapleCharacterBasicResponse,
} from "@/app/types/mapleCharacterTypes";

const NEXON_API_URL = "https://open.api.nexon.com";

type CharacterBasicResult =
  | {
    success: true;
    data: MapleCharacterBasicResponse;
  }
  | {
    success: false;
    error: string;
  };

export async function getCharacterBasicByOcid(
  ocid: string,
): Promise<CharacterBasicResult> {
  if (!ocid.trim()) {
    return {
      success: false,
      error: "OCID가 없습니다.",
    };
  }

  const apiKey = process.env.NEXON_OPEN_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "NEXON_OPEN_API_KEY가 설정되지 않았습니다.",
    };
  }

  const searchParams = new URLSearchParams({
    ocid: ocid.trim(),
  });

  try {
    const response = await fetch(
      `${NEXON_API_URL}/maplestory/v1/character/basic?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "x-nxopen-api-key": apiKey,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("캐릭터 기본 정보 조회 오류:", {
        status: response.status,
        body: errorText,
      });

      return {
        success: false,
        error: `캐릭터 정보 조회에 실패했습니다. (${response.status})`,
      };
    }

    const data =
      (await response.json()) as MapleCharacterBasicResponse;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("캐릭터 정보 연결 오류:", error);

    return {
      success: false,
      error: "넥슨 API 서버에 연결하지 못했습니다.",
    };
  }
}