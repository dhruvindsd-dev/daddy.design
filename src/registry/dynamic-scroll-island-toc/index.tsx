"use client";

import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    LayoutGroup,
    motion,
    MotionConfig,
    type MotionValue,
    type Transition,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";
import type { RefObject } from "react";
import { useEffect, useState } from "react";
import { TbChevronUp, TbX } from "react-icons/tb";

export interface TOC_INTERFACE {
  name: string;
  value?: string;
}

interface Props {
  value?: TOC_INTERFACE;
  setValue?: (v: TOC_INTERFACE) => void;
  data: TOC_INTERFACE[];
  ref?: RefObject<HTMLElement | null>;
  transition?: Transition;
  className?: string;
  lPrefix?: string;
}

const LAYOUT_IDS = {
  wrapper: "toc-wrapper",
  items: "toc-items",
  clearProgress: "toc-progress-x",
  chevronWrapper: "toc-chevron-wrapper",
  chevron: "toc-chevron",
  progressRing: "toc-progress-svg",
  title: "toc-title-wrapper",
} as const;

const PROGRESS_CIRCLE_RADIUS = 10;
const PROGRESS_CIRCLE_CIRCUMFERENCE =
  2 * Math.PI * PROGRESS_CIRCLE_RADIUS - 0.5;

function getLayoutId(layoutIdPrefix: string | undefined, id: string) {
  return layoutIdPrefix ? `${layoutIdPrefix}-${id}` : id;
}

