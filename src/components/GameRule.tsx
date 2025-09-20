import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useGameStore } from "@/lib/gameStore";

export default function GameRule() {
  const setGameRulesDone = useGameStore((state) => state.setGameRulesDone);
  return (
    <div className="min-h-screen flex items-center overflow-hidden fixed inset-0 justify-center">
      <div className="speech-bubble max-w-2xl w-full p-4 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Your Mission</h1>
          <p className="text-xs">
            Survive at a startup. Make decisions that shape your corporate
            nightmare. Will you escape with dignity or become the toxic boss you
            hate?
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Your Stats</h2>
          <ul className="text-xs">
            <li>
              <strong className="text-red-600">Sanity:</strong> Mental health
              (starts at 100)
            </li>
            <li>
              <strong className="text-green-600">Money:</strong> Bank balance
              (starts at -50)
            </li>
            <li>
              <strong className="text-cyan-500">Performance:</strong> Company
              rating (starts at 0)
            </li>
          </ul>
          <p className="text-xs">
            Every choice affects these stats. High performance often destroys
            sanity. Welcome to corporate life.
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold">The Endgame</h2>
          <p className="text-xs">
            Your final stats determine one of many endings. There's no "winning"
            - only different ways to survive or break. Each ending reflects real
            workplace horror.
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setGameRulesDone(true)}>
            Continue <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
