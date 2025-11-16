"use client";
import {
    AnimatePresence,
    motion,
    MotionConfig,
    MotionProps,
} from "motion/react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { useId } from "react";
import Icon from "../icon";
import CopyButton from "../copy-button";

const tabs = [
  { label: "pnpm", value: "pnpm" },
  { label: "npm", value: "npm" },
  { label: "yarn", value: "yarn" },
  { label: "bun", value: "bun" },
];

const ani: MotionProps = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
  },
};

interface Props {
  cmd: string;
  isShadcn?: boolean;
}

export default function CliInstall({ cmd: _cmd, isShadcn }: Props) {
  const id = useId();
  const [tab, setTab] = useLocalStorage({
    key: "cli-tab",
    defaultValue: tabs[0],
    getInitialValueInEffect: false,
  });

  const cmd = getCmd(_cmd, isShadcn)[tab.label || "npm"];
  return (
    <div className="border-ds-border relative grid rounded-[24px] border">
      <div className="relative">
        <div className="relative flex w-fit items-center gap-0 p-3">
          {tabs.map((t) => (
            <button
              onClick={() => setTab(t)}
              className="relative flex h-8 cursor-pointer items-center justify-center px-3.5"
              key={t.label}
            >
              {tab.value === t.value && (
                <motion.div
                  layout
                  layoutId={id}
                  layoutDependency={tab.value}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                  className="border-ds-border bg-ds-bg-100 pointer-events-none absolute inset-0 rounded-full border"
                />
              )}

              <span
                className={cn(
                  "text-ds-text-3 relative z-10 text-sm font-semibold",
                  tab.value === t.value && "text-ds-text-1",
                )}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <CopyButton />
        </div>
      </div>

      <div className="inset-sm border-t-ds-border relative overflow-hidden border-t p-3">
        <div className="hide-scrollbar border-ds-border bg-ds-bg-100 overflow-auto rounded-full border p-3.5">
          <div className="text-ds-text-2 flex w-fit items-center gap-2 font-mono text-sm leading-none font-semibold whitespace-nowrap">
            <MotionConfig
              transition={{ type: "spring", duration: 0.6, bounce: 0 }}
            >
              <Icon name="CLI" size={14} />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div {...ani} key={tab.value} className="">
                  {cmd}
                </motion.div>
              </AnimatePresence>
            </MotionConfig>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 flex items-center p-2.5"></div>
    </div>
  );
}

function getCmd(url: string, isShadcn?: boolean): Record<string, string> {
  if (isShadcn)
    return {
      npm: `npx shadcn@latest add ${url}`,
      pnpm: `pnpm dlx shadcn@latest add ${url}`,
      yarn: `yarn dlx shadcn@latest add ${url}`,
      bun: `bunx shadcn@latest add ${url}`,
    };

  return {
    pnpm: `pnpm add ${url}`,
    npm: `npm install ${url}`,
    yarn: `yarn add ${url}`,
    bun: `bun add ${url}`,
  };
}
