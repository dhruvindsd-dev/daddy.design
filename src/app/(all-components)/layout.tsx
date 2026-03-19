import ComponentActions from "@/components/sections/component-actions";
import ComponentBg from "@/components/sections/component-bg";
import KbdHandler from "@/components/sections/kbd-handler";
import ResponsiveLogo from "@/components/ui/logo/responsive-logo";
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
      <div className="fixed top-4 left-4 z-101 sm:top-12 sm:left-12">
        <ResponsiveLogo />
      </div>
      <ComponentBg />
      <ComponentActions />
      <section className="z-100">{children}</section>
    </div>
  );
};
export default Index;
