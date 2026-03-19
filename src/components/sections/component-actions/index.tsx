"use client";
import BouncyMenu from "@/components/ui/bouncy-menu";
import { getCmd } from "@/components/ui/cli-install";
import Icon from "@/components/ui/icon";
import useAudio from "@/hooks/use-audio";
import useComponentName from "@/hooks/use-component-name";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DOMAIN, ROUTES } from "@/lib/const";
import { COMP_METADATA } from "@/registry";
import { openInNewTab } from "@/lib/utils";
import useComponentActionsStore from "@/stores/component-actions-store";
import useDurationStore from "@/stores/duration-store";
import { useRouter } from "next/navigation";
import AniSpeedToggle from "./animation-speed-toggle";
import Controller from "./controls";
import SpeedAni from "./controls/speed-ani";

const ComponentActions = () => {
  const { component, prompt, code } = useComponentActionsStore();
  const { duration, setDuration } = useDurationStore();
  const [tab] = useLocalStorage<any>({ key: "cli-tab" });
  const mobile = useMediaQuery("sm", true);
  const activeComp = useComponentName();
  const router = useRouter();
  const speedUp = useAudio("speed-up");
  const speedDown = useAudio("speed-down");

  const sidebarComponents = Object.values(COMP_METADATA).map((item) => item.slug);

  function handleNext() {
    if (!sidebarComponents.length) return;

    const currentComp = activeComp || component;
    const currentIdx = currentComp
      ? sidebarComponents.indexOf(currentComp)
      : -1;

    const nextIdx =
      currentIdx >= 0 ? (currentIdx + 1) % sidebarComponents.length : 0;
    router.push(`/components/${sidebarComponents[nextIdx]}`);
  }

  function handleCopy(text?: string) {
    if (!text || !navigator.clipboard) return;
    navigator.clipboard.writeText(text);
  }

  const cmd = component
    ? getCmd(`${ROUTES.r}/${component}-demo.json`, true)[tab?.label || "npm"]
    : undefined;

  const items = [
    {
      icon: <Icon name="CLI" />,
      label: "Copy CLi Cmd",
      kbd: "C",
      action: "copy" as const,
      click: () => handleCopy(cmd),
    },
    {
      icon: <Icon name="PROMPT" />,
      label: "Copy Prompt",
      action: "copy" as const,
      click: () => handleCopy(prompt),
    },
    {
      icon: <Icon name="CODE" />,
      label: "Copy Code",
      action: "copy" as const,
      click: () => handleCopy(code),
    },
    {
      icon: <Icon name="V0" />,
      label: "Open in V0",
      click: () =>
        component &&
        openInNewTab(
          `https://v0.dev/chat/api/open?url=${DOMAIN}/r/${component}-demo.json`,
        ),
    },
    {
      icon: <Icon name="CIRCLE_ARROW_RIGHT" />,
      label: "Next",
      kbd: "N",
      click: handleNext,
    },
  ];

  const speedItem = {
    icon: <SpeedAni speed={duration === 1 ? "1x" : "0.5x"} />,
    label: "Speed Toggle",
    disableSound: true,
    click: () => {
      if (duration === 1) {
        speedDown();
        setDuration(3);
      } else {
        speedUp();
        setDuration(1);
      }
    },
  };

  const rightItems = mobile ? [speedItem, ...items.slice(3)] : items;

  return (
    <>
      <div className="fixed bottom-5 left-4 z-102 sm:bottom-12 sm:left-12">
        <Controller />
      </div>
      <div className="fixed right-4 bottom-5 z-102 sm:right-12 sm:bottom-12">
        <BouncyMenu deps={[duration]} items={rightItems} />
      </div>
      {!mobile && <AniSpeedToggle />}
    </>
  );
};
export default ComponentActions;
