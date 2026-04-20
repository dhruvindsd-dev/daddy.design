"use client";

import { cn } from "@/lib/utils";
import SharedLayoutTabs, {
  type SharedLayoutTabsItem,
  type SharedLayoutTabValue,
} from ".";
import { useState } from "react";

const VIEW_TABS = [
  { label: "List View", value: "list" },
  { label: "Card View", value: "card" },
  { label: "Pack View", value: "pack" },
] as const satisfies { label: string; value: SharedLayoutTabValue }[];

const DATA: SharedLayoutTabsItem[] = [
  {
    img: "https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=70&w=500",
    title: "Renaissance Art",
    price: 0.855,
    cur: "eth",
    id: 209,
  },
  {
    img: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=70&w=500",
    title: "Vintage Collection",
    price: 1.25,
    cur: "eth",
    id: 210,
  },
  {
    img: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=70&w=500",
    title: "The Phantom Horseman",
    price: 0.95,
    cur: "eth",
    id: 211,
  },
  {
    img: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?q=70&w=500",
    title: "The Golden Hour",
    price: 1.75,
    cur: "eth",
    id: 212,
  },
];

function SharedLayoutTabsDemo() {
  const [view, setView] = useState<(typeof VIEW_TABS)[number]>(VIEW_TABS[0]);

  return (
    <div className="w-full px-6 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <div className="flex items-center justify-center gap-3 text-black/60">
          {VIEW_TABS.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => setView(item)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                view.value === item.value
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-black/60 hover:bg-neutral-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <SharedLayoutTabs tab={view.value} data={DATA} />
      </div>
    </div>
  );
}

export default SharedLayoutTabsDemo;
