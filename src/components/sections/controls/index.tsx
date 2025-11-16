"use client";
import BouncyMenu from "@/components/ui/bouncy-menu";
import Icon from "@/components/ui/icon";
import useControlsStore from "@/stores/controls-store";
import SidebarAni from "./sidebar-ani";
import MuteAni from "./mute-ani";

const Controller = () => {
  const { trigger, sidebar_visible, muted, isHydrated } = useControlsStore();

  return (
    <>
      <BouncyMenu
        deps={[sidebar_visible, muted]}
        items={[
          {
            icon: isHydrated ? <SidebarAni open={sidebar_visible} /> : null,
            label: "Toggle Sidebar",
            click: () => trigger("sidebar_visible"),
          },
          {
            icon: isHydrated ? <MuteAni muted={muted} /> : null,
            label: "Mute",
            click: () => trigger("muted"),
          },
          { icon: <Icon name="X" />, label: "Info" },
        ]}
      />
    </>
  );
};
export default Controller;
