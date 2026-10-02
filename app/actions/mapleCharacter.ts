"use server";

import type {
    MapleCharacterIdResponse,
    MapleCharacterSearchState,
} from "@/app/types/mapleCharacterTypes";

const NEXON_API_URL = "https://open.api.nexon.com";

export async function getCharacterId(
    _previousState: MapleCharacterSearchState,
    formData: FormData,
): Promise<MapleCharacterSearchState> {
    const characterName = formData.get("characterName");

    if (
        typeof characterName !== "string" ||
        !characterName.trim()
    ) {
        return {
            success: false,
            error: "캐릭터 이름을 입력해주세요.",
        };
    }

    const apiKey = process.env.NEXON_OPEN_API_KEY;

    if (!apiKey) {
        return {
            success: false,
            error: "NEXON_OPEN_API_KEY가 설정되지 않았습니다.",
        };
    }

    const normalizedName = characterName.trim();

    const searchParams = new URLSearchParams({
        character_name: normalizedName,
    });

    try {
        const response = await fetch(
            `${NEXON_API_URL}/maplestory/v1/id?${searchParams.toString()}`,
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

            console.error("OCID 조회 오류:", {
                status: response.status,
                body: errorText,
            });

            return {
                success: false,
                error: `캐릭터 조회에 실패했습니다. (${response.status})`,
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
            characterName: normalizedName,
        };
    } catch (error) {
        console.error("Nexon API 연결 오류:", error);

        return {
            success: false,
            error: "넥슨 API 서버에 연결하지 못했습니다.",
        };
    }
}