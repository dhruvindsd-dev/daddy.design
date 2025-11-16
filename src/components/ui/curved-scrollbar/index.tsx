"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionProps, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  // Define any props you need here, for example:
  // color?: string;
  // radius?: number;

  className?: string;
  thumbClassName?: string;
  children?: React.ReactNode;
  disableHorizontal?: boolean;

  config?: {
    radius?: number;
    stroke?: number;
    inset?: number;
    trail?: number;
    thumb?: number;
    thumbOffsetEnd?: number;
  };
}

const ViewMoreAni: MotionProps = {
  variants: {
    hidden: { opacity: 0, filter: "blur(2px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  transition: { duration: 0.4, ease: "easeOut" },
};

const CurvedScroller = ({
  config = {},
  className,
  thumbClassName,
  disableHorizontal = false,
  children,
}: Props) => {
  const content = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const vThumb = useRef<SVGPathElement>(null);
  const hThumb = useRef<SVGPathElement>(null);

  const c = {
    radius: 8,
    stroke: 5,
    inset: 6,
    trail: 16,
    thumb: 100,
    thumbOffsetEnd: 40,
    ...config,
  };

  const [compV, setCompV] = useState({ start: 0, end: 0, len: 0 });
  const [compH, setCompH] = useState({ start: 0, end: 0, len: 0 });

  const [controlsState, setControlsState] = useState<
    "hidden" | "view-more" | "back-to-top"
  >("hidden");

  const moV = useSpring(0, { visualDuration: 0.2, bounce: 0.3 });
  const moH = useSpring(0, { visualDuration: 0.2, bounce: 0.3 });

  const tOpac = useSpring(0, { duration: 400, bounce: 0 });
  const bOpac = useSpring(1, { duration: 400, bounce: 0 });

  const syncVertical = () => {
    if (!content.current || !svg.current || !vThumb.current) return;

    const contentEl = content.current;
    const svgEl = svg.current;
    const { radius, stroke, inset, trail, thumb, thumbOffsetEnd } = c;

    const h = contentEl.offsetHeight + 32;
    const w = contentEl.offsetWidth + 32;

    svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const x = w - inset - stroke * 0.5;
    const topY = inset + stroke * 0.5;
    const botY = h - inset - stroke * 0.5;

    let dStr = `M${x - trail - radius},${topY} `;
    dStr += `L${x - radius},${topY} `;
    dStr += `a${radius},${radius} 0 0 1 ${radius} ${radius} `;
    dStr += `L${x},${botY - radius} `;
    dStr += `a${radius},${radius} 0 0 1 ${-radius} ${radius} `;
    dStr += `L${x - trail - radius},${botY}`;

    vThumb.current.setAttribute("d", dStr);

    const totalLength = vThumb.current.getTotalLength() || 0;

    vThumb.current.setAttribute(
      "stroke-dasharray",
      `${thumb} ${Math.ceil(totalLength)}`,
    );

    const startOffset = 0 + thumbOffsetEnd;
    const endOffset = -(totalLength - thumb + thumbOffsetEnd);
    setCompV({ start: startOffset, end: endOffset, len: totalLength });
    moV.jump(startOffset);
  };

  const synHorizontal = () => {
    if (disableHorizontal) return;
    if (!content.current || !svg.current || !hThumb.current) return;

    const contentEl = content.current;
    const { radius: r, stroke, inset, trail, thumb, thumbOffsetEnd } = c;

    const h = contentEl.offsetHeight + 32;
    const w = contentEl.offsetWidth + 32;
    const x = inset + stroke * 0.5;
    const y = h - inset - stroke * 0.5;

    let dStr = `M${x},${y - trail - r} `;
    dStr += `L${x},${y - r} `;
    dStr += `a${r},${r} 0 0 0 ${r} ${r} `;
    dStr += `L${w - trail - r - stroke - inset * 2},${y}`;

    hThumb.current.setAttribute("d", dStr);

    const totalLength = hThumb.current.getTotalLength() || 0;
    hThumb.current.setAttribute(
      "stroke-dasharray",
      `${thumb} ${Math.ceil(totalLength)}`,
    );

    const startOffset = 0 + thumbOffsetEnd;
    const endOffset = -(totalLength - thumb + thumbOffsetEnd);
    setCompH({ start: startOffset, end: endOffset, len: totalLength });
    moH.jump(startOffset);
  };

  const calSvg = () => {
    syncVertical();
    synHorizontal();

    // hide svg if scrollable height is nothing

    const contentEl = content.current;
    if (!contentEl) return;
    if (contentEl.scrollHeight <= contentEl.clientHeight) {
      svg.current?.style.setProperty("display", "none");
      tOpac.set(0);
      bOpac.set(0);
      setControlsState("hidden");
    } else {
      svg.current?.style.setProperty("display", "block");
      tOpac.set(0);
      bOpac.set(1);
      setControlsState("view-more");
    }
  };

  useEffect(() => {
    const contentEl = content.current;
    if (!contentEl) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    calSvg();

    const handleResize = () => calSvg();

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;

      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      const vPro = scrollTop / (scrollHeight - clientHeight);
      const offV = compV.start + (compV.end - compV.start) * vPro;

      const scrollLeft = target.scrollLeft;
      const scrollWidth = target.scrollWidth;
      const clientWidth = target.clientWidth;

      const hProgress = scrollLeft / (scrollWidth - clientWidth);
      const offH = compH.start + (compH.end - compH.start) * hProgress;

      moV.set(offV);
      moH.set(offH);

      if (vPro > 0) tOpac.set(1);
      else tOpac.set(0);

      if (vPro >= 1) {
        bOpac.set(0);
        setControlsState("back-to-top");
      } else {
        bOpac.set(1);
        setControlsState("view-more");
      }
    };

    const throttledScroll = throttle(
      handleScroll as (...args: unknown[]) => void,
      50,
    );

    window.addEventListener("resize", handleResize, { passive: true });
    contentEl.addEventListener("scroll", throttledScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => calSvg());
    resizeObserver.observe(contentEl);

    return () => {
      window.removeEventListener("resize", handleResize);
      contentEl.removeEventListener("scroll", throttledScroll);
      resizeObserver.disconnect();
    };
  }, [
    compV.start,
    compV.end,
    compH.start,
    compH.end,
    c.radius,
    c.stroke,
    c.inset,
    c.trail,
    c.thumb,
    c.thumbOffsetEnd,
  ]);

  function handleViewMoreClick() {
    if (!content.current || controlsState === "hidden") return;

    const top =
      controlsState === "back-to-top"
        ? 0
        : content.current.scrollTop + content.current.clientHeight * 0.9;

    content.current.scrollTo({
      // scroll 10%
      top,
      behavior: "smooth",
    });
  }

  return (
    <div className="border-ds-border relative h-full w-full rounded-[28px] border">
      <div className="relative overflow-hidden p-4">
        <svg
          ref={svg}
          className="pointer-events-none absolute inset-0 top-0 right-0 bottom-0 left-0 z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            ref={vThumb}
            className={cn(
              "stroke-ds-border will-change-[stroke-dashoffset]",
              thumbClassName,
            )}
            fill="none"
            strokeLinecap="round"
            strokeWidth={c.stroke}
            style={{ strokeDashoffset: moV }}
          />
          <motion.path
            ref={hThumb}
            className={cn(
              "stroke-ds-border will-change-[stroke-dashoffset]",
              thumbClassName,
            )}
            fill="none"
            strokeLinecap="round"
            strokeWidth={c.stroke}
            style={{ strokeDashoffset: moH }}
          />
        </svg>

        <div className="relative">
          <motion.button
            onClick={handleViewMoreClick}
            className="text-ds-text-3 absolute right-2 bottom-2 z-10000 flex h-6 w-24 cursor-pointer items-end justify-end rounded-full px-1 text-right text-[10px] text-nowrap"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {controlsState !== "hidden" && (
                <motion.span {...ViewMoreAni} key={`${controlsState}`}>
                  {controlsState === "back-to-top"
                    ? "Back to top"
                    : "View more"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <div
            ref={content}
            className={cn(
              "hide-scrollbar bg-ds-bg-100 outline-ds-border relative w-full overflow-auto rounded-[12px] p-4 outline",
              className,
            )}
          >
            {children}
          </div>

          <motion.div
            style={{ opacity: tOpac }}
            className="from-ds-bg-100 absolute inset-x-0 top-0 z-9 h-24 rounded-t-[12px] bg-linear-to-b to-transparent"
          />
          <motion.div
            style={{ opacity: bOpac }}
            className="from-ds-bg-100 absolute inset-x-0 bottom-0 z-9 h-24 rounded-b-[12px] bg-linear-to-t to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId === null) {
      // @ts-expect-error no types for this
      func.apply(this, args);
      timeoutId = setTimeout(() => {
        if (lastArgs) {
          // @ts-expect-error no types for this
          func.apply(this, lastArgs);
          lastArgs = null;
        }
        timeoutId = null;
      }, delay);
    } else lastArgs = args;
  };
}

export default CurvedScroller;
