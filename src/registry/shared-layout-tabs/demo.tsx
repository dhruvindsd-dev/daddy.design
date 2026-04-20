"use client";

import Tabs, { type TabsItem } from "@/components/ui/tabs";
import useDurationStore from "@/stores/duration-store";
import SharedLayoutTabs, {
    type SharedLayoutTabsItem,
    type SharedLayoutTabValue,
} from ".";
import { useState } from "react";

const VIEW_TABS: TabsItem<SharedLayoutTabValue>[] = [
  { label: "List View", value: "list" },
  { label: "Card View", value: "card" },
  { label: "Pack View", value: "pack" },
];

const DATA: SharedLayoutTabsItem[] = [
  {
    img: "https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=90?q=70&w=500w=1200",
    title: "Renaissance Art",
    price: 0.855,
    cur: "eth",
    id: 209,
  },
  {
    img: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=90?q=70&w=500w=1200",
    title: "Vintage Collection",
    price: 1.25,
    cur: "eth",
    id: 210,
  },
  {
    img: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=90?q=70&w=500w=1200",
    title: "The Phantom Horseman",
    price: 0.95,
    cur: "eth",
    id: 211,
  },
  {
    img: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?q=90?q=70&w=500w=1200",
    title: "The Golden Hour",
    price: 1.75,
    cur: "eth",
    id: 212,
  },
];

function SharedLayoutTabsDemo() {
  const [view, setView] = useState<TabsItem<SharedLayoutTabValue>>(
    VIEW_TABS[0],
  );
  const { duration } = useDurationStore();

  return (
    <div className="w-full px-6 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <div className="flex items-center justify-center text-black/60">
          <Tabs items={VIEW_TABS} value={view} setValue={setView} />
        </div>

        <div className="h-[550px] w-[450px] px-6 mx-auto overflow-y-auto flex items-center justify-center">
          <SharedLayoutTabs
            tab={view.value}
            data={DATA}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.4 * duration,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SharedLayoutTabsDemo;
