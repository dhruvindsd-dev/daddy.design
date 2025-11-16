"use client";
import Icon from "@/components/ui/icon";
import useAudio from "@/hooks/use-audio";
import { cn, throttle } from "@/lib/utils";
import { AnimatePresence, motion, MotionProps, useSpring } from "motion/react";
import React, { useEffect } from "react";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ANI: MotionProps = {
  variants: {
    initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const FileName = ({ children, className }: Props) => {
  const x = useSpring(1, { stiffness: 200, damping: 20 });
  const y = useSpring(1, { stiffness: 200, damping: 20 });
  const { play } = useAudio("/assets/click2.mp3");
  const tmt = React.useRef<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<"normal" | "copied">("normal");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (state === "normal") return;
    const t = setTimeout(() => {
      setState("normal");
    }, 2000);

    return () => clearTimeout(t);
  }, [counter, state]);

  const ani = throttle(() => {
    play();
    x.set(1.2);
    y.set(0.4);
  }, 34);

  const handlePress = () => {
    if (tmt.current) clearTimeout(tmt.current);
    setCounter((c) => c + 1);
    setState("copied");
    ani();
    tmt.current = setTimeout(() => {
      x.set(1);
      y.set(1);
    }, 34);
  };

  return (
    <button
      className="group/inline-code"
      onMouseLeave={() => {
        setState("normal");
      }}
      onClick={handlePress}
    >
      <motion.div
        style={{ scaleX: x, scaleY: y }}
        className={cn(
          "relative origin-bottom cursor-pointer overflow-hidden rounded-md font-mono text-xs font-bold select-none",
          "bg-ds-bg-100 text-ds-text-2 border-ds-border border px-1.5 py-1",
          className,
        )}
      >
        {children}
        <div
          className={cn(
            "pointer-events-none absolute top-0 right-0 flex h-full items-center opacity-0 transition-opacity duration-300 group-hover/inline-code:opacity-100",
            "from-ds-bg-100 bg-gradient-to-l from-60% to-transparent pr-2 pl-6",
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={state} {...ANI}>
              {state === "normal" ? (
                <Icon name="COPY" size={10} />
              ) : (
                <Icon name="CHECK" size={10} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </button>
  );
};
export default FileName;
