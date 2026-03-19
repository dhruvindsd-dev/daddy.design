"use client";
import BouncyMenu from "@/components/ui/bouncy-menu";
import Icon from "@/components/ui/icon";
import Controller from "./controls";
import AniSpeedToggle from "./animation-speed-toggle";
import { openInNewTab } from "@/lib/utils";
import { DOMAIN, ROUTES } from "@/lib/const";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getCmd } from "@/components/ui/cli-install";
import useComponentActionsStore from "@/stores/component-actions-store";

const ComponentActions = () => {
  const { component, prompt, code } = useComponentActionsStore();
  const [tab] = useLocalStorage<any>({ key: "cli-tab" });

  function handleCopy(text?: string) {
    if (!text || !navigator.clipboard) return;
    navigator.clipboard.writeText(text);
  }

  const cmd = component
    ? getCmd(`${ROUTES.r}/${component}-demo.json`, true)[tab?.label || "npm"]
    : undefined;

  return (
    <>
      <div className="fixed bottom-5 left-4 z-102 sm:bottom-12 sm:left-12">
        <Controller />
      </div>
      <div className="fixed right-4 bottom-5 z-102 sm:right-12 sm:bottom-12">
        <BouncyMenu
          items={[
            {
              icon: <Icon name="CLI" />,
              label: "Copy CLi Cmd",
              kbd: "C",
              action: "copy",
              click: () => handleCopy(cmd),
            },
            {
              icon: <Icon name="PROMPT" />,
              label: "Copy Prompt",
              action: "copy",
              click: () => handleCopy(prompt),
            },
            {
              icon: <Icon name="CODE" />,
              label: "Copy Code",
              action: "copy",
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
              click: () => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              },
            },
          ]}
        />
      </div>
      <AniSpeedToggle />
    </>
  );
};
export default ComponentActions;
