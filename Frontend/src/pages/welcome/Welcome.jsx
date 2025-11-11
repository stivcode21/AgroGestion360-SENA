import Logo from "@/components/atoms/logo/Logo";
import styles from "./Welcome.module.css";
import { InfoIcon, Lock } from "lucide-react";

const Welcome = () => {
  return (
    <main className={styles.container}>
      <figure className={styles.decorations} aria-hidden="true">
        <img src="/public/shappe.png" className={styles.shappe} alt="" />
        <img src="/public/marca-agua.png" className={styles.marcaAgua} alt="" />
      </figure>

      <section className={styles.flexbox} aria-labelledby="welcome-heading">
        <article className={styles.modal}>
          <header className={styles.header}>
            <Logo />
          </header>

          <section aria-label="Beneficios principales">
            <ul className={styles.list}>
              <li className={styles.item}>
                Gestión industrial de tu finca en un solo lugar
              </li>
              <li className={styles.item}>
                Supervisión eficiente de todo tu personal
              </li>
              <li className={styles.item}>
                Control financiero claro y confiable
              </li>
            </ul>
          </section>

          <nav className={styles.boxButtons} aria-label="Acciones principales">
            <button type="button" className={styles.button}>
              <span aria-hidden="true">
                <Lock />
              </span>
              iniciar sesión
            </button>
            <button type="button" className={styles.outline}>
              <span aria-hidden="true">
                <InfoIcon />
              </span>
              info sistema
            </button>
          </nav>

          <footer className={styles.footer}>
            Accede como dueño o administrador según tus credenciales
          </footer>
        </article>

        <div className={styles.emty}></div>
      </section>
    </main>
  );
};

export default Welcome;
