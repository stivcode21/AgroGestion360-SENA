import { X } from "lucide-react";
import styles from "./DetailsModal.module.css";
import { useModalStore } from "@/store/modalStore";

const DetailsModal = ({ children }) => {
  const { setIsOpenModal } = useModalStore();
  return (
    <div className={styles.background} onClick={() => setIsOpenModal(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.btn} onClick={() => setIsOpenModal(false)}>
          <X className={styles.close} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default DetailsModal;
