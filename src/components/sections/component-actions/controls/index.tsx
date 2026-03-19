"use client";
import BouncyMenu from "@/components/ui/bouncy-menu";
import Icon from "@/components/ui/icon";
import useAudio from "@/hooks/use-audio";
import useControlsStore from "@/stores/controls-store";
import MuteAni from "./mute-ani";
import SidebarAni from "./sidebar-ani";

const Controller = () => {
  const { trigger, sidebar_visible, muted, isHydrated } = useControlsStore();
  const playToggleOn = useAudio("toggle_on");
  const playToggleOff = useAudio("toggle_off");

  const items = [
    {
      icon: isHydrated ? <SidebarAni open={sidebar_visible} /> : null,
      label: "Toggle Sidebar",
      disableSound: true,
      click: () => {
        if (sidebar_visible) playToggleOff();
        else playToggleOn();
        trigger("sidebar_visible");
      },
    },
    {
      icon: isHydrated ? <MuteAni muted={muted} /> : null,
      label: "Mute",
      click: () => trigger("muted"),
    },
    { icon: <Icon name="X" />, label: "Info" },
  ];

  return (
    <>
      <BouncyMenu deps={[sidebar_visible, muted]} items={items} />
    </>
  );
};
export default Controller;
