import { create } from "zustand";

export type LogoStore = {
  count: number;
  animation:
    | "blink"
    | "wink"
    | "look-right"
    | "look-left"
    | "look-bottom"
    | "normal"
    | "cute"
    | "confused";
  trigger: (
    animation:
      | "blink"
      | "wink"
      | "look-right"
      | "look-left"
      | "look-bottom"
      | "normal"
      | "cute"
      | "confused",
  ) => void;
};

const useLogoStore = create<LogoStore>()((set) => ({
  count: 1,
  animation: "normal",
  trigger: (ani) =>
    set((state) => ({ count: state.count + 1, animation: ani })),
}));

export default useLogoStore;
