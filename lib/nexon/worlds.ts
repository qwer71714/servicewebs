export const MAPLE_WORLDS = [
  "스카니아",
  "베라",
  "루나",
  "제니스",
  "크로아",
  "유니온",
  "엘리시움",
  "이노시스",
  "레드",
  "오로라",
  "아케인",
  "노바",
  "에오스",
  "핼리오스",
  "챌린저스",
  "챌린저스2",
  "챌린저스3",
  "챌린저스4",
] as const;

export type MapleWorld = (typeof MAPLE_WORLDS)[number];

export const ALL_MAPLE_WORLDS = "전체 월드" as const;

export function isMapleWorld(value: unknown): value is MapleWorld {
  return typeof value === "string"
    && MAPLE_WORLDS.some((world) => world === value);
}
