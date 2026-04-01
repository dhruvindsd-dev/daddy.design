"use client";

import CurvedScrollbar from ".";

const content =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus vitae arcu vehicula dictum. Integer posuere, nibh at volutpat feugiat, sapien orci faucibus velit, nec varius mauris massa a erat. Curabitur tincidunt, neque nec convallis consequat, justo augue faucibus nunc, vitae pellentesque lorem nisl nec odio. Praesent eget sem ac nibh interdum tincidunt. Vivamus fringilla, leo in feugiat posuere, purus velit consequat nunc, id tristique justo lorem sed magna. Donec tempor velit at lacus fermentum, eu vulputate odio placerat. Aliquam erat volutpat. Nam ut augue vel massa interdum faucibus. Quisque commodo sapien at tellus cursus, non gravida sem tincidunt.";

const CurvedScrollbarDemo = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <CurvedScrollbar
          className="h-[180px]"
          config={{ radius: 18, stroke: 5, trail: 22, thumb: 120 }}
        >
          <div className="text-sm leading-7 text-black/70">
            <p>{content}</p>
          </div>
        </CurvedScrollbar>
      </div>
    </div>
  );
};

export default CurvedScrollbarDemo;
