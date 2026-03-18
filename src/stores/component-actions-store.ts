import { COMPS } from "@/registry";
import { create } from "zustand";

export type ComponentActionsStore = {
  component: COMPS | null;
  prompt: string | undefined;
  code: string | undefined;
  setActions: (data: {
    component: COMPS;
    prompt?: string;
    code?: string;
  }) => void;
};

const useComponentActionsStore = create<ComponentActionsStore>()((set) => ({
  component: null,
  prompt: undefined,
  code: undefined,
  setActions: ({ component, prompt, code }) =>
    set(() => ({ component, prompt, code })),
}));

export default useComponentActionsStore;
