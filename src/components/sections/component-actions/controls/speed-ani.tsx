import { motion } from "motion/react";

interface Props {
  speed: "1x" | "0.5x";
}

const SpeedAni = ({ speed }: Props) => {
  const slow = speed === "0.5x";
  const pointerRotation = slow ? -30 : 90;

  return (
    <>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame">
          <g id="Group">
            <path
              id="Vector"
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              fill="white"
            />
            <motion.g
              id="pointer"
              initial={{ rotate: pointerRotation }}
              animate={{ rotate: pointerRotation }}
            >
              <path
                id="vector"
                d="M4.35303 4.35253C4.64603 4.05963 5.12068 4.05952 5.41358 4.35253L8.03175 6.97069C8.32534 6.83028 8.65334 6.74999 9.0005 6.74999C10.2431 6.74999 11.2505 7.75735 11.2505 8.99999C11.2505 10.2426 10.2431 11.25 9.0005 11.25C7.75787 11.25 6.7505 10.2426 6.7505 8.99999C6.7505 8.65284 6.83079 8.32483 6.9712 8.03124L4.35303 5.41307C4.06005 5.12008 4.06007 4.64543 4.35303 4.35253Z"
                fill="white"
                className="fill-ds-primary"
              />
              <rect
                id="Rectangle 1"
                x="3.02734"
                y="3.02734"
                width="11.9453"
                height="11.9453"
              />
            </motion.g>
          </g>
        </g>
      </svg>
    </>
  );
};
export default SpeedAni;
