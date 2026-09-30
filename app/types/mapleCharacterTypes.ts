export interface MapleCharacterIdResponse {
    ocid: string;
}

export interface MapleCharacterBasicResponse {
    character_name: string;
}

export interface MapleCharacterSearchState {
    success: boolean;
    ocid?: string;
    characterName?: string;
    error?: string;
}