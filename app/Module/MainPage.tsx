"use client";

import { useActionState, useEffect, useState } from "react";
import { SearchModeSwitch, SearchMode } from "./SearchModeSwitch";
import { Search, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OverallFirstRank from "./OverallFirstRank";
import { useRouter } from "next/navigation";
import { MapleCharacterSearchState } from "../types/mapleCharacterTypes";
import { searchCharacter } from "@/lib/client/searchCharacter";
import {
  ALL_MAPLE_WORLDS,
  MAPLE_WORLDS,
  type MapleWorld,
} from "@/lib/nexon/worlds";

/** 월드 셀렉트 옵션 (value는 API 쿼리 파라미터로 전달) */
interface WorldOption {
  label: string;
  value: MapleWorld | typeof ALL_MAPLE_WORLDS;
}

const WORLD_OPTIONS: WorldOption[] = [
  { label: "전체 월드", value: ALL_MAPLE_WORLDS },
  ...MAPLE_WORLDS.map((name) => ({ label: name, value: name })),
];

const initialState: MapleCharacterSearchState = {
  success: false,
};

export default function MainPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>("character");
  const [characterName, setCharacterName] = useState("");
  const [worldName, setWorldName] = useState<WorldOption["value"]>(
    ALL_MAPLE_WORLDS,
  );

  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    searchCharacter,
    initialState,
  );

  useEffect(() => {
    if (
      state.success &&
      state.ocid &&
      state.characterName
    ) {
      const characterName = encodeURIComponent(
        state.characterName,
      );

      const query = new URLSearchParams();

      if (state.worldName) {
        query.set("worldName", state.worldName);
      }

      const search = query.size > 0 ? `?${query.toString()}` : "";
      router.push(`/maplestory/character/${characterName}${search}`);
    }
  }, [
    state.success,
    state.ocid,
    state.characterName,
    state.worldName,
    router,
  ]);

  return (
    <main className="flex flex-col items-center w-full text-center">
      {/* 1. API 연동 안내 뱃지: 넥슨 Open API v1 실시간 데이터 동기화 상태 및 안내 표시 */}
      <section
        className="
            w-fit
            p-2
            px-6
            text-center
            bg-black/5
            rounded-full
            border
        "
      >
        <div className="flex items-center justify-center gap-4">
          <div className="p-[4.5px] rounded-full bg-amber-600" />
          <p className="text-sm text-black/60">
            NEXON Open API v1 실시간 데이터 동기화 지원
          </p>
        </div>
      </section>

      {/* 2. 메인 헤더 & 서비스 소개: 서비스 타이틀(슬로건) 및 주요 조회 기능 설명 */}
      <section className="mt-12">
        <h1 className="text-6xl font-bold">
          메이플스토리 모험가와 길드의
          <br />
          <span className="bg-linear-to-r from-sky-400 to-blue-800 bg-clip-text text-transparent">
            모든 전적과 통계를 한눈에
          </span>
        </h1>

        <div className="mt-12">
          <p className="text-base text-black/80">
            전투력, 헥사 매트릭스 진행도, 스타포스 세팅부터 길드 랭킹까지 즉시
            조회하세요.
          </p>
        </div>
      </section>

      {/* 3. 검색 대상 선택 스위치: 캐릭터 검색 / 길드 검색 모드 전환 탭 */}
      <section className="mt-12">
        <SearchModeSwitch value={searchMode} onValueChange={setSearchMode} />
      </section>

      {/* 4. 통합 검색 바 영역: 월드(서버) 선택 셀렉트, 텍스트 입력 인풋, 검색 실행 버튼 및 안내 문구 */}
      <section className="mt-6 w-full max-w-[600px] px-4">
        <form
          action={formAction}
          className="
            group
            flex items-center
            overflow-hidden
            rounded-2xl
            border border-gray-200
            bg-white
            shadow-[0_2px_12px_rgba(0,0,0,0.06)]
            transition-all duration-300 ease-out
            hover:border-gray-300
            hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)]
            focus-within:border-blue-400
            focus-within:shadow-[0_4px_24px_rgba(59,130,246,0.15)]
          "
        >
          {/* 월드 선택 */}
          <div className="flex shrink-0 items-center pl-4">
            <input
              type="hidden"
              name="worldName"
              value={worldName === ALL_MAPLE_WORLDS ? "" : worldName}
            />
            <Select
              value={worldName}
              onValueChange={(value) => {
                if (value) setWorldName(value);
              }}
            >
              <SelectTrigger
                className="
                  h-[52px] w-[120px]
                  cursor-pointer
                  border-0 bg-transparent
                  text-sm font-medium text-gray-700
                  shadow-none
                  ring-0
                  transition-colors duration-200
                  hover:text-gray-900
                  focus-visible:border-0
                  focus-visible:ring-0
                "
              >
                <SelectValue placeholder="전체 월드" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>월드 선택</SelectLabel>

                  {WORLD_OPTIONS.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* 구분선 */}
          <div className="h-6 w-px shrink-0 bg-gray-200" />

          {/* 검색 입력 */}
          <div className="flex flex-1 items-center gap-3 px-4">
            <Search className="size-[18px] shrink-0 text-gray-400" />

            <input
              name="characterName"
              disabled={isPending}
              type="text"
              value={characterName}
              onChange={(event) =>
                setCharacterName(event.target.value)
              }
              placeholder={
                searchMode === "character"
                  ? "캐릭터 이름을 입력하세요"
                  : "길드 이름을 입력하세요"
              }
              className="
          h-[52px] min-w-0 flex-1
          border-none bg-transparent
          text-sm text-gray-900
          caret-blue-500 outline-none
          placeholder:text-gray-400
        "
            />
          </div>

          {/* 검색 버튼 */}
          <div className="shrink-0 pr-2">
            <button
              disabled={
                isPending ||
                !characterName.trim() ||
                searchMode !== "character"
              }
              type="submit"
              className="
          flex size-10 cursor-pointer
          items-center justify-center
          rounded-xl bg-blue-500
          text-white
          transition-all duration-200 ease-out
          hover:bg-blue-600
          active:scale-95
          active:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
            >
              <ArrowRight className="size-[18px]" />
            </button>
          </div>
        </form>

        {state.error && (
          <p
            role="alert"
            className="mt-3 text-sm text-red-500"
          >
            {state.error}
          </p>
        )}

        <p className="mt-3 text-xs text-gray-400">
          대소문자를 구분하지 않습니다 · Enter로 검색
        </p>
      </section>

      {/* 5. 종합 랭킹 1위 배너: 실시간 종합 랭킹 1위 캐릭터 정보 표시 */}
      <section className="mt-16 w-full max-w-[720px] px-4">
        <OverallFirstRank />
      </section>
    </main >
  );
}
