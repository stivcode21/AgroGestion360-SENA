import { create } from "zustand";

export const useModalStore = create((set) => ({
  isOpenModal: false,
  isImgEnlargeOpen: false,
  enlargedImage: null,
  selectProduct: null,
  selectWoker: null,
  selectActivity: null,
  selectCattle: null,
  selectPig: null,
  setSelectProduct: (product) => set({ selectProduct: product }),
  setSelectWoker: (woker) => set({ selectWoker: woker }),
  setSelectActivity: (activity) => set({ selectActivity: activity }),
  setSelectCattle: (cattle) => set({ selectCattle: cattle }),
  setSelectPig: (pig) => set({ selectPig: pig }),
  setIsOpenModal: (isOpen) => set({ isOpenModal: isOpen }),
  openImgEnlarge: (image) =>
    set({
      isImgEnlargeOpen: true,
      enlargedImage: image,
    }),
  closeImgEnlarge: () =>
    set({
      isImgEnlargeOpen: false,
      enlargedImage: null,
    }),
}));
