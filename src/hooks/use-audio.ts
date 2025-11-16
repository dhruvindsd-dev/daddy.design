import useControlsStore from "@/stores/controls-store";
import { useRef, useEffect, useState } from "react";

export default function useAudio(url: string) {
  const { muted: _m } = useControlsStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const [muted, setMuted] = useState(_m);
  const tmt = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (_m) tmt.current = setTimeout(() => setMuted(true), 300);
    else setMuted(false);
    return () => {
      if (tmt.current) clearTimeout(tmt.current);
    };
  }, [_m]);

  useEffect(() => {
    // @ts-expect-error webkitAudioContext fix
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();

    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        audioContextRef.current!.decodeAudioData(arrayBuffer),
      )
      .then((decodedAudio) => {
        audioBufferRef.current = decodedAudio;
      })
      .catch((err) => console.error("Error loading audio", err));
  }, [url]);

  const play = () => {
    if (!audioContextRef.current || !audioBufferRef.current || muted) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;

    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = 0.8;

    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    source.start();
  };

  return { play };
}
