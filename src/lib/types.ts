export type Intro = {
  name: string;
  introText: string[];
  entryFrom: "left" | "right";
  designation: string;
  image: string;
};

export type GameScenario = {
  id: string;
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
