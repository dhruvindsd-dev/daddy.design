"use client";
import { useState, useEffect } from "react";
import FamilyButton from ".";

const TABS = [
  { name: "Success", value: "success" },
  { name: "Error", value: "error" },
  { name: "Loading", value: "loading" },
] as const;

const FamilyButtonBase = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);

  const handleNext = () => {
    const currentIndex = TABS.findIndex((i) => i.value === tab.value);
    const nextIndex = (currentIndex + 1) % TABS.length;
    setTab(TABS[nextIndex]);
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
