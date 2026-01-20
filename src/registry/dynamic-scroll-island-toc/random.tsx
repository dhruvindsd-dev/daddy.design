"use client";
import { useState } from "react";
import DynamicScrollIslandTOC, { TOC_INTERFACE } from ".";
import useDurationStore from "@/stores/duration-store";

export const TOC_DATA: TOC_INTERFACE[] = [
  { name: "All" },
  { name: "Grass", value: "grass" },
  { name: "Llama", value: "llama" },
  { name: "Cat", value: "cat" },
  { name: "Dog", value: "dog" },
];

const DynamicScrollIslandTocDemo = () => {
  const { duration } = useDurationStore();
  const [active, _setActive] = useState(TOC_DATA[0]);

  function setActive(val: TOC_INTERFACE) {
    setTimeout(() => _setActive(val), 400);
  }

  return (
    <DynamicScrollIslandTOC
      data={TOC_DATA}
      value={active}
      setValue={setActive}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.6 * duration,
      }}
    />
  );
};
export default DynamicScrollIslandTocDemo;
