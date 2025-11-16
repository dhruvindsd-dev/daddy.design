import ComponentBg from "@/components/sections/component-bg";
import KbdHandler from "@/components/sections/kbd-handler";
import Logo from "@/components/ui/logo";
import Sidebar from "@/components/ui/sidebar";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const Index = ({ children }: Props) => {
  return (
    <div className="relative flex min-h-screen min-w-screen items-center justify-center overflow-x-hidden">
      <KbdHandler />
      <Sidebar />
      <div className="fixed top-12 left-12 z-101">
        <Logo withText />
      </div>
      <ComponentBg />
      <section className="z-100">{children}</section>
    </div>
  );
};
export default Index;
