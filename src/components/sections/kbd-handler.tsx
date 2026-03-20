"use client";

import useAudio from "@/hooks/use-audio";
import useComponentName from "@/hooks/use-component-name";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { COMP_METADATA } from "@/registry";
import useComponentActionsStore from "@/stores/component-actions-store";
import useControlsStore from "@/stores/controls-store";
import useDurationStore from "@/stores/duration-store";
import { useRouter } from "next/navigation";

const KbdHandler = () => {
  const { trigger, sidebar_visible } = useControlsStore();
  const { duration, setDuration } = useDurationStore();
  const { component, incrementNext } = useComponentActionsStore();
  const activeComp = useComponentName();
  const router = useRouter();

  const sidebarComponents = Object.values(COMP_METADATA).map((item) => item.slug);

  function handleNext() {
    if (!sidebarComponents.length) return;
    const currentComp = activeComp || component;
    const currentIdx = currentComp ? sidebarComponents.indexOf(currentComp) : -1;
    const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % sidebarComponents.length : 0;
    playClickBounce();
    incrementNext();
    router.push(`/components/${sidebarComponents[nextIdx]}`);
  }
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
    ["n", () => handleNext()],
  ]);

  return null;
};
export default KbdHandler;
