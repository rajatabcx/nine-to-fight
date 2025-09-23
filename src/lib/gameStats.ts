import { create } from "zustand";
import { GameStats, GameStatsStore } from "./types";
import { quetionIds } from "./constants";

export const useGameStats = create<GameStatsStore>((set) => ({
  // Initial state
  sanity: 100,
  money: -50,
  performance: 0,
  questionId: quetionIds.INTRO_CHAT,
  // Actions

  setGameStats: (gameStats: GameStats) =>
    set((state) => ({
      ...state,
      sanity: gameStats.sanity ?? state.sanity,
      money: gameStats.money ?? state.money,
      performance: gameStats.performance ?? state.performance,
    })),
  setQuestionId: (questionId: (typeof quetionIds)[keyof typeof quetionIds]) =>
    set((state) => ({ ...state, questionId })),
}));
