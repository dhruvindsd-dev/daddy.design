import dynamic from "next/dynamic";

export interface IComp {
  slug: COMPS;
  copyTargets?: { main?: string; demo?: string }; // by default we copy main -> index.tsx  & demo -> demo.tsx . But you can overide the defaults with this keys
  packages?: string[];
  diaableSpeedToggle?: boolean;
  comp: {
    demo: any;
    random?: any;
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
  AI_ACTION_BUTTON = "ai-action-button",
  ANIMATED_BLUR_TESTIMONIALS = "animated-blur-testimonials",
  COOL_CHECKBOX = "cool-checkbox",
  DYNAMIC_SCROLL_ISLAND = "dynamic-scroll-island-toc",
  GOOEY_MENU = "gooey-menu",
  APPLE_LIKE_DRAG_MORPH = "apple-like-drag-morph",
  CURVED_SCROLLBAR = "curved-scrollbar",

  // SPLASH_3D_BUTTON = "3d-splash-button",
  // NATIVE_SWIPEABLE_SHEETS = "native-swipeable-sheets",
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
  [COMPS.AI_ACTION_BUTTON]: {
    slug: COMPS.AI_ACTION_BUTTON,
    copyTargets: { demo: "demo-copy.tsx" },
    packages: ["motion", "react-icons"],
    comp: {
      demo: dynamic(() => import("@/registry/ai-action-button/demo")),
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

  [COMPS.DYNAMIC_SCROLL_ISLAND]: {
    slug: COMPS.COOL_CHECKBOX,
    packages: ["motion", "tailwind-merge", "clsx"],
    comp: {
      demo: dynamic(() => import("@/registry/dynamic-scroll-island-toc/demo")),
      random: dynamic(() => import("@/registry/dynamic-scroll-island-toc/random")),
    },
  },

  [COMPS.GOOEY_MENU]: {
    slug: COMPS.GOOEY_MENU,
    packages: ["motion", "tailwind-merge", "clsx", "react-icons"],
    comp: {
      demo: dynamic(() => import("@/registry/gooey-menu/demo")),
    },
  },

  [COMPS.APPLE_LIKE_DRAG_MORPH]: {
    slug: COMPS.APPLE_LIKE_DRAG_MORPH,
    packages: ["motion", "@use-gesture/react"],
    diaableSpeedToggle: true,
    comp: {
      demo: dynamic(() => import("@/registry/apple-like-drag-morph/demo")),
    },
  },

  [COMPS.CURVED_SCROLLBAR]: {
    slug: COMPS.CURVED_SCROLLBAR,
    packages: ["motion", "tailwind-merge", "clsx"],
    diaableSpeedToggle: true,
    comp: {
      demo: dynamic(() => import("@/registry/curved-scrollbar/demo")),
    },
  },
};

export const COMP_METADATA: Record<COMPS, CompMeta> = {
  [COMPS.FAMILY_BUTTON]: {
    slug: COMPS.FAMILY_BUTTON,
    title: "Family status indicator",
    desc: "Family like dynamic status indicator",
  },
  [COMPS.AI_ACTION_BUTTON]: {
    slug: COMPS.AI_ACTION_BUTTON,
    title: "AI Action Button",
    desc: "Animated AI call-to-action with light beams and state transitions.",
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
  [COMPS.DYNAMIC_SCROLL_ISLAND]: {
    slug: COMPS.DYNAMIC_SCROLL_ISLAND,
    title: "Dynamic Scroll Island",
    desc: "Apple style dynamic scroll island",
    rText: "top-white",
  },

  [COMPS.GOOEY_MENU]: {
    slug: COMPS.GOOEY_MENU,
    title: "Gooey Menu",
    desc: "Simple Menu with svg gooey effect",
  },
  [COMPS.APPLE_LIKE_DRAG_MORPH]: {
    slug: COMPS.APPLE_LIKE_DRAG_MORPH,
    title: "Apple-like Drag Morph",
    desc: "A draggable button that stretches and squishes with directional drag.",
  },
  [COMPS.CURVED_SCROLLBAR]: {
    slug: COMPS.CURVED_SCROLLBAR,
    title: "Curved Scrollbar",
    desc: "A framed scroll area with animated curved scrollbar tracks.",
  },
};

export const RANDOM_DATA = [
  COMPS.ANIMATED_BLUR_TESTIMONIALS,
  COMPS.DYNAMIC_SCROLL_ISLAND,
  COMPS.FAMILY_BUTTON,
  COMPS.COOL_CHECKBOX,
  COMPS.GOOEY_MENU,
];
