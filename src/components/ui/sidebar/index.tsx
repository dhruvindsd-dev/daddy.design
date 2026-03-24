"use client";
import useAudio from "@/hooks/use-audio";
import { useIsMobile } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { FADE_IN_ANI } from "@/lib/variants";
import { COMP_METADATA } from "@/registry";
import useControlsStore from "@/stores/controls-store";
import {
    AnimatePresence,
    motion,
    MotionConfig,
    MotionProps,
} from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const { sidebar_visible, trigger } = useControlsStore();
  const isM = useIsMobile();
  const path = usePathname();
  const hover = useAudio("hover");
  const click = useAudio("click");
  const sidebar_close = useAudio("toggle_off");

  const activeComp = path.split("/").pop();
  const data = Object.values(COMP_METADATA);

  function handleClick() {
    if (isM) {
      trigger("sidebar_visible");
      sidebar_close();
    } else click();
  }
  return (
    <div className="fixed top-1/2 left-0 z-101 flex -translate-y-1/2 flex-col gap-8 sm:left-12">
      <motion.div {...FADE_IN_ANI}>
        <MotionConfig
          transition={{ type: "spring", visualDuration: 0.3, bounce: 0.3 }}
        >
          <AnimatePresence initial={false}>
            {sidebar_visible && (
              <motion.div
                className={cn(
                  "origin-left rounded-r-xl border will-change-transform",
                  "bg-ds-bg-100/98 border-ds-border/60 sm:border-0 sm:bg-transparent",
                )}
                {...ANI}
              >
                <div
                  className={cn(
                    "hide-scrollbar max-h-[50svh] overflow-auto sm:max-h-[430px]",
                    "px-5 py-5 sm:p-0",
                    data.length > 8 && "scroll-fade-y",
                  )}
                >
                  <div className="flex h-fit flex-col items-start gap-1.5 pr-5">
                    {data.map((i, idx) => (
                      <motion.div
                        className="group origin-left select-none"
                        key={idx}
                        whileTap={isM ? {} : { scale: 0.95, x: -2 }}
                        transition={{
                          type: "spring",
                          visualDuration: 0.15,
                          bounce: 0.2,
                        }}
                      >
                        <Link
                          href={`/components/${i.slug}`}
                          onMouseEnter={() => !isM && hover()}
                          onClick={handleClick}
                          className={cn(
                            "text-ds-text-disabled hover:text-ds-text-3 block cursor-pointer text-sm font-medium transition-colors duration-100",
                            "sm:group-hover:translate-x-1 transition-transform ease-out duration-200",
                            i.slug === activeComp && "text-ds-text-2!",
                          )}
                        >
                          {i.title}
                        </Link>
                      </motion.div>
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
