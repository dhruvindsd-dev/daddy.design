"use client";

import { AnimatePresence, motion, type MotionProps, useReducedMotion } from "motion/react";
import { useState } from "react";

type CardId = 1 | 2 | 3;

const CARDS: Record<CardId, { label: string; body: string }> = {
  1: {
    label: "Concept",
    body: "A softer entry keeps this first card feeling intentional. The ripple now only shows up when the content actually swaps, instead of constantly competing for attention.",
  },
  2: {
    label: "System",
    body: "The gradient is now tied to the keyed card transition, so the visual accent reinforces the change itself rather than looping in the background forever.",
  },
  3: {
    label: "Launch",
    body: "Reduced motion is respected too, which keeps the interaction polished without forcing motion on people who have that preference enabled.",
  },
};

const ANI: MotionProps = {
  variants: {
    initial: { y: -12, scale: 0.985, opacity: 0, filter: "blur(14px)" },
    animate: {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.38,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
    exit: {
      y: 8,
      scale: 0.99,
      opacity: 0,
      filter: "blur(10px)",
      transition: {
        duration: 0.28,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const Index = () => {
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState<CardId>(1);
  const [showRipple, setShowRipple] = useState(false);

  const card = CARDS[state];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-gray-100 px-6">
      <div className="relative size-[400px] overflow-hidden rounded-[24px] bg-white leading-[1.6] font-medium ">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.article
            {...ANI}
            key={state}
            className="relative h-full"
            onAnimationStart={() => {
              if (!shouldReduceMotion) {
                setShowRipple(true);
              }
            }}
          >
            {showRipple ? (
              <motion.div
                key={`ripple-${state}`}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.16,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                <div
                  className="radial-gradient-animation"
                  onAnimationEnd={() => setShowRipple(false)}
                />
              </motion.div>
            ) : null}

            <div className="relative z-[1] flex h-full flex-col justify-between p-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.26em] text-black/30">
                  {card.label}
                </p>
                <p className="max-w-[32ch] text-balance text-[15px] text-black/50">
                  {card.body}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-black/22">
                <span>Card {state}</span>
                <span>Transition-linked ripple</span>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <button
        className="mt-4 flex h-[32px] items-center justify-center rounded-3xl bg-amber-500 px-4 py-2 text-[13px] font-semibold text-white"
        onClick={() =>
          setState((current) => (current === 3 ? 1 : ((current + 1) as CardId)))
        }
      >
        Change
      </button>
    </div>
  );
};
export default Index;
