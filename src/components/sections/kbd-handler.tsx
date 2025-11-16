"use client";

import { useHotkeys } from "@/hooks/use-hotkeys";
import useControlsStore from "@/stores/controls-store";

const KbdHandler = () => {
  const { trigger } = useControlsStore();
  useHotkeys([
    ["b", () => trigger("sidebar_visible")],
    ["m", () => trigger("muted")],
  ]);

  return null;
};
export default KbdHandler;
