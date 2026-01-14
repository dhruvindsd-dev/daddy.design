"use client";
import { useState, useEffect } from "react";
import FamilyButton from ".";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { TbPlus } from "react-icons/tb";

const TABS = [
  { name: "Normal", value: undefined },
  { name: "Loading", value: "loading" },
  { name: "Success", value: "success" },
  { name: "Error", value: "error" },
] as const;

const FamilyButtonDemo = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);

  const handleNext = () => {
    setTab((prev) => {
      const currentIndex = TABS.findIndex((tab) => tab.value === prev.value);
      const nextIndex = (currentIndex + 1) % TABS.length;
      return TABS[nextIndex];
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [tab.value]);

  return (
    <div className="relative flex min-h-[400px] flex-col items-center justify-center gap-14 py-8">
      <FamilyButton
        icon={<TbPlus strokeWidth={3.2} />}
        variant={tab.value}
        onClick={handleNext}
      >
        Submit
      </FamilyButton>

      <div className="flex items-center justify-center gap-3 text-black/60">
        {TABS.map((i) => (
          <button
            onClick={() => setTab(i)}
            className={cn(
              "relative flex flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold transition-colors",
              tab.value === i.value && "bg-gray-200",
            )}
            key={i.name}
          >
            {tab.value === i.value && (
              <motion.div
                className="absolute inset-0 bg-white/15 mix-blend-difference"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 5 }}
              />
            )}
            <span className="">{i.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default FamilyButtonDemo;
