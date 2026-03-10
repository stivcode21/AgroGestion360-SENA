import { createContext, useContext } from "react";
import ActionModal from "@/components/templates/actionModal/ActionModal";
import { useActionModalStore } from "@/store/actionModalStore";

const ActionModalContext = createContext(null);

export const ActionModalProvider = ({ children }) => {
  const {
    isOpen,
    variant,
    title,
    highlight,
    titleSuffix,
    description,
    note,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    openActionModal,
    closeActionModal,
  } = useActionModalStore();

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    }
    closeActionModal();
  };

  const handleConfirm = async () => {
    if (typeof onConfirm === "function") {
      await onConfirm();
    }
    closeActionModal();
  };

  return (
    <ActionModalContext.Provider value={{ openActionModal, closeActionModal }}>
      {children}
      <ActionModal
        isOpen={isOpen}
        variant={variant}
        title={title}
        highlight={highlight}
        titleSuffix={titleSuffix}
        description={description}
        note={note}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </ActionModalContext.Provider>
  );
};

export const useActionModal = () => {
  const context = useContext(ActionModalContext);
  if (!context) {
    throw new Error("useActionModal debe usarse dentro de ActionModalProvider");
  }
  return context;
};
