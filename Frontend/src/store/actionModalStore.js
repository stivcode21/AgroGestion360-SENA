import { create } from "zustand";

const initialState = {
  isOpen: false,
  variant: "delete",
  title: "",
  highlight: "",
  titleSuffix: "?",
  description: "",
  note: "",
  confirmLabel: undefined,
  cancelLabel: "Cancelar",
  onConfirm: null,
  onCancel: null,
};

export const useActionModalStore = create((set) => ({
  ...initialState,
  openActionModal: (config = {}) =>
    set(() => ({
      ...initialState,
      ...config,
      isOpen: true,
    })),
  closeActionModal: () =>
    set(() => ({
      ...initialState,
    })),
}));
