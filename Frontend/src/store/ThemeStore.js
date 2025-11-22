import { create } from "zustand";

export const useThemeStore = create((set) => ({
  isLightMode:
    localStorage.getItem("lightMode") === null
      ? true
      : localStorage.getItem("lightMode") === "true",

  toggleLightMode: () =>
    set((state) => {
      const newMode = !state.isLightMode;
      localStorage.setItem("lightMode", newMode);
      return { isLightMode: newMode };
    }),
}));
