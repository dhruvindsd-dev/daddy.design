"use client";
import { useState, useEffect } from "react";
import FamilyButton from ".";
import Tabs from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { TbPlus } from "react-icons/tb";

const TABS = [
  { name: "Normal", value: undefined },
  { name: "Loading", value: "loading" },
  { name: "Success", value: "success" },
  { name: "Error", value: "error" },
] as const;

const DURATIONS = [
  { value: 1, label: "1x" },
  { value: 0.5, label: "0.5x" },
];

const FamilyButtonDemo = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [dur, setDur] = useState(DURATIONS[0]);

  const handleNext = () => {
    const currentIndex = TABS.findIndex((i) => i.value === tab.value);
    const nextIndex = (currentIndex + 1) % TABS.length;
    setTab(TABS[nextIndex]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [tab.value]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex-col absolute top-12 right-12 flex gap-3">
        <Tabs items={DURATIONS} value={dur} setValue={setDur} />
      </div>
      <div className="relative flex min-h-[400px] flex-col items-center justify-center gap-14 py-8">
        <FamilyButton
          icon={<TbPlus strokeWidth={3.2} />}
          variant={tab.value}
          onClick={handleNext}
        >
          Submit
        </FamilyButton>

        <div className="flex items-center justify-center gap-3 text-black/30">
          {TABS.map((i) => (
            <button
              onClick={() => setTab(i)}
              className={cn(
                "relative flex flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-neutral-100 px-4 py-1 text-sm font-semibold transition-colors ",
              )}
              key={i.name}
            >
              {tab.value === i.value && (
                <motion.div
                  className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-black/60"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 5 }}
                >
                  {i.name}
                </motion.div>
              )}
              <span className="">{i.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FamilyButtonDemo;
