import { COMPS } from "@/registry";
import { create } from "zustand";

export type ComponentActionsStore = {
  component: COMPS | null;
  prompt: string | undefined;
  code: string | undefined;
  nextCount: number;
  setActions: (data: {
    component: COMPS;
    prompt?: string;
    code?: string;
  }) => void;
  incrementNext: () => void;
};

const useComponentActionsStore = create<ComponentActionsStore>()((set) => ({
  component: null,
  prompt: undefined,
  code: undefined,
  nextCount: 0,
  setActions: ({ component, prompt, code }) =>
    set(() => ({ component, prompt, code })),
  incrementNext: () => set((s) => ({ nextCount: s.nextCount + 1 })),
}));

export default useComponentActionsStore;
