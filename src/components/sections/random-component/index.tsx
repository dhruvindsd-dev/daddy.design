"use client";
import {
    AnimatePresence,
    motion,
    MotionConfig,
    MotionProps,
} from "motion/react";
import { useEffect, useState } from "react";
import { COMP_DATA, COMP_METADATA, RANDOM_DATA } from "../../../registry/index";
import RandomButton from "./button";
import Comp from "./random-comp";

const ani: MotionProps = {
  variants: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { opacity: 0, y: "-10%", scale: 0.8 },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const usedComponents = new Set<string>();
const getRandomComp = (() => {
  return (prev?: { name: string }) => {
    if (usedComponents.size === RANDOM_DATA.length) {
      usedComponents.clear();
    }

    let randomIndex = 0;
    let slug = "";
    do {
      randomIndex = Math.floor(Math.random() * RANDOM_DATA.length);
      slug = RANDOM_DATA[randomIndex];
    } while (
      usedComponents.has(slug) ||
      (prev && COMP_DATA[slug].title === prev.name)
    );

    usedComponents.add(slug);

    const comp = COMP_DATA[slug].comp;
    return {
      demo: comp.random ? comp.random : comp.demo,
      name: COMP_METADATA[slug].title,
      slug,
    };
  };
})();

const RandomComponent = () => {
  const [counter, setCounter] = useState(0);
  const [comp, setComp] = useState<{ demo: any; name: any; slug: string }>(
    getRandomComp(),
  );

  useEffect(() => {}, []);

  return (
    <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}>
      <div className="flex h-full flex-col gap-4">
        <motion.div className="h-[500px] overflow-hidden rounded-2xl md:h-full md:flex-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              {...(counter > 0 ? ani : {})}
              key={comp?.name}
              className="border-border h-full w-full rounded-2xl border bg-white"
            >
              {comp && <Comp {...comp} counter={counter} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div>
          <RandomButton
            onClick={() => {
              setCounter((prev) => prev + 1);
              setComp(getRandomComp(comp));
            }}
          />
        </div>
      </div>
    </MotionConfig>
  );
};

export default RandomComponent;
