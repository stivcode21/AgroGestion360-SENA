import { create } from "zustand";

export const useModalStore = create((set) => ({
  isOpenModal: false,
  selectProduct: null,
  setSelectProduct: (product) => set({ selectProduct: product }),
  setIsOpenModal: (isOpen) => set({ isOpenModal: isOpen }),
}));
