import styles from "./WelcomeLayout.module.css";
import PasswordForgot from "@/components/molecules/passwordForgot/PasswordForgot";
import LoginInfo from "@/components/atoms/loginInfo/LoginInfo";
import { demoCredentials } from "@/data/demoCredentials";

const WelcomeLayout = ({
  children,
  isWelcome,
  setModal,
  isOpen,
  onUseDemoCredentials,
  demoActionLabel,
}) => {
  return (
    <main className={styles.container}>
      <figure aria-hidden="true">
        <img
          src="/shappe.png"
          className={`${styles.shappe} ${!isWelcome && styles.shappeReverse}`}
          alt=""
        />
        <img
          src="/marca-agua.png"
          className={`${
            isWelcome ? styles.marcaAgua : styles.marcaAguaReverse
          }`}
          alt=""
        />
      </figure>

      {onUseDemoCredentials ? (
        <LoginInfo
          email={demoCredentials.email}
          password={demoCredentials.password}
          onUseCredentials={onUseDemoCredentials}
          actionLabel={demoActionLabel}
          className={styles.floatingLoginInfo}
        />
      ) : null}

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