const DynamicScrollIslandTOC = ({
  data,
  value: controlledValue,
  setValue: onValueChange,
  ref: containerRef,
  className,
  lPrefix,
  transition = { type: "spring", duration: 0.5, bounce: 0.1 },
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(controlledValue);
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    setActiveItem(controlledValue);
  }, [controlledValue]);

  useEffect(() => {
    const scrollContainer = containerRef?.current ?? null;
    const scrollTarget = scrollContainer ?? window;

    const updateScrollProgress = () => {
      const scrollTop = scrollContainer
        ? scrollContainer.scrollTop
        : window.scrollY;
      const scrollHeight = scrollContainer
        ? scrollContainer.scrollHeight
        : document.body.scrollHeight;
      const clientHeight = scrollContainer
        ? scrollContainer.clientHeight
        : window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;

      scrollProgress.set(maxScroll > 0 ? scrollTop / maxScroll : 1);
    };

    scrollTarget.addEventListener("scroll", updateScrollProgress, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollProgress);
    const resizeTarget = scrollContainer
      ? (scrollContainer.firstElementChild ?? scrollContainer)
      : document.body;

    resizeObserver.observe(resizeTarget);
    updateScrollProgress();

    return () => {
      scrollTarget.removeEventListener("scroll", updateScrollProgress);
      resizeObserver.disconnect();
    };
  }, [containerRef, scrollProgress]);

  function handleSelect(nextItem: TOC_INTERFACE) {
    setActiveItem(nextItem);
    onValueChange?.(nextItem);
  }

  const renderLeadingControls = () => (
    <>
      <ProgressRing layoutIdPrefix={lPrefix} scrollProgress={scrollProgress} />
      <ActiveTitle activeItem={activeItem} layoutIdPrefix={lPrefix} />
      <Chevron isOpen={isOpen} layoutIdPrefix={lPrefix} />
    </>
  );

  return (
    <MotionConfig transition={transition}>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            role="button"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-white/10 backdrop-blur-[4px]"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          />
        )}
      </AnimatePresence>
      <LayoutGroup>
        <div
          className={cn(
            "relative z-51 cursor-pointer select-none",
            "[--height-opened:150px] [--width-opened:350px] [--width:220px]",
            "text-white/80",
            className,
          )}
        >
          <motion.div
            role="button"
            aria-label="Open"
            tabIndex={0}
            onClick={() => setIsOpen((prev) => !prev)}
            layoutId={getLayoutId(lPrefix, LAYOUT_IDS.wrapper)}
            style={{ borderRadius: 24 }}
            className={cn(
              "relative flex h-10 cursor-pointer items-center overflow-hidden px-1 outline-hidden!",
              "min-w-[var(--width)] bg-black",
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {!isOpen && (
                <>
                  <div className="pointer-events-none absolute top-0 left-1/2 h-full w-[calc(var(--width-opened)-50px)] -translate-x-1/2">
                    <motion.div
                      layoutId={getLayoutId(lPrefix, LAYOUT_IDS.items)}
                      layout="position"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="absolute top-1/2 left-1 z-50 flex -translate-y-1/2 items-center gap-3">
                    {renderLeadingControls()}
                  </div>

                  <div className="absolute top-1/2 right-1 z-50 -translate-y-1/2">
                    <ProgressButton
                      activeItem={activeItem}
                      layoutIdPrefix={lPrefix}
                      onSelect={handleSelect}
                      scrollProgress={scrollProgress}
                    />
                  </div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <AnimatePresence mode="popLayout" initial={false}>
              {isOpen && (
                <motion.div
                  role="button"
                  aria-label="Close"
                  tabIndex={0}
                  onClick={() => setIsOpen((prev) => !prev)}
                  layoutId={getLayoutId(lPrefix, LAYOUT_IDS.wrapper)}
                  className={cn(
                    "cursor-pointer justify-center overflow-hidden p-5 pt-15",
                    "min-h-[var(--height-opened)] w-[var(--width-opened)] bg-black",
                  )}
                  style={{ borderRadius: 24 }}
                >
                  <motion.div className="absolute top-3 left-3 z-50 flex items-center gap-3">
                    {renderLeadingControls()}
                  </motion.div>
                  <div className="absolute top-3 right-3 z-50">
                    <ProgressButton
                      activeItem={activeItem}
                      layoutIdPrefix={lPrefix}
                      onSelect={handleSelect}
                      scrollProgress={scrollProgress}
                    />
                  </div>

                  <motion.div
                    layoutId={getLayoutId(lPrefix, LAYOUT_IDS.items)}
                    layout="position"
                  >
                    <TOCItems
                      activeItem={activeItem}
                      items={data}
                      onSelect={handleSelect}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
};

export default DynamicScrollIslandTOC;

interface ProgressButtonProps {
  activeItem?: TOC_INTERFACE;
  layoutIdPrefix?: string;
  onSelect: (value: TOC_INTERFACE) => void;
  scrollProgress: MotionValue<number>;
}

function ProgressButton({
  activeItem,
  layoutIdPrefix,
  onSelect,
  scrollProgress,
}: ProgressButtonProps) {
  const [progressPercent, setProgressPercent] = useState(
    Math.round(scrollProgress.get() * 100),
  );

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (progress) => {
      setProgressPercent(Math.round(progress * 100));
    });

    return () => unsubscribe();
  }, [scrollProgress]);

  return (
    <motion.button
      type="button"
      layoutId={getLayoutId(layoutIdPrefix, LAYOUT_IDS.clearProgress)}
      onClick={(event) => {
        event.stopPropagation();
        onSelect({ name: "All" });
      }}
      className={cn(
        "relative flex h-8 w-14 items-center justify-center overflow-hidden rounded-full text-sm font-bold",
        "bg-white/[0.1] transition-colors hover:bg-white/[0.15]",
      )}
    >
      {activeItem?.value ? <TbX /> : `${progressPercent}%`}
    </motion.button>
  );
}

interface TOCItemsProps {
  activeItem?: TOC_INTERFACE;
  items: TOC_INTERFACE[];
  onSelect: (value: TOC_INTERFACE) => void;
}

function TOCItems({ activeItem, items, onSelect }: TOCItemsProps) {
  return (
    <div className="grid gap-0.5 transition-opacity">
      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={() => onSelect(item)}
          aria-label={item.name}
          className={cn(
            "cursor-pointer text-left font-semibold opacity-40 transition-opacity hover:opacity-60",
            activeItem?.name === item.name && "opacity-100!",
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

interface ChevronProps {
  isOpen: boolean;
  layoutIdPrefix?: string;
}

function Chevron({ isOpen, layoutIdPrefix }: ChevronProps) {
  return (
    <motion.div
      layoutId={getLayoutId(layoutIdPrefix, LAYOUT_IDS.chevronWrapper)}
      className="mt-0.5 -ml-1 text-white/80"
    >
      <motion.div
        layout="position"
        layoutId={getLayoutId(layoutIdPrefix, LAYOUT_IDS.chevron)}
        initial={false}
        animate={{ rotate: isOpen ? 0 : 180 }}
      >
        <TbChevronUp strokeWidth={4} />
      </motion.div>
    </motion.div>
  );
}

interface ProgressRingProps {
  layoutIdPrefix?: string;
  scrollProgress: MotionValue<number>;
}

function ProgressRing({ layoutIdPrefix, scrollProgress }: ProgressRingProps) {
  const dashOffset = useTransform(
    scrollProgress,
    [0, 1],
    [PROGRESS_CIRCLE_CIRCUMFERENCE, 0],
  );
  const smoothedDashOffset = useSpring(dashOffset, {
    visualDuration: 0.1,
    bounce: 0,
  });

  return (
    <motion.div layoutId={getLayoutId(layoutIdPrefix, LAYOUT_IDS.progressRing)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r={PROGRESS_CIRCLE_RADIUS}
          className="stroke-white/20"
          strokeWidth="4"
          fill="none"
        />
        <motion.circle
          cx="12"
          cy="12"
          r={PROGRESS_CIRCLE_RADIUS}
          className="stroke-white/80"
          strokeWidth="4"
          fill="none"
          strokeDasharray={PROGRESS_CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={smoothedDashOffset}
          strokeLinecap="round"
          transform="rotate(-90 12 12)"
        />
      </svg>
    </motion.div>
  );
}

interface ActiveTitleProps {
  activeItem?: TOC_INTERFACE;
  layoutIdPrefix?: string;
}

function ActiveTitle({ activeItem, layoutIdPrefix }: ActiveTitleProps) {
  return (
    <motion.div
      layoutId={getLayoutId(layoutIdPrefix, LAYOUT_IDS.title)}
      layout="position"
      className="font-bold"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={activeItem?.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {activeItem?.name}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
