import { quetionIds } from "./constants";

export type Intro = {
  name: string;
  introText: string[];
  entryFrom: "left" | "right";
  designation: string;
  image: string;
};

export type GameScenario = {
  id: (typeof quetionIds)[keyof typeof quetionIds];
  title: string;
  description: string;
  questionNumber: number;
  choices: {
    id: string;
    text: string;
    consequences: {
      sanity?: number;
      money?: number;
      performance?: number;
      message: string;
      nextScenarioId: string;
    };
  }[];
};

export type GameStats = {
  sanity: number;
  money: number;
  performance: number;
};

export type GameState = {
  // Audio settings
  isAudioEnabled: boolean;

  //   game started
  gameStarted: boolean;

  playerId: string;

  introDone: boolean;

  gameRulesDone: boolean;

  // Actions
  toggleAudio: () => void;
  toggleGameStarted: () => void;
  setPlayerId: (playerId: string) => void;
  setIntroDone: (introDone: boolean) => void;
  setGameRulesDone: (gameRulesDone: boolean) => void;
};

export type GameStatsStore = {
  // game stats
  sanity: number;
  money: number;
  performance: number;
  questionId: (typeof quetionIds)[keyof typeof quetionIds];

  setGameStats: (gameStats: GameStats) => void;
  setQuestionId: (
    questionId: (typeof quetionIds)[keyof typeof quetionIds]
  ) => void;
};
