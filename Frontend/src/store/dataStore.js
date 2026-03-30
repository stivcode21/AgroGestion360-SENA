import { create } from "zustand";

export const useDataStore = create((set) => ({
  products: [],
  activities: [],
  notifications: [],
  setProducts: (products) =>
    set((state) => ({
      products: typeof products === "function" ? products(state.products) : products,
    })),
  setActivities: (activities) =>
    set((state) => ({
      activities:
        typeof activities === "function"
          ? activities(state.activities)
          : activities,
    })),
  setNotifications: (notifications) =>
    set((state) => ({
      notifications:
        typeof notifications === "function"
          ? notifications(state.notifications)
          : notifications,
    })),
}));
