"use client";
import { highlight } from "sugar-high";
import CopyButton from "./copy-button";
import CurvedScroller from "./curved-scrollbar";

interface Props {
  code: string;
  className?: string;
  disableHighlight?: boolean;
}

const Code = ({ code, disableHighlight }: Props) => {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-12 m-7">
        <CopyButton />
      </div>
      <div className="code h-full">
        <CurvedScroller
          disableHorizontal
          className="max-h-[500px]"
          config={{ radius: 22, stroke: 5, inset: 5, trail: 8 }}
        >
          <pre
            className="whitespace-break-spaces"
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
