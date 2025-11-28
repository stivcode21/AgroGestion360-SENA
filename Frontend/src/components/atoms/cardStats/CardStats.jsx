import styles from "./CardStats.module.css";

const CardStats = ({ icon, title, children }) => {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.icon}>{icon}</div>
        <h3 className={styles.subtitle}>{title}</h3>
      </header>
      {children}
    </article>
  );
};

export default CardStats;
