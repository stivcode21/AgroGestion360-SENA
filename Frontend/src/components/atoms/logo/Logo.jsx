import styles from "./Logo.module.css";

const Logo = ({ size, collapsed }) => {
  const small = size === "small";

  return (
    <header className={styles.container}>
      {collapsed ? (
        <img
          src="/logoSmall.svg"
          alt="Parkify Logo"
          className={`${styles.logo} ${small && styles.logoSmall}`}
        />
      ) : (
        <>
          <img
            src="/logo.svg"
            alt="Parkify Logo"
            className={`${styles.logo} ${small && styles.logoSmall2}`}
          />
          <h1 className={`${styles.title} ${small && styles.titleSmall}`}>
            AgroGestion<span className={styles.strong}>360</span>
          </h1>
          <div className={`${styles.line} ${small && styles.line2}`}></div>
        </>
      )}
    </header>
  );
};

export default Logo;
