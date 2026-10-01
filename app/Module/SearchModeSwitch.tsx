"use client";

import { KeyRound, ShieldCheck } from "lucide-react";

export type SearchMode = "character" | "guild";

interface SearchModeSwitchProps {
  value: SearchMode;
  onValueChange: (value: SearchMode) => void;
}

export function SearchModeSwitch({
  value,
  onValueChange,
}: SearchModeSwitchProps) {
  return (
    <div className="relative inline-flex items-center rounded-2xl bg-gray-100 p-1">
      {/* 슬라이딩 인디케이터 */}
      <div
        className="
          absolute top-1 bottom-1
          w-[calc(50%-4px)]
          bg-white
          rounded-xl
          shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]
          transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        "
        style={{
          left: "4px",
          transform:
            value === "character" ? "translateX(0)" : "translateX(100%)",
        }}
      />

      {/* 캐릭터 검색 탭 */}
      <button
        type="button"
        role="tab"
        aria-selected={value === "character"}
        onClick={() => onValueChange("character")}
        className="
          relative z-10
          flex items-center justify-center gap-2
          px-5 py-2.5
          rounded-xl
          text-sm font-medium
          transition-colors duration-200
          cursor-pointer
          select-none
        "
      >
        <KeyRound
          className={`
            size-4 transition-colors duration-200
            ${value === "character" ? "text-blue-500" : "text-gray-400"}
          `}
        />
        <span
          className={`
            transition-colors duration-200
            ${value === "character" ? "text-gray-900" : "text-gray-500"}
          `}
        >
          캐릭터 검색
        </span>
      </button>

      {/* 길드 검색 탭 */}
      <button
        type="button"
        role="tab"
        aria-selected={value === "guild"}
        onClick={() => onValueChange("guild")}
        className="
          relative z-10
          flex items-center justify-center gap-2
          px-5 py-2.5
          rounded-xl
          text-sm font-medium
          transition-colors duration-200
          cursor-pointer
          select-none
        "
      >
        <ShieldCheck
          className={`
            size-4 transition-colors duration-200
            ${value === "guild" ? "text-blue-500" : "text-gray-400"}
          `}
        />
        <span
          className={`
            transition-colors duration-200
            ${value === "guild" ? "text-gray-900" : "text-gray-500"}
          `}
        >
          길드 검색
        </span>
      </button>
    </div>
  );
}
