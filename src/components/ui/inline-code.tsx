import { cn } from "@/lib/utils";
import { HTMLProps } from "react";

const InlineCode = (p: HTMLProps<HTMLSpanElement>) => {
  const { className, children, ...rest } = p;
  return (
    <span
      {...rest}
      className={cn(
        "relative rounded-md border border-black/10 bg-white px-1.5 py-1 font-mono text-xs font-bold text-black/60",
        className,
      )}
    >
      {children}
    </span>
  );
};
export default InlineCode;
