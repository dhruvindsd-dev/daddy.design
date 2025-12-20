import { create } from "zustand";

export type DurationStore = {
  duration: number;
  setDuration: (duration: number) => void;
};

const useDurationStore = create<DurationStore>()((set) => ({
  duration: 1,
  setDuration: (duration) => set(() => ({ duration })),
}));

export default useDurationStore;
