// store/chatStore.ts
import { create } from "zustand";

interface PanelState {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  open: false,
  setOpen: (value: boolean) => set({ open: value }),
}));
