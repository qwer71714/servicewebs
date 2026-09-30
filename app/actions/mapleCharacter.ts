'use server';

import type {
    MapleCharacterBasicResponse,
    MapleCharacterIdResponse,
    MapleCharacterSearchState,
} from '@/app/types/mapleCharacterTypes';

const NEXON_API_URL = 'https://open.api.nexon.com';

export async function getCharacterId(
    previousState: MapleCharacterSearchState,
    formData: FormData,
): Promise<MapleCharacterSearchState> {
    const characterName = formData.get('characterName');

    if (
        typeof characterName !== 'string' ||
        !characterName.trim()
    ) {
        return {
            success: false,
            error: '캐릭터 이름을 입력해주세요.',
        };
    }

    const apiKey = process.env.NEXON_OPEN_API_KEY;

    if (!apiKey) {
        return {
            success: false,
            error: 'NEXON_OPEN_API_KEY가 설정되어 있지 않습니다.',
        };
    }

    const headers = {
        'x-nxopen-api-key': apiKey,
        Accept: 'application/json',
    };

    try {
        /*
         * 1. 캐릭터 닉네임으로 OCID 조회
         */
        const idSearchParams = new URLSearchParams({
            character_name: characterName.trim(),
        });

        const idResponse = await fetch(
            `${NEXON_API_URL}/maplestory/v1/id?${idSearchParams.toString()}`,
            {
                method: 'GET',
                headers,
                cache: 'no-store',
            },
        );

        if (!idResponse.ok) {
            const errorText = await idResponse.text();

            console.error('OCID 조회 오류:', {
                status: idResponse.status,
                body: errorText,
            });

            return {
                success: false,
                error: `OCID 조회에 실패했습니다. (${idResponse.status})`,
            };
        }

        const idData = (await idResponse.json()) as MapleCharacterIdResponse;

        if (!idData.ocid) {
            return {
                success: false,
                error: '캐릭터의 OCID를 찾지 못했습니다.',
            };
        }

        /*
         * 2. 조회한 OCID로 캐릭터 기본 정보 조회
         */
        const basicSearchParams = new URLSearchParams({
            ocid: idData.ocid,
        });

        const basicResponse = await fetch(
            `${NEXON_API_URL}/maplestory/v1/character/basic?${basicSearchParams.toString()}`,
            {
                method: 'GET',
                headers,
                cache: 'no-store',
            },
        );

        if (!basicResponse.ok) {
            const errorText = await basicResponse.text();

            console.error('캐릭터 기본 정보 조회 오류:', {
                status: basicResponse.status,
                body: errorText,
            });

            return {
                success: false,
                error: `캐릭터 기본 정보 조회에 실패했습니다. (${basicResponse.status})`,
            };
        }

        const basicData = (await basicResponse.json()) as MapleCharacterBasicResponse;

        /*
         * 3. OCID와 닉네임을 함께 클라이언트에 반환
         */
        return {
            success: true,
            ocid: idData.ocid,
            characterName: basicData.character_name,
        };
    } catch (error) {
        console.error('Nexon API 연결 오류:', error);

        return {
            success: false,
            error: '넥슨 API 서버에 연결하지 못했습니다.',
        };
    }
}