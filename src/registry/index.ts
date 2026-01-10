import dynamic from "next/dynamic";

export interface IComp {
  slug: COMPS;
  copyTargets?: { main?: string; demo?: string }; // by default we copy main -> index.tsx  & demo -> demo.tsx . But you can overide the defaults with this keys
  packages?: string[];
  diaableSpeedToggle?: boolean;
  comp: {
    demo: any;
  };
}

export interface CompMeta {
  slug: COMPS;
  title: string;
  desc: string;
  rText?: "top-black" | "bottom-black" | "top-white" | "bottom-white";
  aspect?: string;
}

export enum COMPS {
  FAMILY_BUTTON = "family-button",
  ANIMATED_BLUR_TESTIMONIALS = "animated-blur-testimonials",
  COOL_CHECKBOX = "cool-checkbox",

  // SPLASH_3D_BUTTON = "3d-splash-button",
  // DYNAMIC_SCROLL_ISLAND = "dynamic-scroll-island-toc",
  // NATIVE_SWIPEABLE_SHEETS = "native-swipeable-sheets",
  // GOOEY_MENU = "gooey-menu",
  // SUB_SELECT_TOGGLE = "sub-select-toggle",
  // SHARED_LAYOUT_TABS = "shared-layout-tabs",
  // APPLE_WATCH_USERS_ANIMATION = "apple-watch-users-animation",
}

export const COMP_LIST = Object.keys(COMPS);

export const COMP_DATA: Record<COMPS, IComp> = {
  [COMPS.FAMILY_BUTTON]: {
    slug: COMPS.FAMILY_BUTTON,
    copyTargets: { demo: "demo-copy.tsx" },
    packages: ["motion", "tailwind-merge", "clsx", "react-icons"],
    comp: {
      demo: dynamic(() => import("@/registry/family-button/demo")),
    },
  },
  [COMPS.ANIMATED_BLUR_TESTIMONIALS]: {
    slug: COMPS.ANIMATED_BLUR_TESTIMONIALS,
    packages: ["motion", "tailwind-merge", "clsx", "react-icons"],
    copyTargets: { demo: "demo-copy.tsx" },
    comp: {
      demo: dynamic(() => import("@/registry/animated-blur-testimonials/demo")),
    },
  },

  [COMPS.COOL_CHECKBOX]: {
    slug: COMPS.COOL_CHECKBOX,
    packages: ["motion", "tailwind-merge", "clsx"],
    diaableSpeedToggle: true,
    comp: {
      demo: dynamic(() => import("@/registry/cool-checkbox/demo")),
    },
  },
};

export const COMP_METADATA: Record<COMPS, CompMeta> = {
  [COMPS.FAMILY_BUTTON]: {
    slug: COMPS.FAMILY_BUTTON,
    title: "Family status indicator",
    desc: "Family like dynamic status indicator",
  },
  [COMPS.ANIMATED_BLUR_TESTIMONIALS]: {
    slug: COMPS.ANIMATED_BLUR_TESTIMONIALS,
    title: "Animated Testimonials",
    desc: "A sexy testimonial component with smooth blur animations.",
    rText: "bottom-black",
  },
  [COMPS.COOL_CHECKBOX]: {
    slug: COMPS.COOL_CHECKBOX,
    title: "Cool checkbox",
    desc: "Checkbox with animations",
  },
};
