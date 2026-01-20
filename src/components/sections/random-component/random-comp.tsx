import { ROUTES } from "@/lib/const";
import { motion, MotionProps } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { TbArrowUpRight } from "react-icons/tb";

interface Props {
  demo: any;
  name: any;
  slug: string;
  counter: number;
}

const opacityAni: MotionProps = {
  variants: {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  initial: "hidden",
  animate: "visible",
  transition: { duration: 0.8 },
};

const Comp = (p: Props) => {
  return (
    <motion.div
      {...(p.counter > 0 ? {} : opacityAni)}
      className="relative flex h-full w-full items-center justify-center"
    >
      {<p.demo key={p.name} />}
      <div className="absolute top-0 left-0 m-4">
        <Link
          href={`${ROUTES.comp}/${p.slug}`}
          className="group flex items-center gap-1 rounded-sm font-mono text-xs font-medium opacity-60 transition-opacity select-none hover:opacity-100"
        >
          {p.name}
          <div className="transition-transform group-hover:rotate-45">
            <TbArrowUpRight strokeWidth={2.5} size={14} />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};
export default Comp;

dynamic(() => Promise.resolve(Comp), {
  ssr: false,
});
