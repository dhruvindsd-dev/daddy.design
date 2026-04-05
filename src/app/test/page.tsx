"use client";
import CopyButton from "@/components/ui/copy-button";
import { useState } from "react";

const Index = () => {
  const [playing, setPlaying] = useState(false);
  const [queuedReplay, setQueuedReplay] = useState(false);

  const handleClick = () => {
    if (playing) {
      setQueuedReplay(true);
      return;
    }

    setPlaying(true);
  };

  const handleAnimationEnd = () => {
    if (queuedReplay) {
      setQueuedReplay(false);
      setPlaying(false);
      requestAnimationFrame(() => setPlaying(true));
      return;
    }

    setPlaying(false);
  };

  return (
    <div
      className="flex h-screen w-screen items-center justify-center"
      onClick={handleClick}
    >
      <div className="relative flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="radial-mask relative h-full w-full">
            <div
              data-playing={playing}
              onAnimationEnd={handleAnimationEnd}
              className="ai-lights-gradient vertical-linear-mask absolute inset-0"
              style={{
                clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
              }}
            ></div>
            <div
              data-playing={playing}
              className="ai-lights-gradient vertical-linear-mask absolute inset-0 scale-x-[-1]"
              style={{
                clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
              }}
            ></div>
          </div>
        </div>

        <div className="relative z-100 flex h-30 w-100 items-center justify-center ">
          {`${playing ? "Playing" : "Idle"}`}
          <CopyButton />
        </div>
      </div>
    </div>
  );
};
export default Index;
