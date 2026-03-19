"use client";
import Tabs from "@/components/ui/tabs";
import useAudio from "@/hooks/use-audio";
import useComponentName from "@/hooks/use-component-name";
import { COMP_DATA } from "@/registry";
import useDurationStore from "@/stores/duration-store";
import { AnimatePresence, motion, MotionProps } from "motion/react";

const DURATIONS = [
  { value: 1, label: "1x" },
  { value: 3, label: "0.5x" },
];

const ANI: MotionProps = {
  variants: {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
};

const AniSpeedToggle = () => {
  const { duration, setDuration } = useDurationStore();
  const compName = useComponentName();
  const value = DURATIONS.find((d) => d.value === duration) || DURATIONS[0];

  const speedUp = useAudio("speed-up");
  const speedDown = useAudio("speed-down");

  const data = compName ? COMP_DATA[compName] : null;

  const showToggle = !!!data?.diaableSpeedToggle;

  return (
    <div className="absolute top-4 right-4 z-102 flex flex-col gap-3 sm:top-12 sm:right-12">
      <AnimatePresence initial={false}>
        {showToggle && (
          <motion.div {...ANI} key="ani-speed-toggle">
            <Tabs
              deps={[duration]}
              items={DURATIONS}
              value={value}
              disableSound
              setValue={(v) => {
                if (v.value === 1) speedUp();
                else speedDown();
                setDuration(v.value);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AniSpeedToggle;
