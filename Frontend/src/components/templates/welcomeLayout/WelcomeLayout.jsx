import styles from "./WelcomeLayout.module.css";

const WelcomeLayout = ({ children, isWelcome }) => {
  return (
    <main className={styles.container}>
      <figure aria-hidden="true">
        <img
          src="/public/shappe.png"
          className={`${styles.shappe} ${!isWelcome && styles.shappeReverse}`}
          alt=""
        />
        <img src="/public/marca-agua.png" className={styles.marcaAgua} alt="" />
      </figure>

      <section
        className={`${styles.flexbox} ${!isWelcome && styles.flexboxReverse}`}
        aria-labelledby="welcome-heading"
      >
        <article
          className={`${styles.modal} ${!isWelcome && styles.modalReverse}`}
        >
          {children}
        </article>

        <div className={styles.emty}></div>
      </section>
    </main>
  );
};

export default WelcomeLayout;
