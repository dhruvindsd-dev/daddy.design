"use client";
import { useState, useEffect } from "react";
import FamilyButton from ".";
import { TabItem } from "@/components/ui/tabs";

const TABS: TabItem[] = [
  { name: "Success", value: "success" },
  { name: "Error", value: "error" },
  { name: "Loading", value: "loading" },
];

const FamilyButtonBase = () => {
  const [tab, setTab] = useState(TABS[0]);

  const handleNext = () => {
    setTab((prev) => {
      const currentIndex = TABS.findIndex((tab) => tab.value === prev.value);
      const nextIndex = (currentIndex + 1) % TABS.length;
      return TABS[nextIndex];
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTab((prevTab) => {
        const currentIndex = TABS.findIndex(
          (tab) => tab.value === prevTab.value,
        );
        const nextIndex = (currentIndex + 1) % TABS.length;
        return TABS[nextIndex];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [tab.value]);

  return (
    <FamilyButton onClick={handleNext} variant={tab.value}>
      Submit
    </FamilyButton>
  );
};
export default FamilyButtonBase;
