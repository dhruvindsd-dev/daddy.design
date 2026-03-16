"use client";

import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SOUND_EFFECT_NAMES,
  SOUND_EFFECTS,
  type SoundEffectName,
} from "@/lib/sound-effects";
import useControlsStore from "@/stores/controls-store";

type SoundEffectsContextValue = {
  play: (soundEffect: SoundEffectName) => void;
};

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export const SoundEffectsContext =
  createContext<SoundEffectsContextValue | null>(null);

let sharedAudioContext: AudioContext | null = null;
let unlockListenersRegistered = false;

const audioBufferCache = new Map<SoundEffectName, AudioBuffer>();
const audioBufferLoaders = new Map<SoundEffectName, Promise<AudioBuffer>>();

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (sharedAudioContext) return sharedAudioContext;

  const AudioContextCtor =
    window.AudioContext || (window as AudioWindow).webkitAudioContext;

  if (!AudioContextCtor) return null;

  sharedAudioContext = new AudioContextCtor();

  return sharedAudioContext;
}

function registerAudioUnlock(audioContext: AudioContext) {
  if (typeof window === "undefined" || unlockListenersRegistered) return;

  const removeUnlockListeners = () => {
    window.removeEventListener("pointerdown", unlockAudio, true);
    window.removeEventListener("keydown", unlockAudio, true);
    window.removeEventListener("touchstart", unlockAudio, true);
  };

  const unlockAudio = () => {
    if (audioContext.state === "closed") {
      removeUnlockListeners();
      return;
    }

    void audioContext
      .resume()
      .catch(() => {})
      .finally(() => {
        if (audioContext.state === "running") removeUnlockListeners();
      });
  };

  unlockListenersRegistered = true;
  window.addEventListener("pointerdown", unlockAudio, true);
  window.addEventListener("keydown", unlockAudio, true);
  window.addEventListener("touchstart", unlockAudio, true);
}

async function loadAudioBuffer(
  audioContext: AudioContext,
  soundEffect: SoundEffectName,
) {
  const cachedAudioBuffer = audioBufferCache.get(soundEffect);
  if (cachedAudioBuffer) return cachedAudioBuffer;

  const existingLoader = audioBufferLoaders.get(soundEffect);
  if (existingLoader) return existingLoader;

  const loader = fetch(SOUND_EFFECTS[soundEffect].src)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((decodedAudio) => {
      audioBufferCache.set(soundEffect, decodedAudio);
      audioBufferLoaders.delete(soundEffect);
      return decodedAudio;
    })
    .catch((error) => {
      audioBufferLoaders.delete(soundEffect);
      throw error;
    });

  audioBufferLoaders.set(soundEffect, loader);

  return loader;
}

function startPlayback(
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  gain: number,
) {
  if (audioContext.state === "closed") return;

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = gain;

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  source.start();
}

export function SoundEffectsProvider({ children }: PropsWithChildren) {
  const mutedSetting = useControlsStore((state) => state.muted);
  const [muted, setMuted] = useState(mutedSetting);
  const mutedRef = useRef(muted);
  const muteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (muteTimeoutRef.current) clearTimeout(muteTimeoutRef.current);

    muteTimeoutRef.current = setTimeout(() => {
      mutedRef.current = mutedSetting;
      setMuted(mutedSetting);
    }, mutedSetting ? 300 : 0);

    return () => {
      if (muteTimeoutRef.current) clearTimeout(muteTimeoutRef.current);
    };
  }, [mutedSetting]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    registerAudioUnlock(audioContext);

    SOUND_EFFECT_NAMES.forEach((soundEffect) => {
      void loadAudioBuffer(audioContext, soundEffect).catch((error) => {
        console.error(`Error loading "${soundEffect}" sound effect`, error);
      });
    });
  }, []);

  const contextValue = useMemo<SoundEffectsContextValue>(
    () => ({
      play: (soundEffect) => {
        if (mutedRef.current) return;

        const audioContext = getAudioContext();
        if (!audioContext) return;

        registerAudioUnlock(audioContext);

        const effectConfig = SOUND_EFFECTS[soundEffect];

        const playAudioBuffer = (audioBuffer: AudioBuffer) => {
          if (mutedRef.current) return;

          const start = () => {
            if (mutedRef.current) return;
            startPlayback(audioContext, audioBuffer, effectConfig.gain);
          };

          if (audioContext.state !== "running") {
            void audioContext
              .resume()
              .then(() => {
                if (audioContext.state === "running") start();
              })
              .catch(() => {});
            return;
          }

          start();
        };

        const cachedAudioBuffer = audioBufferCache.get(soundEffect);

        if (cachedAudioBuffer) {
          playAudioBuffer(cachedAudioBuffer);
          return;
        }

        void loadAudioBuffer(audioContext, soundEffect)
          .then(playAudioBuffer)
          .catch((error) => {
            console.error(`Error playing "${soundEffect}" sound effect`, error);
          });
      },
    }),
    [],
  );

  return (
    <SoundEffectsContext.Provider value={contextValue}>
      {children}
    </SoundEffectsContext.Provider>
  );
}
