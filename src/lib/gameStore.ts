import { create } from "zustand";

interface GameState {
  // Audio settings
  isAudioEnabled: boolean;

  //   game started
  gameStarted: boolean;

  playerId: string;

  introDone: boolean;

  // Actions
  toggleAudio: () => void;
  toggleGameStarted: () => void;
  setPlayerId: (playerId: string) => void;
  setIntroDone: (introDone: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  isAudioEnabled: false,
  gameStarted: false,
  playerId: "",
  introDone: false,

  // Actions
  toggleAudio: () =>
    set((state) => ({ ...state, isAudioEnabled: !state.isAudioEnabled })),
  toggleGameStarted: () =>
    set((state) => ({ ...state, gameStarted: !state.gameStarted })),
  setPlayerId: (playerId: string) => set((state) => ({ ...state, playerId })),
  setIntroDone: (introDone: boolean) =>
    set((state) => ({ ...state, introDone })),
}));
