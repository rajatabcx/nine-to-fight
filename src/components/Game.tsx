import React, { useState } from "react";
import { gameData } from "@/lib/gameData";
import { Button } from "@/components/ui/button";

interface GameStats {
  sanity: number;
  money: number;
  performance: number;
}

export default function Game() {
  const [currentQuestionId, setCurrentQuestionId] = useState("intro_chat");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [gameStats, setGameStats] = useState<GameStats>({
    sanity: 50,
    money: 50,
    performance: 50,
  });

  // Find current question data
  const currentQuestion = gameData.find((q) => q.id === currentQuestionId);

  const handleOptionSelect = (choiceId: string) => {
    if (selectedOption || !currentQuestion) return;

    const choice = currentQuestion.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    setSelectedOption(choiceId);

    // Update stats
    setGameStats((prev) => ({
      sanity: prev.sanity + (choice.consequences.sanity || 0),
      money: prev.money + (choice.consequences.money || 0),
      performance: prev.performance + (choice.consequences.performance || 0),
    }));

    // Show message after a delay
    setTimeout(() => {
      setMessage(choice.consequences.message);
      setShowMessage(true);

      // Move to next question after showing message
      setTimeout(() => {
        setCurrentQuestionId(choice.consequences.nextScenarioId);
        setSelectedOption(null);
        setShowMessage(false);
        setMessage("");
      }, 3000); // Show message for 3 seconds
    }, 500); // Initial delay before showing message
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
    <div className="max-w-4xl mx-auto p-6 fixed inset-0 h-2/4 top-1/2 -translate-y-1/2">
      {/* Question Display */}
      <div className="mb-8">
        <div className="mb-2 text-sm text-gray-600">
          Question {currentQuestion.questionNumber}
        </div>
        <h2 className="text-2xl font-bold mb-4">{currentQuestion.title}</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {currentQuestion.description}
        </p>
      </div>

      {/* Options or Message */}
      {!showMessage ? (
        <div className="space-y-3">
          {currentQuestion.choices.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => handleOptionSelect(choice.id)}
              disabled={selectedOption !== null}
              variant={selectedOption === choice.id ? "default" : "outline"}
              className="w-full text-left justify-start p-4 h-auto whitespace-normal"
            >
              {choice.text}
            </Button>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-gray-700 leading-relaxed">{message}</p>
          <div className="mt-3 text-sm text-gray-500">
            Moving to next question...
          </div>
        </div>
      )}
    </div>
  );
}
