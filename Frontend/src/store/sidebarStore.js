import { create } from "zustand";

const initialIsDesktop = window.innerWidth > 768;

export const useSidebarStore = create((set) => ({
  currentSection: "/dashboard",
  isCollapsed: false,
  isDesktop: initialIsDesktop,
  setCurrentSection: (section) => set({ currentSection: section }),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  setIsDesktop: (value) => set({ isDesktop: value }),
  toggleCollapsed: () =>
    set((state) => ({
      isCollapsed: !state.isCollapsed,
    })),
}));
