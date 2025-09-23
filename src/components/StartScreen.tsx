"use client";

import { useState, useEffect } from "react";
import { parseCookies, setCookie } from "nookies";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

import { cookieNames, COOKIE_EXPIRY_DAYS } from "@/lib/constants";
import { useGameStore } from "@/lib/gameStore";
import { Press_Start_2P } from "next/font/google";
import { cn } from "@/lib/utils";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: ["400"],
  subsets: ["latin"],
});

export default function StartScreen() {
  const { toggleGameStarted, setPlayerId } = useGameStore();
  const [hasExistingPlayer, setHasExistingPlayer] = useState(false);

  useEffect(() => {
    // Check for existing player ID
    const cookies = parseCookies();
    const savedPlayerId = cookies[cookieNames.PLAYER_ID];

    if (savedPlayerId) {
      setPlayerId(savedPlayerId);
      setHasExistingPlayer(true);
    }
  }, []);

  const handleResumeGame = () => {
    const cookies = parseCookies();
    const playerId = cookies[cookieNames.PLAYER_ID];

    if (playerId) {
      toggleGameStarted();
    }
  };

  const onStartGame = () => {
    try {
      // Generate unique player ID using nanoid
      const playerId = nanoid();

      // Store player data in cookies
      setCookie(null, cookieNames.PLAYER_ID, playerId, {
        maxAge: COOKIE_EXPIRY_DAYS * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });

      setPlayerId(playerId);

      toggleGameStarted();
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return (
    <div className="w-full bg-transparent fixed top-4/6 flex flex-col items-center justify-center gap-4 text-center">
      {/* Game Title */}
      <div className="space-y-4 text-center">
        <h1
          className={cn(
            "text-2xl md:text-4xl lg:text-6xl font-bold text-white pixel-text drop-shadow-lg",
            pressStart2P.className
          )}
        >
          Nine To Fight
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {hasExistingPlayer ? (
          <div className="space-y-3">
            <div
              className={cn(
                "text-sm text-gray-300 pixel-text",
                pressStart2P.className
              )}
            >
              Welcome back!
            </div>
            <Button
              onClick={handleResumeGame}
              className={cn(
                "pixel-button text-lg px-8 py-6 bg-green-600 hover:bg-green-700",
                pressStart2P.className
              )}
              size="lg"
            >
              <RotateCcw className="mr-2 size-5" />
              RESUME GAME
            </Button>
          </div>
        ) : (
          <Button
            className={cn(
              "pixel-button text-lg px-8 py-6",
              pressStart2P.className
            )}
            size="lg"
            onClick={onStartGame}
          >
            <Play className="mr-2 size-5" />
            START GAME
          </Button>
        )}
      </div>
    </div>
  );
}
