import { options } from "@/data/accordionData";
import Accordion from "@/components/molecules/accordion/Accordion";
import styles from "./InfoModal.module.css";
import Logo from "@/components/atoms/logo/Logo";

const InfoModal = ({ stateCurrent, setState }) => {
  return (
    <div
      className={`${stateCurrent ? styles.background : styles.modalClose}`}
      onClick={() => setState(!stateCurrent)}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <Logo />
        </header>
        <Accordion items={options} />
      </div>
    </div>
  );
};

export default InfoModal;
