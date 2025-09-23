import { create } from "zustand";
import { GameState, GameStats } from "./types";

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  isAudioEnabled: false,
  gameStarted: false,
  playerId: "",
  introDone: false,
  gameRulesDone: false,
  // Actions
  toggleAudio: () =>
    set((state) => ({ ...state, isAudioEnabled: !state.isAudioEnabled })),
  toggleGameStarted: () =>
    set((state) => ({ ...state, gameStarted: !state.gameStarted })),
  setPlayerId: (playerId: string) => set((state) => ({ ...state, playerId })),
  setIntroDone: (introDone: boolean) =>
    set((state) => ({ ...state, introDone })),
  setGameRulesDone: (gameRulesDone: boolean) =>
    set((state) => ({ ...state, gameRulesDone })),
}));
