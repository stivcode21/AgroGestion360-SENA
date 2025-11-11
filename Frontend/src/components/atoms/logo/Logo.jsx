import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <a href="/" className={styles.container}>
      <img src="/public/logo.svg" alt="Parkify Logo" className={styles.logo} />
      <h1 className={styles.title}>
        AgroGestion<span className={styles.strong}>360</span>
      </h1>
      <div className={styles.line}></div>
    </a>
  );
};

export default Logo;
