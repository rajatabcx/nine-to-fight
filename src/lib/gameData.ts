import { teamNames, quetionIds } from "./constants";
import { GameScenario } from "./types";

export const gameData: GameScenario[] = [
  {
    id: quetionIds.INTRO_CHAT,
    questionNumber: 1,
    title: "Welcome to the Team!",
    description: `${teamNames.ceo} & ${teamNames.engineeringManager} posts in the team chat: 'Everyone, please welcome ${teamNames.protagonist} to the our team! He'll be joining us as a Software Engineer. ${teamNames.protagonist}, feel free to introduce yourself and tell us what excites you about working with us!'`,
    choices: [
      {
        id: "enthusiastic_reply",
        text: "Reply with detailed intro about your background and excitement",
        consequences: {
          performance: 1,
          message:
            "Everyone sees you as eager and communicative. The founders appreciate your enthusiasm, but some team members roll their eyes at your optimism.",
          nextScenarioId: quetionIds.SETUP_NIGHTMARE,
        },
      },
      {
        id: "brief_reply",
        text: "Send a short, professional introduction",
        consequences: {
          performance: 0,
          message:
            "Your response is noted but doesn't make much impression either way. You play it safe.",
          nextScenarioId: quetionIds.SETUP_NIGHTMARE,
        },
      },
      {
        id: "no_reply",
        text: "Don't respond to the introduction request",
        consequences: {
          performance: -1,
          sanity: 1,
          message: `People think you're either arrogant or antisocial. ${teamNames.ceo} notices your silence and makes a mental note.`,
          nextScenarioId: quetionIds.SETUP_NIGHTMARE,
        },
      },
    ],
  },
  {
    questionNumber: 2,
    id: quetionIds.SETUP_NIGHTMARE,
    title: "DIY Development Setup",
    description:
      "You receive an instruction manual via email for setting up your development environment. No one is available for questions - everyone is 'in deep work mode'. The instructions are outdated and half the links are broken.",
    choices: [
      {
        id: "struggle_alone",
        text: "Work through it alone without asking for help",
        consequences: {
          sanity: -5,
          performance: 1,
          message:
            "You spend 8 hours fixing outdated instructions. Leadership appreciates your 'independence' and 'problem-solving skills'.",
          nextScenarioId: quetionIds.SETUP_NIGHTMARE,
        },
      },
      {
        id: "ask_for_help",
        text: "Message the team asking for setup assistance",
        consequences: {
          performance: -1,
          sanity: 2,
          message: `${teamNames.engineeringManager} responds 3 hours later: 'The docs should be self-explanatory. This is basic stuff.' You feel stupid for asking.`,
          nextScenarioId: quetionIds.SETUP_NIGHTMARE,
        },
      },
      {
        id: "dm_colleagues",
        text: `Privately DM ${teamNames.seniorEngineer} or ${teamNames.juniorEngineer} for help`,
        consequences: {
          sanity: 1,
          message: `${teamNames.seniorEngineer} or ${teamNames.juniorEngineer} helps you quietly. 'Don't let them know I helped - they expect everyone to figure it out alone,' he whispers.`,
          nextScenarioId: quetionIds.SETUP_NIGHTMARE,
        },
      },
      {
        id: "flag_documentation",
        text: "Point out the documentation issues professionally",
        consequences: {
          performance: -2,
          sanity: -1,
          message: `${teamNames.productManager} replies: 'The documentation works fine for everyone else. Maybe focus on adapting rather than finding problems.'`,
          nextScenarioId: quetionIds.SETUP_NIGHTMARE,
        },
      },
    ],
  },
];
