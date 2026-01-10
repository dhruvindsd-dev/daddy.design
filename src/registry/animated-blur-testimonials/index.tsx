"use client";

import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    motion,
    MotionConfig,
    MotionProps,
} from "motion/react";
import React, { useEffect, useState } from "react";
import { TbArrowNarrowLeft, TbArrowNarrowRight } from "react-icons/tb";
import useMeasure from "react-use-measure";

const ani: MotionProps = {
  variants: {
    initial: (c: number) => ({
      transform: `translateX(${20 * c}px)`,
      filter: "blur(4px)",
      opacity: 0,
    }),
    animate: () => ({
      transform: "translateX(0px)",
      filter: "blur(0px)",
      opacity: 1,
    }),
    exit: (c: number) => ({
      transform: `translateX(${-20 * c}px)`,
      filter: "blur(4px)",
      opacity: 0,
    }),
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

export interface TestimonialInterface {
  message: React.ReactNode;
  avatar: { src?: string; fallback?: string };
}

interface Props {
  data: TestimonialInterface[];
  light?: boolean;
  delayDuration?: number;
  _duration?: number; //
}

function AnimatedBlurTestimonials({
  data,
  delayDuration = 8,
  _duration = 0.4,
}: Props) {
  const [count, setCount] = useState(0);
  const [dir, setDir] = useState(1);
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    const int = setInterval(() => {
      setCount((count) => (count + 1) % data.length);
      setDir(1);
    }, delayDuration * 1000);
    return () => clearInterval(int);
  }, [count, data.length, delayDuration]);

  return (
    <MotionConfig
      transition={{ type: "spring", duration: _duration, bounce: 0 }}
    >
      <div className="grid gap-4 select-none">
        <div className="flex -space-x-1">
          {data.map((i, idx) => {
            const mask = createAvatarMask();
            return (
              <motion.button
                onClick={() => setCount(idx)}
                key={idx}
                aria-label={`Select testimonial ${idx + 1}`}
                style={{ WebkitMaskImage: mask, maskImage: mask }}
                className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-full first:mask-none!"
                animate={{ opacity: count === idx ? 1 : 0.4 }}
                whileHover={{
                  opacity: count === idx ? 1 : 0.6,
                  transition: { duration: 0 },
                }}
                initial={false}
              >
                {i.avatar.src ? (
                  <img
                    src={i.avatar.src}
                    draggable={false}
                    alt="testimonial image"
                    className="absolute inset-0"
                  />
                ) : (
                  i.avatar.fallback
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={false}
          animate={{ height: bounds.height || "auto" }}
          className={cn(
            "border-[0.5px] border-black/[0.05] bg-neutral-50",
            "relative z-10 overflow-hidden rounded-xl",
          )}
        >
          <div ref={ref} className="h-fit p-4">
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.p
                {...ani}
                custom={dir}
                key={count}
                className="font-medium text-black/60"
                aria-live="polite"
              >
                {data[count].message}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="grid grid-cols-[60%_1fr] px-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: data.length }).map((_, i) => (
              <motion.button
                key={`progress-${i}`}
                role="button"
                onClick={() => setCount(i)}
                initial={{ width: i === count ? 64 : 18 }}
                animate={{ width: i === count ? 64 : 18 }}
                className={cn(
                  "h-[6px] cursor-pointer overflow-hidden rounded-xl bg-black/10",
                )}
              >
                {count === i && (
                  <motion.div
                    className="float-right h-full rounded-xl bg-black/40"
                    transition={{ duration: delayDuration }}
                    initial={{ width: "100%" }}
                    animate={{ width: ["100%", "0%"] }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-end text-black/50">
            <button
              onClick={() => {
                setCount((count) => (count - 1 + data.length) % data.length);
                setDir(-1);
              }}
              className="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-black/5 active:scale-[0.95]"
              aria-label="Previous testimonial"
            >
              <TbArrowNarrowLeft size={24} />
            </button>
            <button
              onClick={() => {
                setCount((count) => (count + 1) % data.length);
                setDir(1);
              }}
              className="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-black/5 active:scale-[0.95]"
              aria-label="Next testimonial"
            >
              <TbArrowNarrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

function createAvatarMask() {
  const size = 32;
  const space = 4;
  const border = 3;
  const diff = space + border;
  return `radial-gradient( ${size}px ${size - diff - 2}px at ${(diff / size) * 100 - 100}% 50%, transparent 98%, black 100%)`;
}

export default AnimatedBlurTestimonials;
