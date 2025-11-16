"use client";
import useAudio from "@/hooks/use-audio";
import usePress from "@/hooks/use-press";
import { cn } from "@/lib/utils";
import { FADE_IN_ANI } from "@/lib/variants";
import { motion, useMotionTemplate, useSpring, Variants } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

interface Props {
  items: {
    icon: React.ReactNode;
    label: string;
    click?: () => void;
  }[];
  deps?: any[];
  dur?: {
    press?: number;
    pressNormalze?: number;
    hoverNormalze?: number;
    springDur?: number;
    springBounce?: number;
  };
}

const ClipVariants: Variants = {
  initial: { y: 10, opacity: 0, filter: "blur(4px)" },
  animate: (active) => ({
    y: active ? -10 : 0,
    opacity: 1,
    filter: "blur(0px)",
  }),
  exit: { opacity: 0, y: 5, filter: "blur(4px)" },
};

const BouncyMenu = ({ items, dur, deps }: Props) => {
  const d = {
    press: dur?.press ?? 34,
    pressNormalze: dur?.pressNormalze ?? 300,
    hoverNormalze: dur?.hoverNormalze ?? 600,
    sDur: (dur?.springDur ?? 400) / 1000,
    sBoun: dur?.springBounce ?? 0.3,
  };

  const { play } = useAudio("/assets/click2.mp3");
  const { isActive, handlePress } = usePress(d.press);
  const [hover, setHover] = useState<Props["items"][number]>();
  const [jump, setJump] = useState(true);
  const [counter, setCounter] = useState(0);

  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const activeTooltipItemRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const activeMenuItemRef = useRef<HTMLButtonElement>(null);

  const x = useSpring(0, { bounce: d.sBoun, visualDuration: d.sDur });

  const l = useSpring(0, { bounce: d.sBoun, visualDuration: d.sDur });
  const r = useSpring(0, { bounce: d.sBoun, visualDuration: d.sDur });
  const clip = useMotionTemplate`inset(0 ${r}% 0 ${l}% round 10px)`;

  useEffect(() => {
    let tmt: NodeJS.Timeout;
    if (!hover?.label) tmt = setTimeout(() => setJump(true), d.hoverNormalze);
    else setJump(false);

    return () => tmt && clearTimeout(tmt);
  }, [d.hoverNormalze, hover?.label]);

  useEffect(() => {
    if (!tooltipContainerRef.current || !activeTooltipItemRef.current) return;
    if (!activeMenuItemRef.current || !menuContainerRef.current) return;

    const iRect = activeMenuItemRef.current.getBoundingClientRect();
    const cRect = activeTooltipItemRef.current.getBoundingClientRect();
    const { offsetLeft, offsetWidth } = activeTooltipItemRef.current;
    const container = tooltipContainerRef.current;
    const clipLeft = offsetLeft;
    const clipRight = offsetLeft + offsetWidth;

    const rPerc = Math.abs(100 - (clipRight / container.offsetWidth) * 100);
    const lPerc = Math.abs((clipLeft / container.offsetWidth) * 100);

    // handling the main container offset
    const actualX = iRect.left + iRect.width / 2;
    const targetX = cRect.left + cRect.width * 0.5;
    const finalX = actualX - targetX + x.get();

    // check if it's the first time

    if (jump) {
      x.jump(finalX);
      l.jump(lPerc);
      r.jump(rPerc);
    } else {
      x.set(finalX);
      l.set(lPerc);
      r.set(rPerc);
    }
  }, [hover?.label, jump]);

  function handleEnter(i: Props["items"][number]) {
    setHover(i);
  }

  useEffect(() => {
    if (!counter) return;
    handleClick();
  }, [deps?.toString(), counter]);

  function handleLeave() {
    setHover(undefined);
  }

  function handleClick() {
    play();
    handlePress();
  }

  return (
    <motion.div
      {...FADE_IN_ANI}
      className="group relative w-fit"
      style={
        {
          "--dp": `${d.press}ms`,
          "--dpn": `${d.pressNormalze}ms`,
          "--dhn": `${d.hoverNormalze}ms`,
        } as React.CSSProperties
      }
      ref={menuContainerRef}
    >
      <motion.div
        variants={ClipVariants}
        initial="initial"
        animate={hover ? "animate" : "exit"}
        custom={isActive}
        className="pointer-events-none absolute -top-10 left-0 select-none"
      >
        <motion.div
          style={{ x, clipPath: clip }}
          className="bg-ds-primary flex items-center gap-0 px-4"
          ref={tooltipContainerRef}
        >
          {items.map((i) => (
            <div
              key={i.label}
              ref={i.label === hover?.label ? activeTooltipItemRef : null}
              className={cn(
                "text-ds-primary-text relative rounded-[10px] px-2.5 py-2 font-mono text-xs font-semibold whitespace-nowrap",
                "origin-top transition-all duration-[var(--dpn)] ease-[ease]",
                isActive &&
                  i.label === hover?.label &&
                  "translate-y-[-4px]! scale-x-[0.90] scale-y-[1.05]! duration-[var(--dp)]!",
              )}
            >
              {i.label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="bg-ds-primary-shadow absolute inset-0 translate-y-1 rounded-full" />
      <div
        className={cn(
          "bg-ds-primary relative z-10 w-fit rounded-full p-1.5 transition-all",
          "origin-bottom transition-all duration-[var(--dhn)] ease-[ease]",
          "group-hover:translate-y-[-2px] group-hover:duration-[var(--dpn)]",
          "focus-within:duration-[var(--dpn)]",
          isActive &&
            "translate-y-[4px]! scale-x-[1.05]! scale-y-[0.98]! duration-[var(--dp)]!",
        )}
      >
        <div className="group/wrapper flex w-fit items-center">
          {items.map((i, idx) => (
            <button
              onClick={() => {
                i.click?.();
                setCounter((c) => c + 1);
              }}
              key={i.label}
              ref={i.label === hover?.label ? activeMenuItemRef : null}
              onMouseEnter={() => handleEnter(i)}
              onFocus={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              onBlur={handleLeave}
              className={cn(
                "group/icon text-ds-primary-text relative flex size-8 cursor-pointer items-center justify-center",
                "group-hover/wrapper:text-ds-primary-text-disabled hover:bg-ds-primary-hover hover:text-ds-primary-text",
                "transition-[color] duration-150 ease-[ease]",
                "focus-visible:bg-ds-primary-hover focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:outline-none",
                "border-white/8 hover:border",
                "rounded-[4px]",
                idx === 0 && "rounded-l-2xl",
                idx === items.length - 1 &&
                  "rounded-r-2xl [&>*:first-child]:mr-0.5",
              )}
            >
              {i.icon}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default dynamic(() => Promise.resolve(BouncyMenu), {
  ssr: false,
});
