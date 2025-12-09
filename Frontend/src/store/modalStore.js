import { create } from "zustand";

export const useModalStore = create((set) => ({
  isOpenModal: false,
  selectProduct: null,
  selectWoker: null,
  setSelectProduct: (product) => set({ selectProduct: product }),
  setSelectWoker: (woker) => set({ selectWoker: woker }),
  setIsOpenModal: (isOpen) => set({ isOpenModal: isOpen }),
}));
