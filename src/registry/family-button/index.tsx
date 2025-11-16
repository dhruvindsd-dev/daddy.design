import { cva } from "class-variance-authority";
import {
    motion,
    MotionConfig,
    AnimatePresence,
    MotionProps,
    Transition,
    HTMLMotionProps
} from "motion/react";
import { TbAlertTriangleFilled, TbCircleCheckFilled } from "react-icons/tb";

interface ButtonProps {
  variant?: "loading" | "error" | "success";
  children: React.ReactNode;
  icon?: React.ReactNode;
  transition?: Transition;
  className?: string;
  text?: {
    error?: string;
    loading?: string;
    success?: string;
  };
}

const tAni: MotionProps = {
  variants: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40, filter: "blur(4px)" },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const iAni: MotionProps = {
  variants: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const buttonStyles = cva(
  "relative flex h-14 cursor-pointer items-center justify-center gap-3 overflow-hidden px-6 text-center text-xl font-bold text-nowrap transition-colors duration-500 select-none",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-black/80",
        loading: "bg-sky-100 text-sky-400",
        error: "bg-rose-100 text-rose-400",
        success: "bg-green-100 text-green-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const FamilyButton = ({
  variant,
  text: _text,
  children,
  icon,
  className,
  transition = { type: "spring", duration: 0.6, bounce: 0.4 },
  ...rest
}: ButtonProps & HTMLMotionProps<"button">) => {
  const text = {
    success: "Transaction Safe",
    loading: "Analyzing Transaction",
    error: "Transaction Warning",
    ..._text,
  };

  function renderIcon() {
    if (variant === "loading") {
      return (
        <div>
          <svg
            className="size-6"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              className="stroke-sky-200"
              strokeWidth="4"
              fill="none"
            ></circle>
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              className="stroke-sky-400"
              strokeWidth="4"
              fill="none"
              strokeDasharray="62.33185307179586"
              strokeDashoffset="43.66456772333291"
              strokeLinecap="round"
              animate={{
                rotate: [0, 360 * 3],
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeOut",
                },
              }}
            ></motion.circle>
          </svg>
        </div>
      );
    } else if (variant === "error") {
      return (
        <motion.div
          animate={{
            x: [0, 6, -6, 0, 6, -6, 0, 6, -6, 0],
            transition: {
              duration: 0.4,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1.2,
            },
          }}
        >
          <TbAlertTriangleFilled />
        </motion.div>
      );
    } else if (variant === "success") {
      return <TbCircleCheckFilled size={24} />;
    } else return icon;
  }

  function renderTxt() {
    if (variant === "loading") return text.loading;
    else if (variant === "error") return text.error;
    else if (variant === "success") return text.success;
    return children;
  }

  return (
    <MotionConfig transition={transition}>
      <motion.button
        {...rest}
        className={buttonStyles({ variant, className })}
        style={{ borderRadius: 100 }}
        layout
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {(variant || icon) && (
            <motion.div key={`${variant}-icon`} {...iAni} layout="position">
              {renderIcon()}
            </motion.div>
          )}
          <motion.div key={`${variant}-text`} {...tAni} layout="position">
            {renderTxt()}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </MotionConfig>
  );
};

export default FamilyButton;
