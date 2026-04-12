"use client";

import { AnimatePresence, motion, MotionProps } from "motion/react";
import { useState } from "react";

const ANI: MotionProps = {
  variants: {
    initial: { scale: 0.9, opacity: 0, filter: "blur(20px)" },
    animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
    exit: { scale: 0.9, opacity: 0, filter: "blur(20px)" },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const Index = () => {
  const [state, setstate] = useState<1 | 2 | 3>(1);
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-gray-100 px-6">
      <div className="relative size-[400px] overflow-hidden rounded-[24px] bg-white leading-[1.6] font-medium">
        <AnimatePresence mode="popLayout">
          <motion.div {...ANI} key={state} className="h-full">
            <div className="radial-gradient-animation absolute inset-0 " />
            <p className="p-6 text-black/40">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod at
              debitis animi necessitatibus, aliquid placeat cumque totam ab,
              aut, perspiciatis optio? Perspiciatis repudiandae optio,
              dignissimos illo ex id corporis error voluptatibus eum
              exercitationem! Id accusantium facilis molestiae maxime dolor
              pariatur, minus, voluptatibus dolore aut, et a similique incidunt
              dicta voluptatum!
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        className="mt-4 flex h-[32px] items-center justify-center rounded-3xl bg-amber-500 px-4 py-2 text-[13px] font-semibold text-white"
        onClick={() => setstate(state === 3 ? 1 : ((state + 1) as 1 | 2 | 3))}
      >
        Change
      </button>
    </div>
  );
};
export default Index;
