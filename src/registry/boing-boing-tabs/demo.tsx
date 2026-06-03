"use client";

import useDurationStore from "@/stores/duration-store";
import { useState } from "react";
import BoingBoingTabs, { type BoingBoingTabsItem } from ".";

type BoingBoingTabValue = "Home" | "About" | "Contact";

const TABS: BoingBoingTabsItem<BoingBoingTabValue>[] = [
  { label: "Home", value: "Home" },
  { label: "About", value: "About" },
  { label: "Contact", value: "Contact" },
];

function BoingBoingTabsDemo() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { duration } = useDurationStore();

  return (
    <BoingBoingTabs
      items={TABS}
      value={activeTab}
      setValue={setActiveTab}
      dur={{
        springDur: 420 * duration,
        hoverNormalize: 560 * duration,
      }}
    />
  );
}

export default BoingBoingTabsDemo;
