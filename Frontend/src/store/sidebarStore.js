import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  currentSection: "/dashboard",
  isCollapsed: false,
  setCurrentSection: (section) => set({ currentSection: section }),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  toggleCollapsed: () =>
    set((state) => ({
      isCollapsed: !state.isCollapsed,
    })),
}));
