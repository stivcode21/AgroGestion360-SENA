import { X } from "lucide-react";
import styles from "./DetailsModal.module.css";

const DetailsModal = ({ children }) => {
  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <button className={styles.btn}>
          <X className={styles.close} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default DetailsModal;
