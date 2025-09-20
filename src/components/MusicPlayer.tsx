"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeOff } from "lucide-react";
import { useGameStore } from "@/lib/gameStore";

export default function MusicPlayer() {
  const { isAudioEnabled, toggleAudio } = useGameStore();
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);

  useEffect(() => {
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;

    if (!audio1 || !audio2) return;

    // Set low volume
    audio1.volume = 0.3;
    audio2.volume = 0.3;

    if (isAudioEnabled) {
      // Start with the first track
      if (currentTrack === 0) {
        audio1.currentTime = 0;
        audio1.play().catch(console.error);
      } else {
        audio2.currentTime = 0;
        audio2.play().catch(console.error);
      }
    } else {
      // Stop all audio
      audio1.pause();
      audio2.pause();
      audio1.currentTime = 0;
      audio2.currentTime = 0;
      setCurrentTrack(0);
    }
  }, [isAudioEnabled, currentTrack]);

  const handleTrack1End = () => {
    if (isAudioEnabled) {
      setCurrentTrack(1);
    }
  };

  const handleTrack2End = () => {
    if (isAudioEnabled) {
      setCurrentTrack(0);
    }
  };

  return (
    <div className="music-player fixed bottom-2 right-2 z-50">
      <Button
        onClick={() => toggleAudio()}
        className="rounded-full size-10"
        variant="outline"
      >
        {isAudioEnabled ? (
          <Volume2 className="size-4" />
        ) : (
          <VolumeOff className="size-4" />
        )}
      </Button>
      <div style={{ display: "none" }}>
        <audio ref={audioRef1} preload="auto" onEnded={handleTrack1End}>
          <source src="/music/music1.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={audioRef2} preload="auto" onEnded={handleTrack2End}>
          <source src="/music/music2.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
}
