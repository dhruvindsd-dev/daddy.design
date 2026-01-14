"use client";
import useDurationStore from "@/stores/duration-store";
import GooeyMenu, { MenuItem } from ".";

import { TbHome, TbMail, TbUser, TbSettings } from "react-icons/tb";

const items: MenuItem[] = [
  { icon: <TbHome size={18} />, name: "Home", value: "home" },
  { icon: <TbMail size={18} />, name: "Mail", value: "mail" },
  { icon: <TbUser size={18} />, name: "User", value: "user" },
  { icon: <TbSettings size={18} />, name: "Settings", value: "settings" },
];

const GooeyMenuDemo = () => {
  const { duration } = useDurationStore();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <GooeyMenu
        items={items}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 * duration }}
      />
    </div>
  );
};
export default GooeyMenuDemo;
