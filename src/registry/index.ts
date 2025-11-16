import dynamic from "next/dynamic";

export interface IComp {
  slug: COMPS;
  title: string;
  desc: string;
  rText?: "top-black" | "bottom-black" | "top-white" | "bottom-white";
  aspect?: string;
  copyTargets?: { main?: string; demo?: string }; // by default we copy main -> index.tsx  & demo -> demo.tsx . But you can overide the defaults with this keys
  comp: {
    demo: any;
    base?: any;
  };
}

export enum COMPS {
  FAMILY_BUTTON = "family-button",
  // ANIMATED_BLUR_TESTIMONIALS = "animated-blur-testimonials",
  // SPLASH_3D_BUTTON = "3d-splash-button",
  // DYNAMIC_SCROLL_ISLAND = "dynamic-scroll-island-toc",
  // NATIVE_SWIPEABLE_SHEETS = "native-swipeable-sheets",
  // GOOEY_MENU = "gooey-menu",
  // SUB_SELECT_TOGGLE = "sub-select-toggle",
  // COOL_CHECKBOX = "cool-checkbox",
  // SHARED_LAYOUT_TABS = "shared-layout-tabs",
  // APPLE_WATCH_USERS_ANIMATION = "apple-watch-users-animation",
}

export const COMP_LIST = Object.keys(COMPS);

export const COMP_DATA: Record<COMPS, IComp> = {
  [COMPS.FAMILY_BUTTON]: {
    slug: COMPS.FAMILY_BUTTON,
    title: "Family status indicator",
    desc: "Family like dynamic status indicator",
    copyTargets: { demo: "copy.tsx" },
    comp: {
      demo: dynamic(() => import("@/registry/family-button/demo")),
      base: dynamic(() => import("@/registry/family-button/base")),
    },
  },
};
