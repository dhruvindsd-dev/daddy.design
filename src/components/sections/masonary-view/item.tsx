import { cn } from "@/lib/utils";
import { MediaInterface } from "@/registry/media";
import { motion, useSpring } from "motion/react";
import Link from "next/link";

function Item({ data }: { data: MediaInterface }) {
  const {
    src,
    title,
    slug,
    b64,
    rText = "bottom-black",
    aspectRatio = "4/2.5",
  } = data;
  const opacity = useSpring(1, { bounce: 0 });

  const [pos, color] = rText.split("-");
  return (
    <Link href={`/components/${slug}`} prefetch={false}>
      <div
        className="border-border relative overflow-hidden rounded-xl border shadow-xl shadow-black/5"
        style={{ aspectRatio: aspectRatio }}
      >
        <motion.img
          src={b64}
          alt="Video placeholder"
          className="absolute top-0 left-0 h-full w-full object-cover blur-xs"
          style={{ opacity }}
        />
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          onLoadedData={() => opacity.set(0)}
        />
        <div
          className={cn(
            "absolute z-10 flex w-full justify-between p-3 font-mono text-xs font-medium",
            pos === "top" ? "top-0" : "bottom-0",
            color === "black" ? "text-fg/80" : "text-bg/80",
          )}
        >
          <p>{title}</p>
        </div>
      </div>
    </Link>
  );
}

export default Item;
