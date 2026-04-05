"use client";

import AppleLikeDragMorph from ".";

const AppleLikeDragMorphDemo = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-6">
      <AppleLikeDragMorph className="border border-black/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className="size-20 opacity-40"
        >
          <title>xmark</title>
          <g fill="currentColor">
            <line
              x1="5"
              y1="5"
              x2="15"
              y2="15"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></line>
            <line
              x1="5"
              y1="15"
              x2="15"
              y2="5"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></line>
          </g>
        </svg>
      </AppleLikeDragMorph>
    </div>
  );
};

export default AppleLikeDragMorphDemo;
