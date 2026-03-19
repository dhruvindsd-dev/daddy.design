"use client";
import { highlight } from "sugar-high";
import CopyButton from "./copy-button";
import CurvedScroller from "./curved-scrollbar";
import { useId } from "react";
import { useIsMobile } from "@/hooks/use-media-query";

interface Props {
  code: string;
  className?: string;
  disableHighlight?: boolean;
}

const Code = ({ code, disableHighlight }: Props) => {
  const id = useId();
  const mobile = useIsMobile();
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-12 m-7">
        <CopyButton elementId={id} />
      </div>
      <div className="h-full">
        <CurvedScroller
          disableHorizontal={!mobile}
          className="max-h-[500px]"
          config={{ radius: 22, stroke: 5, inset: 5, trail: 8 }}
        >
          <pre
            id={id}
            className="font-mono text-sm font-semibold sm:whitespace-break-spaces"
            dangerouslySetInnerHTML={{
              __html: disableHighlight ? code : highlight(code),
            }}
          />
        </CurvedScroller>
      </div>
    </div>
  );
};

export default Code;
