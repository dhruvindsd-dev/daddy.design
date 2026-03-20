"use client";
import Icon from "@/components/ui/icon";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion, MotionConfig } from "motion/react";
import { useState } from "react";

export interface PropsTableData {
  name: string;
  type: string;
  default_value: string;
  description: string;
  type_info?: string;
}

interface Props {
  items: PropsTableData[];
  className?: string;
}

const PropsTable = ({ items, className }: Props) => {
  const mobile = useIsMobile();
  const [mobileActiveAccordion, setMobileActiveAccordion] = useState<string>();

  function format(value: string) {
    if (!value.includes("`")) return <code>{value}</code>;

    const parts = value.split(/(`[^`]+`)/g);
    return (
      <>
        {parts.map((part, index) => {
          // backticked content
          if (part.startsWith("`") && part.endsWith("`")) {
            return <code key={index}>{part.slice(1, -1)}</code>;
          }

          // plain content
          return (
            <span key={index} className="opacity-60">
              {part}
            </span>
          );
        })}
      </>
    );
  }

  function renderType(type: string, info?: string) {
    if (!info) return format(type);

    return (
      <Popover>
        <PopoverTrigger className="cursor-help">{format(type)}</PopoverTrigger>
        <PopoverContent side="top">
          <code className="code inline-block! leading-snug! outline-none!">
            {format(info)}
          </code>
        </PopoverContent>
      </Popover>
    );
  }

  function renderTable() {
    return (
      <table className={cn("table table-fixed", className)}>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.name}>
              <td>
                <div className="flex items-center gap-1.5">
                  {format(i.name)}

                  <Popover>
                    <PopoverTrigger className="text-ds-text-3 hover:bg-ds-bg-100 hover:text-ds-text-2 flex size-5 cursor-pointer items-center justify-center rounded-[4px] transition-colors">
                      <Icon name="INFO_OUTLINE" size={12} />
                    </PopoverTrigger>
                    <PopoverContent side="top">
                      <p className="text-ds-text-2 text-xs font-medium">
                        {i.description}
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </td>
              <td>{renderType(i.type, i.type_info)}</td>
              <td>{format(i.default_value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function handleAccClick(name: string) {
    setMobileActiveAccordion((prev) => (prev === name ? undefined : name));
  }

  function renderList() {
    return (
      <MotionConfig transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}>
        <div className="border-ds-border overflow-hidden rounded-[12px] border">
          {items.map((i) => {
            const isOpen = mobileActiveAccordion === i.name;
            return (
              <div
                key={i.name}
                className={cn(
                  "border-b-ds-border border-b px-3 last:border-b-0",
                  "transition-colors duration-300",
                  isOpen && "bg-ds-bg-100",
                )}
              >
                <button
                  onClick={() => handleAccClick(i.name)}
                  className="flex w-full items-center justify-between py-3 pr-2"
                >
                  <p className="text-ds-primary-light-text text-[13px] font-medium">
                    {i.name}
                  </p>
                  <motion.span>
                    <Icon name="SM_CHEVRON_DOWN" size={10} />
                  </motion.span>
                </button>
                <motion.div
                  initial={{
                    height: isOpen ? "auto" : 0,
                    filter: isOpen ? "blur(0px)" : "blur(10px)",
                    opacity: isOpen ? 1 : 0,
                    scale: isOpen ? 1 : 0.95,
                  }}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    filter: isOpen ? "blur(0px)" : "blur(10px)",
                    opacity: isOpen ? 1 : 0,
                    scale: isOpen ? 1 : 0.95,
                  }}
                  className="-mx-1 overflow-hidden px-1"
                >
                  <div className="text-ds-text-2 pb-3 text-[13px]">
                    {i.description}
                  </div>
                  <div className="flex flex-col gap-1 pb-3">
                    <p className="text-ds-text-3 text-[12px]">Type</p>
                    <p className="text-ds-text-2 text-[13px] font-medium">
                      <code className="code">{renderType(i.type)}</code>{" "}
                      <span className="">{i.type_info}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 pb-3">
                    <p className="text-ds-text-3 text-[12px]">Default</p>
                    <p className="text-ds-text-2 text-[13px] font-medium">
                      <code className="code">{format(i.default_value)}</code>
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </MotionConfig>
    );
  }

  return mobile ? renderList() : renderTable();
};
export default PropsTable;
