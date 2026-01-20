"use client";

import { cn } from "@/lib/utils";
import {
    MotionProps,
    MotionConfig,
    motion,
    AnimatePresence,
    Transition,
} from "motion/react";
import { useEffect, useState } from "react";
import { TbX, TbMenu } from "react-icons/tb";

const blurAni: MotionProps = {
  variants: {
    ini: { filter: "blur(4px)" },
    ani: { filter: "blur(0px)" },
    exit: { filter: "blur(4px)", opacity: 0 },
  },

  initial: "ini",
  animate: "ani",
  exit: "exit",
};

export interface MenuItem {
  icon: React.ReactElement;
  name?: string;
  metadata?: any;
  value?: any;
}

interface Props {
  items: MenuItem[];
  className?: string;
  filterId?: string;
  transition?: Transition;
  onChange?: (item: MenuItem) => void;
  direction?: "left" | "right" | "top" | "bottom";
}

function GooeyMenu({
  items,
  className,
  onChange,
  transition = { type: "spring", duration: 0.5, bounce: 0.3 },
  filterId = "gooey-menu-filter",
  direction = "bottom",
}: Props) {
  const [open, setOpen] = useState(false);

  function handleClick(item: MenuItem) {
    setOpen(false);
    onChange?.(item);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const dir = direction === "left" || direction === "top" ? -1 : 1;

  const fId = filterId;
  const mId = `${fId}-menu`;
  return (
    <MotionConfig transition={transition}>
      <div className="relative">
        <div style={{ filter: `url(#${fId})` }}>
          <div
            id={mId}
            role="menu"
            aria-hidden={!open}
            className="absolute top-0 left-0"
          >
            <div className="relative size-12">
              {items.map((i, idx) => (
                <motion.button
                  key={idx}
                  aria-label={i.name}
                  tabIndex={open ? 0 : -1}
                  role="menuitem"
                  custom={idx}
                  animate={{
                    [axis]: open
                      ? `calc(${100 * dir * (idx + 1)}% + ${-(idx + 1) * dir * 10}px )`
                      : 0,
                  }}
                  className={cn(
                    "absolute inset-0 flex size-12 cursor-pointer items-center justify-center rounded-full",
                    "bg-black text-white [&>svg]:opacity-60 [&>svg]:transition-opacity hover:[&>svg]:opacity-100",
                  )}
                  onClick={() => handleClick(i)}
                >
                  {i.icon}
                  <span className="sr-only">{i.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <button
            className={cn(
              "relative z-10 flex size-12 cursor-pointer items-center justify-center rounded-full bg-black text-white",
              className,
            )}
            onClick={() => setOpen(!open)}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls={mId}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span {...blurAni} key={open ? "open" : "close"}>
                {open ? <TbX /> : <TbMenu />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
        <SvgFilter id={fId} />
      </div>
    </MotionConfig>
  );
}

function SvgFilter({ id }: { id: string }) {
  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0 }}
      className="pointer-events-none"
    >
      <defs>
        <filter id={id}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="4"
            result="blur-sm"
          />
          <feColorMatrix
            in="blur-sm"
            mode="matrix"
            values=" 1 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0 0 0 18 -7 "
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

export default GooeyMenu;
