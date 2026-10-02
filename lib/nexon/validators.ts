import type {
  MapleCharacterBasicResponse,
  MapleCharacterIdResponse,
} from "@/app/types/mapleCharacterTypes";
import type { OverallRankingItem } from "@/app/types/mapleRankingTypes";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

export function isCharacterId(value: unknown): value is MapleCharacterIdResponse {
  return isRecord(value) && typeof value.ocid === "string" && value.ocid.trim().length > 0;
}

export function isCharacterBasic(value: unknown): value is MapleCharacterBasicResponse {
  return isRecord(value)
    && isNullableString(value.date)
    && [
      "character_name", "world_name", "character_gender", "character_class",
      "character_class_level", "character_exp_rate", "character_image",
    ].every((key) => typeof value[key] === "string")
    && isFiniteNumber(value.character_level)
    && isFiniteNumber(value.character_exp)
    && isNullableString(value.character_guild_name);
}

export function isRankingItem(value: unknown): value is OverallRankingItem {
  return isRecord(value)
    && ["date", "character_name", "world_name", "class_name", "sub_class_name"]
      .every((key) => typeof value[key] === "string")
    && ["ranking", "character_level", "character_exp", "character_popularity"]
      .every((key) => isFiniteNumber(value[key]))
    && isNullableString(value.character_guildname);
}

export function isRankingResponse(value: unknown): value is { ranking: unknown[] } {
  return isRecord(value) && Array.isArray(value.ranking);
}
