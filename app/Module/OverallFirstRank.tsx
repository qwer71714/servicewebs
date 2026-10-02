"use client";

import { useEffect, useState } from "react";
import { Crown, Loader2 } from "lucide-react";

import { getOverallFirstRank } from "@/app/actions/mapleOverallFirstRank";

import type { OverallRankingItem } from "@/app/types/mapleRankingTypes";

export default function OverallFirstRank() {
    const [ranking, setRanking] = useState<OverallRankingItem | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadRanking() {
            const result = await getOverallFirstRank();

            if (cancelled) return;

            if (!result.success || !result.ranking) {
                setError(result.error ?? "랭킹 조회에 실패했습니다.");
                setIsLoading(false);
                return;
            }

            setRanking(result.ranking);
            setIsLoading(false);
        }

        void loadRanking();

        return () => {
            cancelled = true;
        };
    }, []);

    /* ── 로딩 상태 ── */
    if (isLoading) {
        return (
            <div
                className="
                    w-full rounded-2xl
                    border border-gray-100
                    bg-white
                    px-8 py-6
                    flex items-center justify-center gap-3
                    text-sm text-gray-400
                "
            >
                <Loader2 className="size-4 animate-spin" />
                종합 랭킹을 불러오는 중입니다
            </div>
        );
    }

    /* ── 에러 상태 ── */
    if (error || !ranking) {
        return (
            <div
                className="
          w-full rounded-2xl
          border border-red-100
          bg-red-50
          px-8 py-6
          text-sm text-red-500
        "
            >
                {error}
            </div>
        );
    }

    /* ── 정상 렌더 ── */
    return (
        <article
            className="
        w-full rounded-2xl
        border border-gray-100
        bg-white

        px-8 py-7
      "
        >
            {/* 상단: 뱃지 + 캐릭터 정보 */}
            <div className="flex items-start justify-between gap-6">
                {/* 좌측: 뱃지 + 이름 */}
                <div className="flex items-center gap-4 min-w-0">
                    {/* 왕관 아이콘 원형 배경 */}
                    <div
                        className="
              flex items-center justify-center
              size-11 shrink-0
              rounded-full
              bg-gradient-to-br from-amber-400 to-yellow-500

            "
                    >
                        <Crown className="size-5 text-white" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-amber-500 tracking-wide uppercase">
                                종합 랭킹 1위
                            </span>
                        </div>

                        <p className="mt-0.5 text-xl font-bold text-gray-900 truncate">
                            {ranking.character_name}
                        </p>

                        <p className="mt-0.5 text-sm text-gray-400">
                            {ranking.world_name} · {ranking.class_name}
                        </p>
                    </div>
                </div>

                {/* 우측: 기준일 */}
                <span className="shrink-0 text-xs text-gray-300 pt-1">
                    {ranking.date}
                </span>
            </div>

            {/* 구분선 */}
            <div className="my-5 h-px bg-gray-100" />

            {/* 하단: 스탯 가로 나열 */}
            <div className="flex items-center gap-8">
                <StatItem label="레벨" value={`Lv. ${ranking.character_level}`} />
                <StatItem
                    label="경험치"
                    value={ranking.character_exp.toLocaleString()}
                />
                <StatItem
                    label="인기도"
                    value={ranking.character_popularity.toLocaleString()}
                />
                <StatItem label="길드" value={ranking.character_guildname ?? "없음"} />
            </div>
        </article>
    );
}

/* ── 스탯 아이템 서브 컴포넌트 ── */
function StatItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <dt className="text-xs text-gray-400">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-gray-800 truncate">
                {value}
            </dd>
        </div>
    );
}