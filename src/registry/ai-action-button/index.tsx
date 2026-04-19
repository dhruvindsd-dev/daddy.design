"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type HTMLMotionProps,
  type MotionProps,
  type Transition,
  useReducedMotion,
} from "motion/react";
import { TbCircleCheckFilled } from "react-icons/tb";

export const AI_ACTION_BUTTON_STATES = [
  "idle",
  "thinking",
  "success",
] as const;

export type AiActionButtonState = (typeof AI_ACTION_BUTTON_STATES)[number];

export const DEFAULT_AI_ACTION_BUTTON_LABELS: Record<
  AiActionButtonState,
  ReactNode
> = {
  idle: "Ask Ai",
  thinking: "Thinking",
  success: "Results Ready",
};

export interface AiActionButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  state?: AiActionButtonState;
  labels?: Partial<Record<AiActionButtonState, ReactNode>>;
  transition?: Transition;
  glowDuration?: number;
}

const BUTTON_SURFACE: Record<AiActionButtonState, string> = {
  idle: "bg-gray-100/80 text-slate-900 border border-transparent",
  thinking: "bg-gray-100 text-sky-600 border border-transparent",
  success: "bg-emerald-100/60 text-emerald-700 border border-transparent",
};

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  duration: 0.4,
  bounce: 0.2,
};

const textAnimation: MotionProps = {
  variants: {
    initial: { opacity: 0, x: 0, filter: "blur(6px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: 0, filter: "blur(4px)" },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const iconAnimation: MotionProps = {
  variants: {
    initial: { opacity: 0, scale: 0.7, rotate: -60 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.7, rotate: 60 },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const BORDER_MASK_STYLE: CSSProperties = {
  WebkitMaskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
  maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
};

const RADIAL_MASK_STYLE: CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(50% 45% at 50% 50%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%)",
  maskImage:
    "radial-gradient(50% 45% at 50% 50%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%)",
};

const VERTICAL_MASK_STYLE: CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
  maskImage:
    "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
};

const HALF_BEAM_STYLE: CSSProperties = {
  clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
};

export function getNextAiActionButtonState(state: AiActionButtonState) {
  const currentIndex = AI_ACTION_BUTTON_STATES.indexOf(state);

  return AI_ACTION_BUTTON_STATES[
    (currentIndex + 1) % AI_ACTION_BUTTON_STATES.length
  ];
}

function ThinkingIcon({ animate }: { animate: boolean }) {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="10"
        className="stroke-sky-200"
        strokeWidth="4"
        fill="none"
      />
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        className="stroke-sky-500"
        strokeWidth="4"
        fill="none"
        strokeDasharray="62.33185307179586"
        strokeDashoffset="43.66456772333291"
        strokeLinecap="round"
        animate={
          animate
            ? {
                rotate: [0, 360 * 3],
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeOut",
                },
              }
            : { rotate: 0 }
        }
      />
    </svg>
  );
}

