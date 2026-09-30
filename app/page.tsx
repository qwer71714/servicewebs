"use client";

import { useActionState } from "react";

import { getCharacterId } from "@/app/actions/mapleCharacter";

import type { MapleCharacterSearchState } from "@/app/types/mapleCharacterTypes";
import MainPage from "./Module/MainPage";

const initialState: MapleCharacterSearchState = {
  success: false,
};

export default function Home() {
  const [state, formAction, isPending] = useActionState(
    getCharacterId,
    initialState,
  );

  return <MainPage />;
}
