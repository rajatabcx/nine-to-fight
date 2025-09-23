import React, { useState } from "react";
import { gameData } from "@/lib/gameData";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useGameStore } from "@/lib/gameStore";

export default function Game() {
  const [currentQuestionId, setCurrentQuestionId] = useState("intro_chat");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [gameStats, setGameStats] = useGameStore((state) => [
    {
      sanity: state.sanity,
      money: state.money,
      performance: state.performance,
    },
    state.setgameStats,
  ]);

  // Find current question data
  const currentQuestion = gameData.find((q) => q.id === currentQuestionId);

  const handleOptionSelect = (choiceId: string) => {
    if (selectedOption || !currentQuestion) return;

    const choice = currentQuestion.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    setSelectedOption(choiceId);

    // Update stats
    setGameStats({
      sanity: gameStats.sanity + (choice.consequences.sanity ?? 0),
      money: gameStats.money + (choice.consequences.money ?? 0),
      performance:
        gameStats.performance + (choice.consequences.performance ?? 0),
    });

    // Show message after a delay
    setTimeout(() => {
      setMessage(choice.consequences.message);
      setShowMessage(true);
      setCurrentQuestionId(choice.consequences.nextScenarioId);
    }, 500); // Initial delay before showing message
  };

  const handleNextQuestion = () => {
    setShowMessage(false);
    setSelectedOption(null);
    setMessage("");
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Final Stats:</h3>
            <p>Sanity: {gameStats.sanity}</p>
            <p>Money: {gameStats.money}</p>
            <p>Performance: {gameStats.performance}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 fixed inset-0 h-2/4 top-1/2">
      {/* Question Display */}
      <div className="mb-4">
        <div className="mb-2 text-sm">
          Question {currentQuestion.questionNumber}
        </div>
        <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
        <p className="mb-6 leading-relaxed">{currentQuestion.description}</p>
      </div>

      {/* Options or Message */}
      {!showMessage ? (
        <div className="flex justify-center gap-2 flex-wrap">
          {currentQuestion.choices.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => handleOptionSelect(choice.id)}
              disabled={selectedOption !== null}
              variant={selectedOption === choice.id ? "default" : "outline"}
              className="w-[45%] justify-center !p-4 h-auto whitespace-normal"
            >
              {choice.text}
            </Button>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-gray-700 leading-relaxed">{message}</p>
          <div className="mt-3 flex justify-end">
            <Button
              onClick={handleNextQuestion}
              className="w-[45%] justify-center !p-4 h-auto whitespace-normal"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
