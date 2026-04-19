"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import AiActionButton, {
  AI_ACTION_BUTTON_STATES,
  DEFAULT_AI_ACTION_BUTTON_LABELS,
  getNextAiActionButtonState,
  type AiActionButtonState,
} from ".";
import useDurationStore from "@/stores/duration-store";

const CONTROLS = AI_ACTION_BUTTON_STATES.map((value) => ({
  value,
  label: DEFAULT_AI_ACTION_BUTTON_LABELS[value],
}));

function AiActionButtonDemo() {
  const [state, setState] = useState<AiActionButtonState>("idle");
  const { duration } = useDurationStore();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((currentState) => getNextAiActionButtonState(currentState));
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-[400px] flex-col items-center justify-center gap-12 py-8">
      <AiActionButton
        state={state}
        glowDuration={duration}
        transition={{ type: "spring", duration: 0.4 * duration, bounce: 0.2 }}
        onClick={() =>
          setState((currentState) => getNextAiActionButtonState(currentState))
        }
      />

      <div className="flex flex-wrap items-center justify-center gap-3 text-black/30">
        {CONTROLS.map((item) => (
          <button
            type="button"
            key={item.value}
            onClick={() => setState(item.value)}
            className="relative cursor-pointer overflow-hidden rounded-full border border-neutral-100 px-4 py-1 text-sm font-semibold"
          >
            {state === item.value ? (
              <motion.div
                className="absolute inset-0 bg-neutral-100"
                layoutId="ai-action-button-demo-control"
                transition={{ type: "spring", duration: 0.3 * duration, bounce: 0.2 }}
              />
            ) : null}
            <span className="relative z-10 text-black/60">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AiActionButtonDemo;
