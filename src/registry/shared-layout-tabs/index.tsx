"use client";

import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    MotionConfig,
    motion,
    type MotionProps,
    type Transition,
} from "motion/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export type SharedLayoutTabValue = "list" | "card" | "pack";

export interface SharedLayoutTabsItem {
  img: string;
  title: string;
  price: number;
  cur: string;
  id: number;
}

interface SharedLayoutTabsProps {
  data: SharedLayoutTabsItem[];
  tab: SharedLayoutTabValue;
  transition?: Transition;
}

const META_ANIMATION: MotionProps = {
  variants: {
    hidden: { opacity: 0, y: 80, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  transition: { duration: 0.2 },
};

function formatPrice(value: number) {
  return Number(value.toFixed(3)).toString();
}

const imgPre = `shared-layout-tabs-image`;

export default function SharedLayoutTabs({
  data,
  tab,
  transition = { type: "spring", duration: 0.4, bounce: 0.2 },
}: SharedLayoutTabsProps) {
  const total = formatPrice(data.reduce((sum, item) => sum + item.price, 0));
  const [imgOpen, setimgOpen] = useState<number>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleOpen(id: number) {
    if (tab === "pack") return;
    if (imgOpen) setimgOpen(undefined);
    else setimgOpen(id);
  }

  return (
    <MotionConfig transition={transition}>
      <div className="space-y-8 text-black/80">
        {mounted &&
          createPortal(
            <AnimatePresence>
              {imgOpen && (
                <div
                  className="fixed top-0 left-0 z-10000 flex h-screen w-screen items-center justify-center"
                  onClick={() => setimgOpen(undefined)}
                >
                  <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    className="absolute inset-0 bg-black/30"
                  />
                  <motion.div
                    className="relative z-10 size-[400px]"
                    layoutId={`${imgPre}-${imgOpen}`}
                  >
                    <motion.img
                      layoutId={`${imgPre}-main-${imgOpen}`}
                      src={data.find((item) => item.id === imgOpen)?.img}
                      alt=""
                      style={{ borderRadius: 24 }}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body,
          )}
        <div
          className={cn(
            "relative grid gap-3",
            tab === "list" && "grid-cols-1",
            tab === "card" && "grid-cols-2 gap-y-8",
            tab === "pack" && "min-h-[280px] grid-cols-1",
          )}
        >
          {data.map((item, index) => (
            <Item
              onClick={() => handleOpen(item.id)}
              key={item.id}
              {...item}
              idx={index}
              tab={tab}
            />
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {tab === "pack" && (
            <motion.div
              {...META_ANIMATION}
              className="text-center font-medium text-black"
            >
              <p>{data.length} Collectibles</p>
              <p className="opacity-60">
                {total} <span className="uppercase opacity-60">eth</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function Item({
  idx,
  tab,
  openImgId,
  ...item
}: SharedLayoutTabsItem & {
  tab: SharedLayoutTabValue;
  idx: number;
  onClick: () => void;
  openImgId?: number;
}) {
  return (
    <motion.div
      layout
      style={{ zIndex: 100 - idx }}
      className={cn(
        "relative flex items-center font-medium text-black",
        tab === "list" && "gap-3",
        tab === "card" && "flex-col gap-3",
        tab === "pack" &&
          "absolute top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2",
      )}
    >
      <motion.div
        layoutId={`${imgPre}-${item.id}`}
        onClick={item.onClick}
        whileHover={{ scale: tab === "pack" ? 1 : 1.05 }}
        whileTap={{ scale: tab === "pack" ? 1 : 0.95 }}
        className={cn(
          tab === "list" && "size-[46px] shrink-0",
          tab === "card" && "aspect-square w-full",
          tab === "pack" && "size-36",
        )}
      >
        <motion.div
          className="relative h-full w-full"
          initial={{ rotateZ: tab === "pack" ? (idx + 1) * 18 : 0 }}
          animate={{
            rotateZ: tab === "pack" ? (idx + 1) * 18 : 0,
            opacity:
              tab === "pack" ? (idx === 0 ? 1 : Math.max(0, 1 - 0.2 * idx)) : 1,
          }}
        >
          <motion.img
            layoutId={`${imgPre}-main-${item.id}`}
            src={item.img}
            alt={item.title}
            draggable={false}
            initial={{ borderRadius: tab === "list" ? 8 : 16 }}
            animate={{ borderRadius: tab === "list" ? 8 : 16 }}
            // style={{ borderRadius: 8 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>

      {tab !== "pack" && (
        <motion.div
          layoutId={`shared-layout-tabs-title-${item.id}`}
          className="w-full flex-1"
        >
          <motion.div layout="position">
            <p className="text-[13px] font-medium">{item.title}</p>
            <p className="text-[12px] font-[450] text-black/65">
              {formatPrice(item.price)}{" "}
              <span className="uppercase opacity-60">{item.cur}</span>
            </p>
          </motion.div>
        </motion.div>
      )}

      {tab !== "pack" && (
        <motion.div
          layoutId={`shared-layout-tabs-price-${item.id}`}
          layout="position"
          className={cn(
            "text-[12px] font-medium text-black/60",
            tab === "card" && "absolute right-0 bottom-0 pr-2",
          )}
        >
          #{item.id}
        </motion.div>
      )}
    </motion.div>
  );
}
