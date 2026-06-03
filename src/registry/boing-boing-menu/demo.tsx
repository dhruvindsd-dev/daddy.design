"use client";

import useDurationStore from "@/stores/duration-store";
import { useMemo } from "react";
import { TbBolt, TbCode, TbCopy, TbDownload, TbShare3 } from "react-icons/tb";
import BoingBoingMenu, { type BoingBoingMenuItem } from ".";

function BoingBoingMenuDemo() {
  const { duration } = useDurationStore();

  const items = useMemo<BoingBoingMenuItem[]>(
    () => [
      {
        icon: <TbBolt size={18} />,
        label: "Boost",
        kbd: "B",
      },
      {
        icon: <TbCopy size={18} />,
        label: "Copy",
        kbd: "C",
        action: "copy",
        click: () => {
          if (!navigator.clipboard) return;
          void navigator.clipboard.writeText("Boing boing menu");
        },
      },
      {
        icon: <TbCode size={18} />,
        label: "Code",
      },
      {
        icon: <TbDownload size={18} />,
        label: "Export",
      },
      {
        icon: <TbShare3 size={18} />,
        label: "Share",
      },
    ],
    [],
  );

  return (
    <BoingBoingMenu
      items={items}
      dur={{
        springDur: 460 * duration,
        hoverNormalize: 600 * duration,
      }}
    />
  );
}

export default BoingBoingMenuDemo;
