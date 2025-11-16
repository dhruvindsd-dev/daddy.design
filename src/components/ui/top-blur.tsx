"use client";
import { cn } from "@/lib/utils";
import { useScroll, useTransform, useMotionTemplate } from "motion/react";
import { useRef } from "react";

interface Props {
  className?: string;
}

const TopBlur = ({ className }: Props) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end 20%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const b = useTransform(scrollYProgress, [0.6, 1], [0, 12]);
  const blur = useMotionTemplate`blur(${b}px)`;

  return (
    <div className={cn("pointer-events-none fixed top-0 z-101", className)}>
      <div className="bg-bg/20 absolute top-0 z-1000 h-[100px] w-full [mask-image:linear-gradient(to_bottom,rgb(0,0,0)_10%,transparent)] backdrop-blur-[8px]" />
      <div className="pointer-events-none absolute top-0 z-1001 h-[100px] w-full bg-linear-to-b from-white/90 to-transparent"></div>
    </div>
  );
};
export default TopBlur;
