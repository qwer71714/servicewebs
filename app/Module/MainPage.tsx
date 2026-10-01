"use client";

import { useState } from "react";
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

/** 월드 셀렉트 옵션 (value는 API 쿼리 파라미터로 전달) */
interface WorldOption {
  label: string;
  value: string;
}

const WORLD_NAMES = [
  "루나", "엘리시움", "오로라", "노바", "레드",
  "크로아", "스카니아", "베라", "아케인", "이그니스",
] as const;

const WORLD_OPTIONS: WorldOption[] = [
  { label: "전체월드", value: "" },
  ...WORLD_NAMES.map((name) => ({ label: name, value: name })),
];

export default function MainPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>("character");
  const [characterName, setCharacterName] = useState("");

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
        <div
          className="
            group
            flex items-center
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-[0_2px_12px_rgba(0,0,0,0.06)]
            hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)]
            hover:border-gray-300
            focus-within:shadow-[0_4px_24px_rgba(59,130,246,0.15)]
            focus-within:border-blue-400
            transition-all duration-300 ease-out
            overflow-hidden
          "
        >
          {/* 월드 셀렉트 영역 */}
          <div className="flex items-center pl-4 shrink-0">
            <Select>
              <SelectTrigger
                className="
                  w-[120px] h-[52px]
                  border-0 bg-transparent
                  shadow-none
                  ring-0 focus-visible:ring-0 focus-visible:border-0
                  text-sm font-medium text-gray-700
                  hover:text-gray-900
                  transition-colors duration-200
                  cursor-pointer
                "
              >
                <SelectValue placeholder="전체 월드" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>월드 선택</SelectLabel>
                  {WORLD_OPTIONS.map((item) => (
                    <SelectItem key={item.value || "전체월드"} value={item.value || "전체월드"}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-200 shrink-0" />

          {/* 검색 입력 영역 */}
          <div className="flex items-center flex-1 gap-3 px-4">
            <Search className="size-[18px] text-gray-400 shrink-0" />
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder={
                searchMode === "character"
                  ? "캐릭터 이름을 입력하세요"
                  : "길드 이름을 입력하세요"
              }
              className="
                flex-1 h-[52px]
                bg-transparent
                text-sm text-gray-900
                placeholder:text-gray-400
                outline-none border-none
                caret-blue-500
              "
            />
          </div>

          {/* 검색 버튼 */}
          <div className="pr-2 shrink-0">
            <button
              type="button"
              className="
                flex items-center justify-center
                size-10
                bg-blue-500
                hover:bg-blue-600
                active:bg-blue-700
                active:scale-95
                rounded-xl
                text-white
                transition-all duration-200 ease-out
                cursor-pointer
              "
            >
              <ArrowRight className="size-[18px]" />
            </button>
          </div>
        </div>

        {/* 하단 안내 텍스트 */}
        <p className="mt-3 text-xs text-gray-400">
          대소문자를 구분하지 않습니다 · Enter로 검색
        </p>
      </section>

      {/* 5. 종합 랭킹 1위 배너: 실시간 종합 랭킹 1위 캐릭터 정보 표시 */}
      <section className="mt-16 w-full max-w-[720px] px-4">
        <OverallFirstRank />
      </section>
    </main>
  );
}
