import { create } from "zustand";

export const useDataStore = create((set) => ({
  products: [],
  activities: [],
  notifications: [],
  setProducts: (products) => set({ products }),
  setActivities: (activities) => set({ activities }),
  setNotifications: (notifications) => set({ notifications }),
}));
