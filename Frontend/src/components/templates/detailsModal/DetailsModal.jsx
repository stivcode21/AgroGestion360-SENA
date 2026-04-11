import { X } from "lucide-react";
import styles from "./DetailsModal.module.css";
import { useModalStore } from "@/store/modalStore";

const DetailsModal = ({ children }) => {
  const { setIsOpenModal, isInnerDetailModalOpen, setIsInnerDetailModalOpen } =
    useModalStore();

  const handleClose = () => {
    setIsInnerDetailModalOpen(false);
    setIsOpenModal(false);
  };

  return (
    <div className={styles.background} onClick={handleClose}>
      <div
        className={`${styles.modal} ${
          isInnerDetailModalOpen ? styles.modalLocked : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.btn} onClick={handleClose}>
          <X className={styles.close} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default DetailsModal;
