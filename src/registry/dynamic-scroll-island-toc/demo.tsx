"use client";
import { useState, useRef, useMemo } from "react";
import DynamicScrollIslandTOC, { TOC_INTERFACE } from ".";
import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    motion,
    MotionConfig,
    MotionProps,
} from "motion/react";
import useDurationStore from "@/stores/duration-store";

export const TOC_DATA: TOC_INTERFACE[] = [
  { name: "All" },
  { name: "Grass", value: "grass" },
  { name: "Llama", value: "llama" },
  { name: "Cat", value: "cat" },
  { name: "Dog", value: "dog" },
];

const DATA: Record<string, string[]> = {
  grass: [
    "https://images.unsplash.com/photo-1589496933738-f5c27bc146e3?q=70&w=500",
    "https://images.unsplash.com/photo-1526392587392-d1627b6c134a?q=70&w=500",
    "https://images.unsplash.com/photo-1609311630949-72f6a4c2acbb?q=70&w=500",
    "https://images.unsplash.com/photo-1528145913842-29edebe7bdb9?q=70&w=500",
    "https://images.unsplash.com/photo-1601788505117-18947ac4f2e6?q=70&w=500",
  ],
  llama: [
    "https://images.unsplash.com/photo-1587618420325-97ac1ea3cd80?q=70&w=500",
    "https://images.unsplash.com/photo-1568805778598-fcb2852dbac1?q=70&w=500",
    "https://images.unsplash.com/photo-1589182337358-2cb63099350c?q=70&w=500",
    "https://images.unsplash.com/photo-1601924690478-c507163b3ba9?q=70&w=500",
    "https://images.unsplash.com/photo-1617096000801-bd71df8d6d8f?q=70&w=500",
    "https://images.unsplash.com/photo-1542856204-00101eb6def4?q=70&w=500",
  ],
  cat: [
    "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?q=70&w=500",
    "https://images.unsplash.com/photo-1611267254323-4db7b39c732c?q=70&w=500",
    "https://images.unsplash.com/photo-1594473198611-9ef233fc7850?q=70&w=500",
    "https://images.unsplash.com/photo-1604430352727-c0555f882e01?q=70&w=500",
    "https://images.unsplash.com/photo-1559059699-085698eba48c?q=70&w=500",
  ],
  dog: [
    "https://images.unsplash.com/photo-1548658166-136d9f6a7e76?q=70&w=500",
    "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=70&w=500",
    "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?q=70&w=500",
    "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?q=70&w=500",
    "https://images.unsplash.com/photo-1592769606534-fe78d27bf450?q=70&w=500",
  ],
};

export const animation: MotionProps = {
  variants: {
    hidden: { maskPosition: "0% 150%", filter: "blur(10px)", opacity: 0.5 },
    show: { maskPosition: "0% 0%", filter: "blur(0px)", opacity: 1 },
  },
  initial: "hidden",
  animate: "show",
  exit: "hidden",
};

function random() {
  return Math.random();
}

const DynamicScrollIslandTocDemo = () => {
  const { duration } = useDurationStore();
  const [active, _setActive] = useState(TOC_DATA[0]);
  const ref = useRef<HTMLDivElement>(null);

  const all = useMemo(() => {
    return Object.keys(DATA).reduce<string[]>((acc, key) => {
      return acc.concat(DATA[key].map((url) => url));
    }, []);
  }, []);

  function setActive(val: TOC_INTERFACE) {
    setTimeout(() => _setActive(val), 400);
  }

  const filteredData = active.value ? DATA[active.value] : all;
  return (
    <div className="flex flex-col">
      <MotionConfig transition={{ duration: 0.6 * duration }}>
        <div className="relative flex justify-center">
          <DynamicScrollIslandTOC
            data={TOC_DATA}
            value={active}
            setValue={setActive}
            ref={ref}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.6 * duration,
            }}
          />
        </div>

        <div className="relative mt-8 w-full max-w-[600px]">
          <div className="scroll-fade-y h-[200px] sm:h-[500px] overflow-scroll" ref={ref}>
            <div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active.value}
                  className={cn(
                    "grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] 2xl:grid-cols-4",
                    "[mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] [mask-size:100%_300%] [mask-repeat:no-repeat]",
                  )}
                  {...animation}
                >
                  {filteredData.map((url, idx) => {
                    return (
                      <div
                        key={idx}
                        className="relative aspect-square overflow-hidden rounded-xl"
                      >
                        <img
                          src={url}
                          className="absolute inset-0 h-full w-full object-cover"
                          alt="image"
                        />
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </MotionConfig>
    </div>
  );
};
export default DynamicScrollIslandTocDemo;
