'use server'

import type {
    MapleCharacterBasicResponse,
    MapleCharacterNameState
} from "@/app/types/mapleCharacterBasicType"

const NEXON_API_URL = 'https://open.api.nexon.com';

export async function getCharacterBasic(
    ocid: string,
): Promise<MapleCharacterNameState> {
    if (!ocid || !ocid.trim()) {
        return {
            success: false,
            error: 'OCID가 없습니다.',
            ocid: ''
        }
    }

    const apiKey = process.env.NEXON_OPEN_API_KEY;

    const searchParams = new URLSearchParams({
        ocid: ocid.trim(),
    })

    try {
        const response = await fetch(
            `${NEXON_API_URL}/maplestory/v1/character/basic?${searchParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'x-nxopen-api-key': apiKey!,
                },
                cache: 'no-store',
            }
        )

        if (!response.ok) {
            const errorText = await response.text();

            console.error('Nexon API 오류 : ', {
                status: response.status,
                body: errorText
            })
        }
        const data = (await response.json()) as MapleCharacterBasicResponse;

        return {
            success: true,
            characterName: data.character_name,
            ocid: ocid,
        }
    } catch (error) {
        console.error('Nexon API 연결 오류:', error);
    }

    return {
        success: false,
        error: '넥슨 API 서버에 연결하지 못했습니다.',
        ocid: ocid
    }
}