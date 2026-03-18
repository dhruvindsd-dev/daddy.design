"use client";

import useAudio from "@/hooks/use-audio";
import { useHotkeys } from "@/hooks/use-hotkeys";
import useControlsStore from "@/stores/controls-store";
import useDurationStore from "@/stores/duration-store";

const KbdHandler = () => {
  const { trigger, sidebar_visible } = useControlsStore();
  const { duration, setDuration } = useDurationStore();
  const speedUp = useAudio("speed-up");
  const speedDown = useAudio("speed-down");
  const playToggleOn = useAudio("toggle_on");
  const playToggleOff = useAudio("toggle_off");
  const playClickBounce = useAudio("click-bounce");

  useHotkeys([
    [
      "b",
      () => {
        if (sidebar_visible) playToggleOff();
        else playToggleOn();
        trigger("sidebar_visible");
      },
    ],
    [
      "m",
      () => {
        playClickBounce();
        trigger("muted");
      },
    ],
    [
      "t",
      () => {
        const next = duration === 1 ? 3 : 1;
        if (next === 1) speedUp();
        else speedDown();
        setDuration(next);
      },
    ],
  ]);

  return null;
};
export default KbdHandler;
