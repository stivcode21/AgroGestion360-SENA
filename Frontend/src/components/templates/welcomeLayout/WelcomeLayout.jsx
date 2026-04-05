import styles from "./WelcomeLayout.module.css";
import PasswordForgot from "@/components/molecules/passwordForgot/PasswordForgot";

const WelcomeLayout = ({ children, isWelcome, setModal, isOpen }) => {
  return (
    <main className={styles.container}>
      <figure aria-hidden="true">
        <img
          src="/public/shappe.png"
          className={`${styles.shappe} ${!isWelcome && styles.shappeReverse}`}
          alt=""
        />
        <img
          src="/public/marca-agua.png"
          className={`${
            isWelcome ? styles.marcaAgua : styles.marcaAguaReverse
          }`}
          alt=""
        />
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

      {isOpen && (
        <PasswordForgot isOpen={isOpen} onClose={() => setModal(false)} />
      )}
    </main>
  );
};

export default WelcomeLayout;
