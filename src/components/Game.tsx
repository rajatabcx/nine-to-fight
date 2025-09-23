import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

import { gameData } from "@/lib/gameData";
import { Button } from "@/components/ui/button";
import { useGameStats } from "@/lib/gameStats";
import { TypingAnimation } from "./magicui/typing-animation";
import { cn } from "@/lib/utils";

export default function Game() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const {
    sanity,
    money,
    performance,
    questionId,
    setGameStats,
    setQuestionId,
  } = useGameStats();

  // Find current question data
  const currentQuestion = gameData.find((q) => q.id === questionId)!;

  const handleOptionSelect = (choiceId: string) => {
    if (selectedOption || !currentQuestion) return;

    const choice = currentQuestion.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    setSelectedOption(choiceId);

    // Update stats
    setGameStats({
      sanity: sanity + (choice.consequences.sanity ?? 0),
      money: money + (choice.consequences.money ?? 0),
      performance: performance + (choice.consequences.performance ?? 0),
    });

    // Show message after a delay
    setTimeout(() => {
      setMessage(choice.consequences.message);
      setShowMessage(true);
      setQuestionId(choice.consequences.nextScenarioId);
    }, 500); // Initial delay before showing message
  };

  const handleNextQuestion = () => {
    setShowMessage(false);
    setSelectedOption(null);
    setMessage("");
  };

  return (
    <div
      className={cn(
        "max-w-4xl mx-auto p-6 fixed inset-0 h-2/4 top-1/2 flex flex-col",
        showMessage && "justify-center"
      )}
    >
      {/* Options or Message */}
      {!showMessage ? (
        <>
          {/* Question Display */}
          <div>
            <div className="mb-2 text-sm">
              Question {currentQuestion.questionNumber}
            </div>
            <h2 className="text-2xl font-bold">{currentQuestion.title}</h2>
            <p className="mb-6 leading-relaxed">
              {currentQuestion.description}
            </p>
          </div>
          <div className="flex justify-between gap-y-5 flex-wrap">
            {currentQuestion.choices.map((choice) => (
              <Button
                key={choice.id}
                onClick={() => handleOptionSelect(choice.id)}
                disabled={selectedOption !== null}
                variant={selectedOption === choice.id ? "default" : "outline"}
                className="w-[48%] justify-center !p-4 h-auto whitespace-normal !m-0"
              >
                {choice.text}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <TypingAnimation className="text-lg leading-relaxed" duration={50}>
            {message}
          </TypingAnimation>
          <div className="mt-3 flex justify-end">
            <Button
              onClick={handleNextQuestion}
              className="justify-center !p-0 h-auto whitespace-normal !size-8"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
