import { create } from "zustand";

import { persist } from "zustand/middleware";

export type ControlsStore = {
  sidebar_visible: boolean;
  muted: boolean;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  trigger: (key: "sidebar_visible" | "muted", value?: boolean) => void;
};

const useControlsStore = create<ControlsStore>()(
  persist(
    (set) => ({
      sidebar_visible: true,
      isHydrated: false,
      muted: false,
      setHydrated: (s) => set({ isHydrated: s }),
      trigger: (key, value) =>
        set((state) => ({ [key]: value ?? !state[key] })),
    }),
    {
      name: "controls-storage",
      onRehydrateStorage: (state) => () => state.setHydrated(true),
    },
  ),
);

export default useControlsStore;
