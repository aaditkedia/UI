import { create } from "zustand";

type ScrollState = {
  progress: number;
  pointer: { x: number; y: number };
  setProgress: (progress: number) => void;
  setPointer: (x: number, y: number) => void;
};

export const useScrollProgress = create<ScrollState>((set) => ({
  progress: 0,
  pointer: { x: 0, y: 0 },
  setProgress: (progress) => set({ progress }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
}));
