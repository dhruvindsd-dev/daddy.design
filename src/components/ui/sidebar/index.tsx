"use client";
import { cn } from "@/lib/utils";
import { FADE_IN_ANI } from "@/lib/variants";
import useControlsStore from "@/stores/controls-store";
import {
    AnimatePresence,
    motion,
    MotionConfig,
    MotionProps,
} from "motion/react";
import dynamic from "next/dynamic";

interface Props {}

const DATA = [
  "Dynamic Scroll Island TOC",
  "Sub Select Toggle",
  "Cool checkbox",
  "Animated Blur Testimonials",
  "Family status indicator",
  "Squishy 3D Button",
  "Gooey Menu",
  "Swipeable sheets",
  "Shared Layout Tabs",
  "Community Interaction",
  "Dynamic Scroll Island TOC",
  "Sub Select Toggle",
  "Cool checkbox",
  "Animated Blur Testimonials",
  "Family status indicator",
  "Squishy 3D Button",
  "Gooey Menu",
  "Swipeable sheets",
  "Shared Layout Tabs",
  "Community Interaction",
  "Dynamic Scroll Island TOC",
  "Sub Select Toggle",
  "Cool checkbox",
  "Animated Blur Testimonials",
  "Family status indicator",
  "Squishy 3D Button",
  "Gooey Menu",
  "Swipeable sheets",
  "Shared Layout Tabs",
  "Community Interaction",
  "Dynamic Scroll Island TOC",
  "Sub Select Toggle",
  "Cool checkbox",
  "Animated Blur Testimonials",
  "Family status indicator",
  "Squishy 3D Button",
  "Gooey Menu",
  "Swipeable sheets",
  "Shared Layout Tabs",
  "Community Interaction",
];

const ANI: MotionProps = {
  variants: {
    visible: { opacity: 1, x: 0, scaleX: 1, scaleY: 1, filter: "blur(0px)" },
    hidden: {
      opacity: 0,
      x: -72,
      scaleX: 1.2,
      scaleY: 0.6,
      filter: "blur(0px)",
    },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
};

const Sidebar = ({}: Props) => {
  const { sidebar_visible } = useControlsStore();
  return (
    <div className="fixed top-1/2 left-12 z-1000000 flex -translate-y-1/2 flex-col gap-8">
      <motion.div {...FADE_IN_ANI}>
        <MotionConfig
          transition={{ type: "spring", visualDuration: 0.3, bounce: 0.3 }}
        >
          <AnimatePresence initial={false}>
            {sidebar_visible && (
              <motion.div
                className="origin-left will-change-transform"
                {...ANI}
              >
                <div className="hide-scrollbar scroll-fade-y max-h-[430px] overflow-auto">
                  <div className="flex flex-col items-start gap-1.5">
                    {DATA.map((i, idx) => (
                      <button
                        key={idx}
                        className={cn(
                          "text-ds-text-disabled hover:text-ds-text-3 cursor-pointer text-sm font-medium tracking-tight transition-colors duration-100",
                        )}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionConfig>
      </motion.div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Sidebar), {
  ssr: false,
});
