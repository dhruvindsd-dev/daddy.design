"use client";

import useAudio from "@/hooks/use-audio";
import usePress from "@/hooks/use-press";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
    useSpring,
    useMotionTemplate,
    motion,
    MotionProps,
} from "motion/react";
import { useEffect, useRef } from "react";

// -------------------------
// Generic Tab Item
// -------------------------
export interface TabsItem<T extends string | number = string | number> {
  value: T;
  label: string;
}

// -------------------------
// Props
// -------------------------
interface TabsProps<T extends string | number> {
  items: TabsItem<T>[];
  value: TabsItem<T>;
  setValue: React.Dispatch<React.SetStateAction<TabsItem<T>>>;

  size?: "default" | "lg";
  variant?: "default" | "light";
  hoverNudge?: number;
  dur?: {
    press?: number;
    pressNormalze?: number;
    hoverNormalze?: number;
    springDur?: number;
    springBounce?: number;
  };
}

// -------------------------
// Styles
// -------------------------
const ButtonClassName = cva(
  cn(
    "relative flex cursor-pointer items-center justify-center text-sm font-bold whitespace-nowrap",
    "focus-visible:bg-white/15 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:outline-none",
  ),
  {
    variants: {
      size: {
        default: "h-6 px-2.5 tracking-tight",
        lg: "h-8 px-3.5",
      },
      type: {
        default: "rounded-full",
        clip: "rounded-none",
      },
      variant: {},
    },
  },
);

const ShadowClassName = cva(
  "absolute inset-0 top-[1px] translate-y-1 rounded-full",
  {
    variants: {
      variant: {
        default: "bg-ds-primary-shadow",
        light: "bg-ds-primary-light-shadow",
      },
    },
  },
);

const ENTER_ANI: MotionProps = {
  variants: {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
  initial: "initial",
  animate: "animate",
};

// -------------------------
// Component
// -------------------------
const Tabs = <T extends string | number>({
  items,
  dur,
  setValue,
  value,
  hoverNudge = 4,
  size = "default",
  variant = "default",
}: TabsProps<T>) => {
  // --------------------------------------------------
  // derived durations
  // --------------------------------------------------
  const d = {
    press: dur?.press ?? 34,
    pressNormalze: dur?.pressNormalze ?? 300,
    hoverNormalze: dur?.hoverNormalze ?? 600,
    sDur: (dur?.springDur ?? 400) / 1000,
    sBoun: dur?.springBounce ?? 0.3,
  };

  const { play } = useAudio("/assets/click2.mp3");
  const { isActive, handlePress } = usePress(d.press);

  const container = useRef<HTMLDivElement>(null);
  const activeEle = useRef<HTMLDivElement>(null);

  const l = useSpring(0, { bounce: d.sBoun, visualDuration: d.sDur });
  const r = useSpring(100, { bounce: d.sBoun, visualDuration: d.sDur });

  const clip = useMotionTemplate`inset(0 ${r}% 0 ${l}% round 20px)`;

  // --------------------------------------------------
  // Clip effect
  // --------------------------------------------------
  useEffect(() => {
    const { lPerc, rPerc } = getClipValues();

    const jump = l.get() === 0 && r.get() === 100;
    if (jump) {
      l.jump(lPerc);
      r.jump(rPerc);
    } else {
      l.set(lPerc);
      r.set(rPerc);
    }
  }, [value.value]);

  // --------------------------------------------------
  // Clip calculations
  // --------------------------------------------------
  function getClipValues() {
    if (!container.current || !activeEle.current)
      return { lPerc: 0, rPerc: 100 };

    const { offsetLeft, offsetWidth } = activeEle.current;
    const c = container.current;

    const lPerc = Math.abs((offsetLeft / c.offsetWidth) * 100);
    const rPerc = Math.abs(
      100 - ((offsetLeft + offsetWidth) / c.offsetWidth) * 100,
    );

    return { lPerc, rPerc };
  }

  // --------------------------------------------------
  // Click Handler
  // --------------------------------------------------
  function onClick(v: TabsItem<T>) {
    play();
    handlePress();
    setValue(v);
  }

  // --------------------------------------------------
  // Hover Nudging
  // --------------------------------------------------
  function handleHover(idx: number) {
    if (hoverNudge <= 0) return;

    const currentIdx = items.findIndex((i) => i.value === value.value);
    if (idx === currentIdx) return;

    const dir = idx < currentIdx ? -1 : 1;
    const { lPerc, rPerc } = getClipValues();

    if (dir === -1) l.set(lPerc - hoverNudge);
    else r.set(rPerc - hoverNudge);
  }

  function normalizeClip() {
    const { lPerc, rPerc } = getClipValues();
    l.set(lPerc);
    r.set(rPerc);
  }

  const isLight = variant === "light";

  // -------------------------
  // Render
  // -------------------------
  return (
    <motion.div
      className="group relative w-fit select-none"
      style={
        {
          "--dp": `${d.press}ms`,
          "--dpn": `${d.pressNormalze}ms`,
          "--dhn": `${d.hoverNormalze}ms`,
        } as React.CSSProperties
      }
    >
      <div className={ShadowClassName({ variant })} />

      <div
        className={cn(
          isLight
            ? "border-ds-border bg-ds-primary-light border"
            : "bg-ds-primary",
          "relative z-10 w-fit rounded-full p-1 transition-all",
          "origin-bottom duration-[var(--dhn)] ease-[ease]",
          "group-hover:translate-y-[-2px] group-hover:duration-[var(--dpn)]",
          "focus-within:translate-y-[-2px] focus-within:duration-[var(--dpn)]",
          isActive &&
            "translate-y-[4px]! scale-x-[1.05]! scale-y-[0.98]! duration-[var(--dp)]!",
        )}
      >
        <div className="group/wrapper relative flex w-fit items-center">
          {/* highlight clip layer */}
          <motion.div
            ref={container}
            {...ENTER_ANI}
            className={cn(
              "text-ds-primary-light-text pointer-events-none absolute left-1/2 z-50 flex w-fit -translate-x-1/2 items-center px-4",
              isLight ? "bg-ds-primary-light-active" : "bg-ds-primary-light",
            )}
            style={{ clipPath: clip }}
          >
            {items.map((i) => (
              <div
                key={`${i.label}-clip`}
                ref={i.value === value.value ? activeEle : null}
                className={ButtonClassName({ type: "clip", size })}
              >
                {i.label}
              </div>
            ))}
          </motion.div>

          {/* actual click buttons */}
          {items.map((i, idx) => (
            <button
              key={i.label}
              onClick={() => onClick(i)}
              onMouseEnter={() => handleHover(idx)}
              onMouseLeave={normalizeClip}
              onFocus={() => handleHover(idx)}
              onBlur={normalizeClip}
              className={ButtonClassName({
                type: "default",
                size,
                className: isLight
                  ? "text-ds-primary-light-text-disabled"
                  : "text-ds-primary-text-disabled",
              })}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Tabs;