function LightBeam({
  active,
  mirrored = false,
}: {
  active: boolean;
  mirrored?: boolean;
}) {
  return (
    <div
      data-active={active}
      aria-hidden="true"
      className={[
        "ai-action-button__lights absolute inset-0",
        mirrored ? "scale-x-[-1]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...VERTICAL_MASK_STYLE, ...HALF_BEAM_STYLE }}
    />
  );
}

function renderIcon(state: AiActionButtonState, animateThinking: boolean) {
  if (state === "thinking") {
    return <ThinkingIcon animate={animateThinking} />;
  }

  if (state === "success") {
    return <TbCircleCheckFilled size={22} aria-hidden="true" />;
  }

  return null;
}

export default function AiActionButton({
  state = "idle",
  labels,
  transition = DEFAULT_TRANSITION,
  glowDuration = 1,
  className,
  style,
  type = "button",
  ...props
}: AiActionButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const animateThinking = state === "thinking" && !prefersReducedMotion;
  const icon = renderIcon(state, animateThinking);
  const mergedLabels = {
    ...DEFAULT_AI_ACTION_BUTTON_LABELS,
    ...labels,
  };

  return (
    <MotionConfig transition={transition}>
      <div
        className="relative flex items-center justify-center"
        style={
          {
            "--ai-action-button-glow-duration": `${glowDuration}s`,
          } as CSSProperties
        }
      >
        <div
          className="pointer-events-none absolute -inset-0.5"
          aria-hidden="true"
        >
          <div
            className="relative h-full w-full rounded-full"
            style={BORDER_MASK_STYLE}
          >
            <LightBeam active={animateThinking} />
            <LightBeam active={animateThinking} mirrored />
          </div>
        </div>

        <div
          className="pointer-events-none absolute -inset-x-8 -inset-y-10"
          aria-hidden="true"
        >
          <div
            className="relative h-full w-full blur-[8px]"
            style={RADIAL_MASK_STYLE}
          >
            <LightBeam active={animateThinking} />
            <LightBeam active={animateThinking} mirrored />
          </div>
        </div>

        <motion.button
          {...props}
          type={type}
          layout
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          className={[
            "relative z-10 inline-flex h-16 items-center justify-center overflow-hidden px-6 backdrop-blur-sm sm:px-7",
            BUTTON_SURFACE[state],
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ borderRadius: 9999, ...style }}
        >
          <motion.div className="relative flex items-center gap-3" layout>
            <AnimatePresence initial={false} mode="popLayout">
              {icon ? (
                <motion.span
                  key={`${state}-icon`}
                  className="flex size-6 shrink-0 items-center justify-center"
                  layout="position"
                  {...iconAnimation}
                >
                  {icon}
                </motion.span>
              ) : null}

              <motion.span
                key={`${state}-label`}
                className="text-center text-lg font-semibold tracking-[-0.02em] text-nowrap sm:text-xl"
                layout="position"
                aria-live="polite"
                {...textAnimation}
              >
                {mergedLabels[state]}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </motion.button>

        <style jsx global>{`
          .ai-action-button__lights {
            background: conic-gradient(
              from var(--ai-action-button-deg-start) at 50% 50%,
              #005bf6 0deg,
              #b0c6e9 var(--ai-action-button-stop-2),
              #feca00 var(--ai-action-button-stop-3),
              #ff1c11 var(--ai-action-button-stop-4),
              #ff00ea var(--ai-action-button-stop-5),
              #ffa2fbcc var(--ai-action-button-stop-6),
              transparent var(--ai-action-button-stop-7) 324deg,
              #95c1ffa1 349deg,
              #005bf6 360deg
            );
            opacity: 0;
            transition: opacity 180ms ease-out;
          }

          .ai-action-button__lights[data-active="true"] {
            animation: var(--ai-action-button-glow-duration, 1s)
              cubic-bezier(0.26, 0.94, 0.6, 1)
              ai-action-button-lights-conic-stops infinite;
          }

          .ai-action-button__lights[data-active="false"] {
            animation: none;
            opacity: 0;
          }

          @media (prefers-reduced-motion: reduce) {
            .ai-action-button__lights[data-active="true"] {
              animation: none;
              opacity: 0.35;
            }
          }

          @keyframes ai-action-button-lights-conic-stops {
            0% {
              opacity: 0;
            }

            10%,
            30% {
              opacity: 1;
            }

            100% {
              opacity: 0;
              --ai-action-button-deg-start: var(
                --ai-action-button-deg-end,
                30deg
              );
              --ai-action-button-stop-2: 6deg;
              --ai-action-button-stop-3: 11deg;
              --ai-action-button-stop-4: 17deg;
              --ai-action-button-stop-5: 40deg;
              --ai-action-button-stop-6: 90deg;
              --ai-action-button-stop-7: 120deg;
            }
          }

          @property --ai-action-button-deg-start {
            syntax: "<angle>";
            inherits: false;
            initial-value: 180deg;
          }

          @property --ai-action-button-stop-2 {
            syntax: "<angle>";
            inherits: false;
            initial-value: 16deg;
          }

          @property --ai-action-button-stop-3 {
            syntax: "<angle>";
            inherits: false;
            initial-value: 30deg;
          }

          @property --ai-action-button-stop-4 {
            syntax: "<angle>";
            inherits: false;
            initial-value: 43deg;
          }

          @property --ai-action-button-stop-5 {
            syntax: "<angle>";
            inherits: false;
            initial-value: 59deg;
          }

          @property --ai-action-button-stop-6 {
            syntax: "<angle>";
            inherits: false;
            initial-value: 72deg;
          }

          @property --ai-action-button-stop-7 {
            syntax: "<angle>";
            inherits: false;
            initial-value: 84deg;
          }
        `}</style>
      </div>
    </MotionConfig>
  );
}
