"use client";
import classes from "./styles.module.css";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
    motion,
    useMotionTemplate,
    useScroll,
    useTransform,
} from "motion/react";
import { useRef } from "react";

const ComponentBg = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end 50%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const b = useTransform(scrollYProgress, [0.6, 1], [0, 12]);
  const blur = useMotionTemplate`blur(${b}px)`;

  return (
    <div className="absolute top-0 right-0 left-0 h-[70vh] w-screen sm:h-screen">
      <motion.div
        style={{ opacity, filter: blur }}
        className="relative h-full w-full"
      >
        <div
          ref={ref}
          className="bg-ds-bg-100 border-ds-border/60 absolute inset-2 rounded-2xl border sm:inset-6 sm:rounded-[32px]"
        />
        <button
          className={cn(
            "text-ds-text-3 pointer-events-none hidden items-center gap-1 text-xs font-medium tracking-tight select-none sm:flex",
            "absolute bottom-25 left-1/2 -translate-x-1/2 cursor-pointer sm:bottom-[66px]",
            classes.vertical_mask_animation,
          )}
        >
          Scroll for more info{" "}
          <span>
            <Icon name="CHEVRON_DOWN_DOUBE_MICRO" size={8} />
          </span>
        </button>
      </motion.div>
    </div>
  );
};
export default ComponentBg;
