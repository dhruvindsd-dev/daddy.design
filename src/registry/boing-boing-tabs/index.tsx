"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  type MotionProps,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

export interface BoingBoingTabsItem<
  T extends string | number = string | number,
> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface BoingBoingTabsProps<T extends string | number> {
  items: BoingBoingTabsItem<T>[];
  value: BoingBoingTabsItem<T>;
  setValue: (val: BoingBoingTabsItem<T>) => void;
  size?: "default" | "lg";
  variant?: "default" | "light";
  hoverNudge?: number;
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

const buttonClassName = cva(
  cn(
    "relative flex cursor-pointer items-center justify-center text-sm font-bold whitespace-nowrap",
    "focus-visible:bg-white/15 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-40",
  ),
  {
    variants: {
      size: {
        default: "h-7 px-3",
        lg: "h-9 px-4 text-base",
      },
      type: {
        default: "rounded-full",
        clip: "rounded-none",
      },
    },
  },
);

const shadowClassName = cva(
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

const enterAnimation: MotionProps = {
  variants: {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
  initial: false,
  animate: "animate",
};

const touchQuery = "(hover: none), (pointer: coarse)";

export default function BoingBoingTabs<T extends string | number>({
  items,
  value,
  setValue,
  dur,
  hoverNudge = 4,
  size = "default",
  variant = "default",
  deps,
  className,
  ariaLabel = "Boing boing tabs",
}: BoingBoingTabsProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  const timings = useMemo(
    () => ({
      press: dur?.press ?? 34,
      pressNormalize: shouldReduceMotion ? 0 : (dur?.pressNormalize ?? 300),
      hoverNormalize: shouldReduceMotion ? 0 : (dur?.hoverNormalize ?? 600),
      springDur: shouldReduceMotion ? 0 : (dur?.springDur ?? 400) / 1000,
      springBounce: shouldReduceMotion ? 0 : (dur?.springBounce ?? 0.3),
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
  const container = useRef<HTMLDivElement>(null);
  const activeEle = useRef<HTMLDivElement>(null);
  const hasInitializedClip = useRef(false);
  const buttonRefs = useRef(new Map<T, HTMLButtonElement>());
  const depsKey = deps?.map(String).join("|");
  const prevDeps = useRef(depsKey);

  const left = useSpring(0, {
    bounce: timings.springBounce,
    visualDuration: timings.springDur,
  });
  const right = useSpring(100, {
    bounce: timings.springBounce,
    visualDuration: timings.springDur,
  });

  const clip = useMotionTemplate`inset(0 ${right}% 0 ${left}% round 20px)`;
  const isLight = variant === "light";

  useEffect(() => {
    const { leftPercent, rightPercent } = getClipValues();

    if (!hasInitializedClip.current) {
      left.jump(leftPercent);
      right.jump(rightPercent);
      hasInitializedClip.current = true;
      return;
    }

    left.set(leftPercent);
    right.set(rightPercent);
  }, [value.value]);

  useEffect(() => {
    if (prevDeps.current === depsKey) return;

    prevDeps.current = depsKey;
    handlePress();
  }, [depsKey, handlePress]);

  function getClipValues() {
    if (!container.current || !activeEle.current) {
      return { leftPercent: 0, rightPercent: 100 };
    }

    const { offsetLeft, offsetWidth } = activeEle.current;
    const { offsetWidth: containerWidth } = container.current;

    const leftPercent = Math.abs((offsetLeft / containerWidth) * 100);
    const rightPercent = Math.abs(
      100 - ((offsetLeft + offsetWidth) / containerWidth) * 100,
    );

    return { leftPercent, rightPercent };
  }

  function selectItem(item: BoingBoingTabsItem<T>) {
    if (item.disabled) return;

    handlePress();
    setValue(item);
  }

  function handleHover(index: number) {
    if (isTouch || hoverNudge <= 0) return;

    const hovered = items[index];
    if (!hovered || hovered.disabled) return;

    const currentIndex = items.findIndex((item) => item.value === value.value);
    if (index === currentIndex || currentIndex === -1) return;

    const direction = index < currentIndex ? -1 : 1;
    const { leftPercent, rightPercent } = getClipValues();
    const distance = Math.abs(currentIndex - index) - 1;
    const nudgeDistance = hoverNudge + distance * 2;

    if (direction === -1) left.set(leftPercent - nudgeDistance);
    else right.set(rightPercent - nudgeDistance);
  }

  function normalizeClip() {
    const { leftPercent, rightPercent } = getClipValues();
    left.set(leftPercent);
    right.set(rightPercent);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const enabledItems = items.filter((item) => !item.disabled);
    if (!enabledItems.length) return;

    const currentIndex = enabledItems.findIndex(
      (item) => item.value === value.value,
    );
    const fallbackIndex = Math.max(currentIndex, 0);
    let nextItem: BoingBoingTabsItem<T> | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextItem = enabledItems[(fallbackIndex + 1) % enabledItems.length];
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextItem =
        enabledItems[
          (fallbackIndex - 1 + enabledItems.length) % enabledItems.length
        ];
    } else if (event.key === "Home") {
      nextItem = enabledItems[0];
    } else if (event.key === "End") {
      nextItem = enabledItems[enabledItems.length - 1];
    }

    if (!nextItem) return;

    event.preventDefault();
    selectItem(nextItem);
    requestAnimationFrame(() => {
      buttonRefs.current.get(nextItem.value)?.focus();
    });
  }

  return (
    <motion.div
      className={cn("group relative w-fit select-none", className)}
      style={
        {
          "--bbt-press": `${timings.press}ms`,
          "--bbt-press-normalize": `${timings.pressNormalize}ms`,
          "--bbt-hover-normalize": `${timings.hoverNormalize}ms`,
        } as CSSProperties
      }
    >
      <div className={shadowClassName({ variant })} />

      <div
        className={cn(
          isLight
            ? "border-ds-border bg-ds-primary-light border"
            : "bg-ds-primary",
          "relative z-10 w-fit rounded-full p-1",
          "origin-bottom transition-transform duration-[var(--bbt-hover-normalize)] ease-out",
          "group-hover:translate-y-[-2px] group-hover:duration-[var(--bbt-press-normalize)]",
          "focus-within:translate-y-[-2px] focus-within:duration-[var(--bbt-press-normalize)]",
          "motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:focus-within:translate-y-0",
          isActive &&
            !shouldReduceMotion &&
            "translate-y-[4px]! scale-x-[1.05]! scale-y-[0.98]! duration-[var(--bbt-press)]!",
        )}
      >
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="group/wrapper relative flex w-fit items-center"
        >
          <motion.div
            ref={container}
            {...enterAnimation}
            aria-hidden="true"
            className={cn(
              "text-ds-primary-light-text pointer-events-none absolute left-1/2 z-50 flex w-fit -translate-x-1/2 items-center px-4",
              isLight ? "bg-ds-primary-light-active" : "bg-ds-primary-light",
            )}
            style={{ clipPath: clip }}
          >
            {items.map((item) => (
              <div
                key={`${item.label}-clip`}
                ref={item.value === value.value ? activeEle : null}
                className={buttonClassName({ type: "clip", size })}
              >
                {item.label}
              </div>
            ))}
          </motion.div>

          {items.map((item, index) => {
            const isSelected = item.value === value.value;

            return (
              <button
                key={item.label}
                ref={(node) => {
                  if (node) buttonRefs.current.set(item.value, node);
                  else buttonRefs.current.delete(item.value);
                }}
                type="button"
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                disabled={item.disabled}
                onClick={() => selectItem(item)}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={normalizeClip}
                onFocus={() => handleHover(index)}
                onBlur={normalizeClip}
                className={buttonClassName({
                  type: "default",
                  size,
                  className: isLight
                    ? "text-ds-primary-light-text-disabled"
                    : "text-ds-primary-text-disabled",
                })}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function usePress(duration = 34) {
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
