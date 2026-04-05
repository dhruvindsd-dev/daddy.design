"use client";

import React from "react";
import { useDrag } from "@use-gesture/react";
import { motion, useSpring } from "motion/react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const DEFAULT_SPRING = {
  stiffness: 520,
  damping: 10,
};

export interface AppleLikeDragMorphProps {
  className?: string;
  children: React.ReactNode;
  maxStretch?: number;
  minScale?: number;
  dragSensitivity?: number;
  bounceStretch?: number;
  bounceSquish?: number;
  bounceDuration?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
  onClick?: () => void;
}

const AppleLikeDragMorph = ({
  className,
  children ,
  maxStretch = 1.5,
  minScale = 0.2,
  dragSensitivity = 0.003,
  bounceStretch = 1.2,
  bounceSquish = 0.9,
  bounceDuration = 160,
  springConfig,
  onClick,
}: AppleLikeDragMorphProps) => {
  const bounceTimeoutRef = React.useRef<number | null>(null);
  const isHorizontalBounceRef = React.useRef(true);
  const spring = { ...DEFAULT_SPRING, ...springConfig };
  const scaleX = useSpring(1, spring);
  const scaleY = useSpring(1, spring);

  const bind = useDrag(
    ({ active, movement: [mx, my] }) => {
      if (!active) {
        scaleX.set(1);
        scaleY.set(1);
        return;
      }

      const absX = Math.abs(mx);
      const absY = Math.abs(my);
      const total = absX + absY;

      if (total === 0) {
        scaleX.set(1);
        scaleY.set(1);
        return;
      }

      const weightX = absX / total;
      const weightY = absY / total;

      const stretchX = clamp(1 + absX * dragSensitivity, 1, maxStretch);
      const stretchY = clamp(1 + absY * dragSensitivity, 1, maxStretch);

      const squishFromX = clamp(1 - 0.5 * (stretchX - 1), minScale, 1);
      const squishFromY = clamp(1 - 0.5 * (stretchY - 1), minScale, 1);

      const scaleXHorizontal = stretchX;
      const scaleYHorizontal = squishFromX;

      const scaleXVertical = squishFromY;
      const scaleYVertical = stretchY;

      const nextScaleX = scaleXHorizontal * weightX + scaleXVertical * weightY;
      const nextScaleY = scaleYHorizontal * weightX + scaleYVertical * weightY;

      scaleX.set(nextScaleX);
      scaleY.set(nextScaleY);
    },
    {
      filterTaps: true,
    },
  );

  function handleClick() {
    onClick?.();

    if (bounceTimeoutRef.current) {
      window.clearTimeout(bounceTimeoutRef.current);
    }

    if (isHorizontalBounceRef.current) {
      scaleX.set(bounceStretch);
      scaleY.set(bounceSquish);
    } else {
      scaleX.set(bounceSquish);
      scaleY.set(bounceStretch);
    }

    isHorizontalBounceRef.current = !isHorizontalBounceRef.current;

    bounceTimeoutRef.current = window.setTimeout(() => {
      scaleX.set(1);
      scaleY.set(1);
      bounceTimeoutRef.current = null;
    }, bounceDuration);
  }

  React.useEffect(() => {
    return () => {
      if (bounceTimeoutRef.current) {
        window.clearTimeout(bounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div {...bind()}>
      <motion.button
        type="button"
        onClick={handleClick}
        style={{ scaleX, scaleY, borderRadius: 9999 }}
        className={`flex h-32 w-32 cursor-grab touch-none items-center justify-center bg-black/20 shadow-xl active:cursor-grabbing ${className ?? ""}`}
      >
        {children}
      </motion.button>
    </div>
  );
};

export default AppleLikeDragMorph;
