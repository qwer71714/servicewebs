export interface MapleCharacterIdResponse {
    ocid: string;
}

export interface MapleCharacterSearchState {
    success: boolean;
    ocid?: string;
    characterName?: string;
    error?: string;
}

export interface MapleCharacterBasicResponse {
    date: string;
    character_name: string;
    world_name: string;
    character_gender: string;
    character_class: string;
    character_class_level: string;
    character_level: number;
    character_exp: number;
    character_exp_rate: string;
    character_guild_name: string | null;
    character_image: string;
}