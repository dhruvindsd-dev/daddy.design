"use client";
import useAudio from "@/hooks/use-audio";
import { cn } from "@/lib/utils";
import { useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onClick?: () => void;
}

const DUR = 1;
const RandomButton = ({ onClick }: Props) => {
  const [isHeldDown, setIsHeldDown] = useState(false);
  const [scope, animate] = useAnimate();
  const release = useAudio("click-bounce");
  const hover = useAudio("hover");
  const completeRef = useRef(false);

  useEffect(() => {
    if (!isHeldDown) return;
    completeRef.current = false;
    const tmt = setTimeout(() => {
      onClick?.();
      setIsHeldDown(false);
      animate(
        "#button-progress",
        { clipPath: "inset(0% 0% 100% 0%)" },
        { duration: 0.4, type: "spring", bounce: 0 },
      );
      completeRef.current = true;
      release();
    }, DUR * 1000);

    return () => {
      clearTimeout(tmt);
      if (!completeRef.current) {
        animate(
          "#button-progress",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { duration: 0.2 },
        );
      }
    };
  }, [isHeldDown]);

  useEffect(() => {
    if (!isHeldDown) return;
    const controls = animate([
      [
        "#button-progress",
        { opacity: 1, clipPath: "inset(0% 0% 0% 100%)" },
        { duration: 0 },
      ],
      [
        "#button-progress",
        { clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"] },
        { duration: DUR },
      ],
    ]);

    return () => {
      controls.stop();
    };
  }, [isHeldDown]);

  function handlePress() {
    setIsHeldDown(true);
    hover();
  }

  function handleRelease() {
    setIsHeldDown(false);
  }

  return (
    <div
      ref={scope}
      className="group relative cursor-pointer select-none"
      onMouseEnter={() => hover()}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onTouchCancel={handleRelease}
    >
      <div className="animation" />
      <div
        className={cn(
          "relative z-10 h-24 will-change-transform",
          "group-hover:-translate-y-2 group-hover:[transition-duration:250ms]",
          "border-border flex items-center justify-center overflow-hidden rounded-2xl border bg-white",
          "[transition:all_600ms_cubic-bezier(0.645,0.045,0.355,1)]",
          isHeldDown && "translate-y-0! [transition-duration:34ms]!",
        )}
      >
        <div
          id="button-progress"
          aria-hidden
          className="absolute inset-0 z-10 h-full w-full origin-top-left rounded-2xl bg-white opacity-0 mix-blend-difference"
          style={{ clipPath: "inset(0% 100% 0% 0%)" }}
        />

        <p className="relative text-center text-xl font-extrabold md:text-3xl">
          Hold To Load Random Component
        </p>
      </div>
      <div className="absolute inset-[0.5px] rounded-2xl bg-black/80" />
    </div>
  );
};
export default RandomButton;
