import { ArrowRight, Database } from "lucide-react";
import styles from "./Linkcard.module.css";

const Linkcard = ({ icon, title, description, stats = "125", onClick }) => {
  return (
    <a className={styles.linkcard} onClick={onClick}>
      <header className={styles.subtitle}>
        <i className={styles.icon}>{icon}</i>
        <h1>{title}</h1>
      </header>
      <div className={styles.info}>
        <span className={styles.number}>{stats}</span>
        <h3 className={styles.description}>{description}</h3>
      </div>
      <i className={styles.arrow}>
        <ArrowRight />
      </i>
    </a>
  );
};

export default Linkcard;
