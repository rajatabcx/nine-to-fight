"use client";
import MusicPlayer from "@/components/MusicPlayer";
import StartScreen from "@/components/StartScreen";
import { useGameStore } from "@/lib/gameStore";
import Intro from "@/components/Intro";
import Game from "@/components/Game";
import GameRule from "@/components/GameRule";

export default function Home() {
  const { gameStarted, introDone, gameRulesDone } = useGameStore();
  return (
    <main className="h-screen w-screen game scroll-none">
      <div className="game-container game-bg h-2/4 w-full"></div>
      <div className="options-container h-2/4 w-full"></div>
      <MusicPlayer />
      {/* if game not started, show start screen */}
      {!gameStarted && <StartScreen />}
      {/* if game started and game rules not done, show game rule */}
      {!introDone && gameStarted && !gameRulesDone && <GameRule />}
      {/* if game started and intro not done, show intro */}
      {!introDone && gameRulesDone && gameStarted && <Intro />}
      {/* if intro done, show game */}
      {introDone && gameStarted && gameRulesDone && <Game />}
    </main>
  );
}
