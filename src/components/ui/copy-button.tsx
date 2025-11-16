"use client";
import Icon from "@/components/ui/icon";
import useAudio from "@/hooks/use-audio";
import { cn, throttle } from "@/lib/utils";
import {
    AnimatePresence,
    AnimationOptions,
    motion,
    MotionConfig,
    useAnimate,
    useSpring,
} from "motion/react";
import React, { useEffect, useState } from "react";

const CopyButton = () => {
  const x = useSpring(1, { stiffness: 200, damping: 20 });
  const y = useSpring(1, { stiffness: 200, damping: 20 });
  const { play } = useAudio("/assets/click2.mp3");
  const tmt = React.useRef<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<"normal" | "copied">("normal");
  const [counter, setCounter] = useState(0);
  const [scope, animate] = useAnimate();

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

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (tmt.current) clearTimeout(tmt.current);
    setCounter((c) => c + 1);
    setState("copied");
    ani();
    splash(e);
    tmt.current = setTimeout(() => {
      x.set(1);
      y.set(1);
    }, 34);
  };

  async function splash(e: React.MouseEvent<HTMLButtonElement>) {
    if (!scope.current) return;
    const t: AnimationOptions = { duration: 0.4, ease: "easeOut" };
    const wrapper = scope.current.querySelector("#splash-wrapper");

    const numElements = random(5, 10);
    const elements: HTMLElement[] = [];

    const bounding = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX ? `${e.clientX - bounding.left}px` : "50%";
    const clickY = e.clientY ? `${e.clientY - bounding.top}px` : "50%";

    for (let i = 0; i < numElements; i++) {
      const ele = createEle(clickX, clickY);
      wrapper.appendChild(ele);
      elements.push(ele);
    }

    await Promise.all(
      elements.map((e) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = random(25, 50);

        const xOffset = Math.cos(angle) * distance;
        const yOffset = Math.sin(angle) * distance;

        return animate(e, { x: xOffset, y: yOffset, scale: 0 }, t);
      }),
    );

    elements.forEach((ele) => ele.remove());
  }

  function createEle(x: string, y: string) {
    const ele = document.createElement("div");
    ele.className = cn("absolute rounded-full bg-ds-primary");

    const size = random(8, 15);

    Object.assign(ele.style, {
      height: `${size}px`,
      width: `${size}px`,
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
    });

    return ele;
  }

  return (
    <button
      ref={scope}
      onClick={(e) => handlePress(e)}
      className="relative cursor-pointer"
    >
      <span id="splash-wrapper" className="absolute inset-0" />

      <MotionConfig>
        <motion.div
          style={{ scaleX: x, scaleY: y }}
          className={cn(
            "relative flex h-8 origin-bottom items-center justify-center gap-1 overflow-hidden rounded-full px-3.5 text-sm leading-none",
            "border-ds-border bg-ds-bg-100 text-ds-text-1 border font-semibold",
          )}
        >
          <AnimatePresence initial={false}>
            {state === "copied" && (
              <motion.span
                initial={{ opacity: 0, filter: "blur(4px)", scale: 0.8 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(4px)", scale: 0.8 }}
                className="absolute inset-1 flex items-center justify-center rounded-full bg-ds-bg-100"
              >
                Copied!
              </motion.span>
            )}
          </AnimatePresence>

          <motion.span
            animate={{
              opacity: state === "normal" ? 1 : 0,
              scale: state === "normal" ? 1 : 0.8,
              filter: state === "normal" ? "blur(0px)" : "blur(4px)",
            }}
            className="inline-flex items-center gap-1"
          >
            <Icon name="COPY" size={14} />
            Copy
          </motion.span>
        </motion.div>
      </MotionConfig>
    </button>
  );
};

export default CopyButton;

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
