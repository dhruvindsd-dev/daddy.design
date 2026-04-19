"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import AiActionButton, {
  AI_ACTION_BUTTON_STATES,
  DEFAULT_AI_ACTION_BUTTON_LABELS,
  getNextAiActionButtonState,
  type AiActionButtonState,
} from ".";

const CONTROLS = AI_ACTION_BUTTON_STATES.map((value) => ({
  value,
  label: DEFAULT_AI_ACTION_BUTTON_LABELS[value],
}));

function AiActionButtonDemo() {
  const [state, setState] = useState<AiActionButtonState>("idle");

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
                layoutId="ai-action-button-demo-copy-control"
                transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
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
