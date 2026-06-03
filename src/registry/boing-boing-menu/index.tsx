"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

export interface BoingBoingMenuItem {
  icon: ReactNode;
  label: string;
  kbd?: string;
  click?: () => void;
  action?: "copy";
  disabled?: boolean;
}

interface BoingBoingMenuProps {
  items: BoingBoingMenuItem[];
  deps?: unknown[];
  className?: string;
  ariaLabel?: string;
  dur?: {
    press?: number;
    pressNormalize?: number;
    hoverNormalize?: number;
    springDur?: number;
    springBounce?: number;
  };
}

const tooltipVariants: Variants = {
  initial: { y: 10, opacity: 0, filter: "blur(4px)" },
  animate: (active: boolean) => ({
    y: active ? -10 : 0,
    opacity: 1,
    filter: "blur(0px)",
  }),
  exit: { opacity: 0, y: 5, filter: "blur(4px)" },
};

const touchQuery = "(hover: none), (pointer: coarse)";

function BoingBoingMenu({
  items,
  dur,
  deps,
  className,
  ariaLabel = "Boing boing menu",
}: BoingBoingMenuProps) {
  const shouldReduceMotion = useReducedMotion();
  const timings = useMemo(
    () => ({
      press: dur?.press ?? 38,
      pressNormalize: dur?.pressNormalize ?? 300,
      hoverNormalize: dur?.hoverNormalize ?? 600,
      springDur: shouldReduceMotion ? 0 : (dur?.springDur ?? 460) / 1000,
      springBounce: shouldReduceMotion ? 0 : (dur?.springBounce ?? 0.36),
    }),
    [
      dur?.hoverNormalize,
      dur?.press,
      dur?.pressNormalize,
      dur?.springBounce,
      dur?.springDur,
      shouldReduceMotion,
    ],
  );

  const isTouch = useIsTouchDevice();
  const { isActive, handlePress } = usePress(timings.press);
  const [hover, setHover] = useState<BoingBoingMenuItem>();
  const [jump, setJump] = useState(true);
  const [counter, setCounter] = useState(0);
  const [copyState, setCopyState] = useState<"normal" | "copied">("normal");
  const [copyLabel, setCopyLabel] = useState<string>();

  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const activeTooltipItemRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const activeMenuItemRef = useRef<HTMLButtonElement>(null);
  const depsKey = deps?.map(String).join("|");
  const prevDeps = useRef(depsKey);

  const x = useSpring(0, {
    bounce: timings.springBounce,
    visualDuration: timings.springDur,
  });
  const left = useSpring(0, {
    bounce: timings.springBounce,
    visualDuration: timings.springDur,
  });
  const right = useSpring(0, {
    bounce: timings.springBounce,
    visualDuration: timings.springDur,
  });
  const clip = useMotionTemplate`inset(0 ${right}% 0 ${left}% round 10px)`;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!hover?.label) {
      timeout = setTimeout(() => setJump(true), timings.hoverNormalize);
    } else {
      setJump(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [hover?.label, timings.hoverNormalize]);

  useEffect(() => {
    if (copyState === "normal") return;

    const timeout = setTimeout(() => {
      setCopyState("normal");
      setCopyLabel(undefined);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copyState, counter]);

  useEffect(() => {
    if (!tooltipContainerRef.current || !activeTooltipItemRef.current) return;
    if (!activeMenuItemRef.current || !menuContainerRef.current) return;

    const itemRect = activeMenuItemRef.current.getBoundingClientRect();
    const contentRect = activeTooltipItemRef.current.getBoundingClientRect();
    const { offsetLeft, offsetWidth } = activeTooltipItemRef.current;
    const container = tooltipContainerRef.current;
    const clipLeft = offsetLeft;
    const clipRight = offsetLeft + offsetWidth;

    const rightPercent = Math.abs(
      100 - (clipRight / container.offsetWidth) * 100,
    );
    const leftPercent = Math.abs((clipLeft / container.offsetWidth) * 100);

    const actualX = itemRect.left + itemRect.width / 2;
    const targetX = contentRect.left + contentRect.width * 0.5;
    const finalX = actualX - targetX + x.get();

    if (jump) {
      x.jump(finalX);
      left.jump(leftPercent);
      right.jump(rightPercent);
    } else {
      x.set(finalX);
      left.set(leftPercent);
      right.set(rightPercent);
    }
  }, [hover?.label, jump, left, right, x]);

  useEffect(() => {
    if (prevDeps.current === depsKey) return;

    prevDeps.current = depsKey;
    handlePress();
  }, [depsKey, handlePress]);

  function handleEnter(item: BoingBoingMenuItem) {
    if (item.disabled) return;
    setHover(item);
  }

  function handleMouseEnter(item: BoingBoingMenuItem) {
    if (isTouch) return;
    handleEnter(item);
  }

  function handleLeave() {
    setHover(undefined);
  }

  function handleClick(item: BoingBoingMenuItem) {
    if (item.disabled) return;

    handlePress();
    item.click?.();
    setCounter((count) => count + 1);
    setCopyLabel(item.label);
    setCopyState(item.action === "copy" ? "copied" : "normal");
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      className={cn("group relative w-fit", className)}
      style={
        {
          "--bb-press": `${timings.press}ms`,
          "--bb-press-normalize": `${timings.pressNormalize}ms`,
          "--bb-hover-normalize": `${timings.hoverNormalize}ms`,
        } as CSSProperties
      }
      ref={menuContainerRef}
    >
      {!isTouch && (
        <motion.div
          variants={tooltipVariants}
          initial="initial"
          animate={hover ? "animate" : "exit"}
          custom={isActive}
          className="pointer-events-none absolute -top-10 left-0 select-none"
          aria-hidden="true"
        >
          <motion.div
            style={{ x, clipPath: clip }}
            className="bg-ds-primary flex items-center gap-0 px-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
            ref={tooltipContainerRef}
          >
            {items.map((item) => (
              <div
                key={item.label}
                ref={item.label === hover?.label ? activeTooltipItemRef : null}
                className={cn(
                  "text-ds-primary-text relative flex items-center gap-2 rounded-[10px] px-2.5 py-2 font-mono text-xs font-semibold whitespace-nowrap",
                  "origin-top transition-transform duration-[var(--bb-press-normalize)] ease-out",
                  isActive &&
                    item.label === hover?.label &&
                    "translate-y-[-4px]! scale-x-[0.95] scale-y-[1.1]! duration-[var(--bb-press)]!",
                )}
              >
                {item.label}
                {item.kbd && (
                  <span className="outline-ds-primary-light/40 flex size-4 items-center justify-center rounded-[4px] text-[10px] outline">
                    {item.kbd}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}

      <div className="bg-ds-primary-shadow absolute inset-0 translate-y-1 rounded-full" />
      <div
        className={cn(
          "bg-ds-primary relative z-10 w-fit rounded-full p-1.5",
          "origin-bottom transition-transform duration-[var(--bb-hover-normalize)] ease-out",
          "group-hover:translate-y-[-2px] group-hover:duration-[var(--bb-press-normalize)]",
          "focus-within:duration-[var(--bb-press-normalize)]",
          isActive &&
            "translate-y-[4px]! scale-x-[1.05]! scale-y-[0.98]! duration-[var(--bb-press)]!",
        )}
      >
        <div
          role="menu"
          aria-label={ariaLabel}
          className="group/wrapper flex w-fit items-center"
        >
          {items.map((item, idx) => {
            const copied =
              copyState === "copied" &&
              copyLabel === item.label &&
              item.action === "copy";

            return (
              <button
                type="button"
                role="menuitem"
                aria-label={item.label}
                disabled={item.disabled}
                onClick={() => handleClick(item)}
                key={item.label}
                ref={item.label === hover?.label ? activeMenuItemRef : null}
                onMouseEnter={() => handleMouseEnter(item)}
                onFocus={() => handleEnter(item)}
                onMouseLeave={handleLeave}
                onBlur={handleLeave}
                className={cn(
                  "group/icon text-ds-primary-text relative flex size-8 cursor-pointer items-center justify-center",
                  "group-hover/wrapper:text-ds-primary-text-disabled hover:bg-ds-primary-hover hover:text-ds-primary-text",
                  "transition-colors duration-150 ease-out",
                  "focus-visible:bg-ds-primary-hover focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:outline-none",
                  "border-white/8 hover:border disabled:pointer-events-none disabled:opacity-40",
                  "rounded-[4px]",
                  idx === 0 && "rounded-l-2xl",
                  idx === items.length - 1 &&
                    "rounded-r-2xl [&>*:first-child]:mr-0.5",
                )}
              >
                <motion.span
                  animate={{
                    opacity: !copied ? 1 : 0,
                    scale: !copied ? 1 : 0.8,
                    filter: !copied ? "blur(0px)" : "blur(4px)",
                  }}
                >
                  {item.icon}
                </motion.span>
                <AnimatePresence initial={false} mode="popLayout">
                  {copied && (
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center gap-1"
                      initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
                      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                      exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
                    >
                      <CheckIcon />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function usePress(duration = 38) {
  const [isActive, setIsActive] = useState(false);
  const lastPressTime = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastPressTime.current < duration) return;

    lastPressTime.current = now;
    setIsActive(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, duration);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isActive, handlePress };
}

function useIsTouchDevice() {
  return useSyncExternalStore(
    subscribeToTouchQuery,
    getTouchSnapshot,
    () => false,
  );
}

function subscribeToTouchQuery(callback: () => void) {
  const media = window.matchMedia(touchQuery);

  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getTouchSnapshot() {
  return window.matchMedia(touchQuery).matches;
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default BoingBoingMenu;
