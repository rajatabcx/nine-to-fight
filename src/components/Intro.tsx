"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { introData } from "@/lib/introData";
import { useGameStore } from "@/lib/gameStore";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Intro() {
  const setIntroDone = useGameStore((state) => state.setIntroDone);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentIntroText, setCurrentIntroText] = useState(0);

  const currentCharacter = introData[currentSlide];
  const isLastSlide = currentSlide === introData.length - 1;
  const isLastIntroText =
    currentCharacter.introText.length - 1 === currentIntroText;

  const handleNext = () => {
    if (isLastSlide && isLastIntroText) {
      setIntroDone(true);
    } else {
      if (isLastIntroText) {
        setCurrentIntroText(0);
        setCurrentSlide((prev) => prev + 1);
      } else {
        setCurrentIntroText((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIntroText === 0) {
      setCurrentIntroText(introData[currentSlide].introText.length - 1);
      setCurrentSlide((prev) => prev - 1);
    } else {
      setCurrentIntroText((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    setIntroDone(true);
  };

  return (
    <div className="min-h-screen flex items-center overflow-hidden fixed inset-0">
      {/* Background overlay */}

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-black/60 text-white text-sm rounded hover:bg-black/80 transition-colors"
      >
        Skip Intro
      </button>

      {/* Character Image */}
      <div className="flex justify-center relative">
        <motion.div
          key={currentSlide}
          initial={{
            opacity: 0,
            x: currentCharacter.entryFrom === "left" ? 0 : "100vw",
          }}
          animate={{
            opacity: 1,
            x: currentCharacter.entryFrom === "left" ? "30vw" : "50vw",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            priority
            src={currentCharacter.image}
            alt={currentCharacter.name}
            className={cn(
              "object-contain object-center",
              currentCharacter.entryFrom === "right" ? "scale-x-[-1]" : ""
            )}
            height={400}
            width={400}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              "speech-bubble absolute max-w-2xl w-full p-4 -top-1/5 h-44 flex flex-col justify-between",
              currentCharacter.entryFrom === "left"
                ? "left left-4/6"
                : "right right-4/6"
            )}
          >
            <TypingAnimation className="text-sm">
              {currentCharacter.introText[currentIntroText]}
            </TypingAnimation>
            <div className={cn("flex justify-end items-center gap-2")}>
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="lg"
                className={cn("!w-10 !px-4", currentSlide === 0 && "hidden")}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="px-4 py-2 bg-black/60 text-white rounded text-xs">
                {currentIntroText + 1} /{" "}
                {introData[currentSlide].introText.length}
              </div>
              <Button onClick={handleNext} size="icon" className="!w-10 !px-4">
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
