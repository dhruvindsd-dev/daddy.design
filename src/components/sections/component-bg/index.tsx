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
    <div className="absolute top-0 right-0 left-0 h-screen w-screen">
      <motion.div
        style={{ opacity, filter: blur }}
        className="relative h-full w-full"
      >
        <div
          ref={ref}
          className="bg-ds-bg-100 border-ds-border/60 absolute inset-6 rounded-[32px] border"
        />
        <div
          className={cn(
            "text-ds-text-3 pointer-events-none flex items-center gap-1 text-xs font-medium tracking-tight select-none",
            "absolute bottom-[66px] left-1/2 -translate-x-1/2",
            classes.vertical_mask_animation,
          )}
        >
          Scroll for more info{" "}
          <div>
            <Icon name="CHEVRON_DOWN_DOUBE_MICRO" size={8} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default ComponentBg;
