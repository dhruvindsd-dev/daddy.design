"use client";
import useAudio from "@/hooks/use-audio";
import usePress from "@/hooks/use-press";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const ButtonClassName = cva(
  "relative z-10 flex h-11 items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold transition-all",
  {
    variants: {
      type: {
        default: "bg-ds-primary text-ds-primary-text",
        light: "bg-ds-primary-light text-ds-primary-text-light",
      },
    },
  },
);

const ShadowClassName = cva("absolute inset-0 translate-y-1 rounded-full", {
  variants: {
    type: {
      default: "bg-ds-primary-shadow",
      light: "bg-ds-primary-light-shadow",
    },
  },
});

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "default" | "light";
  dur?: {
    press?: number;
    pressNormalze?: number;
    hoverNormalze?: number;
  };
  className?: string;
}

const BouncyButton = ({
  children,
  onClick,
  disabled = false,
  type = "default",
  dur,
  className,
}: Props) => {
  const d = {
    press: dur?.press ?? 34,
    pressNormalze: dur?.pressNormalze ?? 300,
    hoverNormalze: dur?.hoverNormalze ?? 600,
  };

  const { play } = useAudio("/assets/click2.mp3");
  const { isActive, handlePress } = usePress(d.press);

  const handleClick = () => {
    if (disabled) return;
    play();
    handlePress();
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className="focus-visible:ring-ds-primary relative w-fit ring-offset-2 focus-visible:ring-1 focus-visible:outline-none"
      style={
        {
          "--dp": `${d.press}ms`,
          "--dpn": `${d.pressNormalze}ms`,
          "--dhn": `${d.hoverNormalze}ms`,
        } as React.CSSProperties
      }
    >
      <div
        className={ShadowClassName({
          type,
        })}
      />
      <motion.div
        className={ButtonClassName({
          type,
          className: cn(
            // animation classes
            "origin-bottom transition-all duration-[var(--dhn)] ease-[ease]",
            "hover:translate-y-[-2px] hover:duration-[var(--dpn)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isActive &&
              "translate-y-[4px]! scale-x-[1.05]! scale-y-[0.98]! duration-[var(--dp)]!",
            className,
          ),
        })}
      >
        {children}
      </motion.div>
    </motion.button>
  );
};

export default dynamic(() => Promise.resolve(BouncyButton), {
  ssr: false,
});
