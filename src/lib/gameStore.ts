import { create } from "zustand";
import { GameStats } from "./types";

interface GameState {
  // Audio settings
  isAudioEnabled: boolean;

  //   game started
  gameStarted: boolean;

  playerId: string;

  introDone: boolean;

  gameRulesDone: boolean;

  // game stats
  sanity: number;
  money: number;
  performance: number;

  // Actions
  toggleAudio: () => void;
  toggleGameStarted: () => void;
  setPlayerId: (playerId: string) => void;
  setIntroDone: (introDone: boolean) => void;
  setGameRulesDone: (gameRulesDone: boolean) => void;

  setgameStats: (gameStats: GameStats) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  isAudioEnabled: false,
  gameStarted: false,
  playerId: "",
  introDone: false,
  gameRulesDone: false,
  sanity: 100,
  money: -50,
  performance: 0,
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
  setgameStats: (gameStats: GameStats) =>
    set((state) => ({
      ...state,
      sanity: gameStats.sanity ?? state.sanity,
      money: gameStats.money ?? state.money,
      performance: gameStats.performance ?? state.performance,
    })),
}));
