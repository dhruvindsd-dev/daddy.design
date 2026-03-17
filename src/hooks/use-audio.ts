"use client";

import { SoundEffectsContext } from "@/providers/sound-effects-provider";
import type { SoundEffectName } from "@/lib/sound-effects";
import { useContext } from "react";

export default function useAudio(soundEffect: SoundEffectName) {
  const context = useContext(SoundEffectsContext);

  if (!context) {
    throw new Error(
      "useSoundEffect must be used inside SoundEffectsProvider.",
    );
  }

  return () => context.play(soundEffect);
}
