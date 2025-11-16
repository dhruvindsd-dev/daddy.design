"use client";
import {
    AnimatePresence,
    MotionConfig,
    MotionProps,
    motion,
} from "motion/react";
import Tabs from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/use-local-storage";
import useMeasure from "react-use-measure";
import Loader from "@/components/ui/loader";
import dynamic from "next/dynamic";

const ani: MotionProps = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

const tabs = [
  { label: "CLI", value: "cli" },
  { label: "Vibe Coding", value: "vibe-coding" },
  { label: "Manual", value: "manual" },
];

interface Props {
  cli: React.ReactNode;
  manual: React.ReactNode;
  vibe: React.ReactNode;
}
const InstallationHoc = ({ cli, manual, vibe }: Props) => {
  const [tab, setTab] = useLocalStorage({
    key: "installation-tab",
    defaultValue: tabs[0],
    getInitialValueInEffect: true,
  });
  const [ref, bounds] = useMeasure();
  const height = bounds.height;

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
      <Tabs
        size="lg"
        variant="light"
        hoverNudge={1}
        dur={{ springBounce: 0.2 }}
        items={tabs}
        value={tab}
        setValue={setTab}
      />

      <div className="mb-8"></div>

      <motion.div
        className="relative"
        initial={false}
        animate={{ height: height ? height : "auto" }}
      >
        <div ref={ref} className="h-fit">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={tab.value} {...ani}>
              {tab.value === "cli" && cli}
              {tab.value === "vibe-coding" && vibe}
              {tab.value === "manual" && manual}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  );
};

// export default InstallationHoc;

export default dynamic(() => Promise.resolve(InstallationHoc), {
  ssr: false,
  loading: () => (
    <div className="loading">
      <Loader />
    </div>
  ),
});
