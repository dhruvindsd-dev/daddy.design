"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import Logo from ".";

const ResponsiveLogo = () => {
  const isMobile = useMediaQuery("sm");
  return <Logo withText={!isMobile} />;
};
export default ResponsiveLogo;
