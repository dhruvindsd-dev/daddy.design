"use client";

import { MEDIA_DATA } from "@/registry/media";
import { Masonry } from "masonic";
import dynamic from "next/dynamic";
import Item from "./item";

const AllComponentsView = () => {
  return (
    <div className="relative">
      <Masonry
        items={MEDIA_DATA}
        columnGutter={8}
        columnWidth={400}
        maxColumnWidth={480}
        overscanBy={5}
        render={Item}
      />
    </div>
  );
};

export default AllComponentsView;

export const DynamicAllComponentsView = dynamic(
  () => Promise.resolve(AllComponentsView),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-bg border-border h-[300px] animate-pulse rounded-xl border"
        />
      ))}
    </div>
  );
}
