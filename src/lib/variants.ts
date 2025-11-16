import { MotionProps } from "motion/react";

export const FADE_IN_ANI: MotionProps = {
  variants: {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  },
  initial: "hidden",
  animate: "visible",
  transition: { duration: 0.2 },
};
