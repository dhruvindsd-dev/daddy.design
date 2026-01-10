"use client";
import Tabs from "@/components/ui/tabs";
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

  const data = compName ? COMP_DATA[compName] : null;

  const showToggle = !!!data?.diaableSpeedToggle;

  return (
    <div className="absolute top-12 right-12 flex flex-col gap-3">
      <AnimatePresence initial={false} mode="popLayout">
        {showToggle && (
          <motion.div {...ANI} key="ani-speed-toggle">
            <Tabs
              items={DURATIONS}
              value={value}
              setValue={(v) => setDuration(v.value)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AniSpeedToggle;
