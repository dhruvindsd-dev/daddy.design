"use client";
import React from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, motion } from "motion/react";
import Icon from "@/components/ui/icon";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const MorphingDragSquare: React.FC = () => {
  const scaleX = useSpring(1, {
    stiffness: 420,
    damping: 10,
  });

  const scaleY = useSpring(1, {
    stiffness: 420,
    damping: 10,
  });

  const maxStretch = 1.5;
  const minScale = 0.2;
  const dragSensitivity = 0.0009;

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

  const dragProps = bind() ?? {};

  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <motion.div
        {...dragProps}
        style={{ scaleX, scaleY, borderRadius: 5000 }}
        className="h-32 w-32 cursor-grab touch-none bg-black/20 shadow-xl active:cursor-grabbing flex items-center justify-center"
      >
        <Icon name="CLI" className="text-black/60 size-20" />
      </motion.div>
    </div>
  );
};

export default MorphingDragSquare;
