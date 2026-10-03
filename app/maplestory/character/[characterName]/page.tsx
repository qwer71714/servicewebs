import { notFound } from "next/navigation";

import { getCharacterOcidByName } from "@/lib/nexon/getCharacterOcidByName"
import { getCharacterBasicByOcid } from "@/lib/nexon/getCharacterBasicByOcid";
import { isMapleWorld, type MapleWorld } from "@/lib/nexon/worlds";
import { decodeRouteSegment } from "@/lib/routing/decodeRouteSegment";

interface CharacterPageProps {
    params: Promise<{
        characterName: string;
    }>;
    searchParams: Promise<{
        worldName?: string | string[];
    }>;
}

export default async function CharacterPage({
    params,
    searchParams,
}: CharacterPageProps) {
    const { characterName } = await params;
    const { worldName: requestedWorldName } = await searchParams;

    if (!characterName) {
        notFound();
    }

    const decodedName = decodeRouteSegment(characterName);
    let selectedWorld: MapleWorld | undefined;

    if (requestedWorldName !== undefined) {
        if (Array.isArray(requestedWorldName) || !isMapleWorld(requestedWorldName)) {
            notFound();
        }

        selectedWorld = requestedWorldName;
    }

    const result = await getCharacterOcidByName(decodedName);

    if (!result.success) {
        return (
            <main className="mx-auto max-w-2xl px-5 py-14">
                <h1 className="text-2xl font-bold tracking-tight">
                    캐릭터 조회 실패
                </h1>

                <p className="mt-4 text-[15px] text-red-500">
                    {result.error}
                </p>
            </main>
        );
    }

    const basicResult = await getCharacterBasicByOcid(result.ocid);

    if (!basicResult.success) {
        return (
            <main className="mx-auto max-w-2xl px-5 py-14">
                <h1 className="text-2xl font-bold tracking-tight">
                    캐릭터 정보 조회 실패
                </h1>

                <p className="mt-4 text-[15px] text-red-500">
                    {basicResult.error}
                </p>
            </main>
        );
    }

    const character = basicResult.data;

    if (selectedWorld && character.world_name !== selectedWorld) {
        return (
            <main className="mx-auto max-w-2xl px-5 py-14">
                <h1 className="text-2xl font-bold tracking-tight">
                    {selectedWorld} 월드에서 캐릭터를 찾지 못했습니다
                </h1>

                <p className="mt-4 text-[15px] text-gray-500">
                    {decodedName} 캐릭터는 {character.world_name} 월드에 있습니다.
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-2xl px-5 py-14">
            <p className="text-[13px] font-medium text-gray-400">
                메이플스토리 캐릭터 정보 · {selectedWorld ?? "전체 월드"}
            </p>

            <h1 className="mt-1.5 text-[28px] font-black tracking-tight text-gray-900">
                {character.character_name || decodedName}
            </h1>

            <section className="mt-8 grid grid-cols-2 gap-y-7 gap-x-6 rounded-2xl border border-gray-200 px-7 py-7">
                <CharacterInfo
                    label="월드"
                    value={character.world_name}
                />

                <CharacterInfo
                    label="직업"
                    value={character.character_class}
                />

                <CharacterInfo
                    label="레벨"
                    value={`Lv. ${character.character_level}`}
                />

                <CharacterInfo
                    label="길드"
                    value={character.character_guild_name ?? "없음"}
                />

                <CharacterInfo
                    label="경험치"
                    value={character.character_exp.toLocaleString()}
                />

                <CharacterInfo
                    label="경험치 비율"
                    value={`${character.character_exp_rate}%`}
                />
            </section>
        </main>
    );
}

function CharacterInfo({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-[13px] font-medium text-gray-400">
                {label}
            </p>

            <p className="mt-1.5 text-[17px] font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}
