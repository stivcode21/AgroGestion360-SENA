import WelcomeLayout from "@/components/templates/welcomeLayout/WelcomeLayout";
import Logo from "@/components/atoms/logo/Logo";
import styles from "./Login.module.css";
import { ArrowRight, Lock, User } from "lucide-react";
import Button from "@/components/templates/button/Button";

const Login = () => {
  return (
    <WelcomeLayout>
      <header className={styles.header}>
        <Logo />
      </header>
      <form action="" className={styles.form}>
        <h1 className={styles.title}>INICIAR SESION</h1>
        <div className={styles.containerInput}>
          <label htmlFor="Usuario" className={styles.label}>
            <i className={styles.icon}>
              <User />
            </i>
            Usuario:
          </label>
          <input type="text" className={styles.input} />
        </div>
        <div className={styles.containerInput}>
          <label htmlFor="Usuario" className={styles.label}>
            <i className={styles.icon}>
              <Lock />
            </i>
            Contraseña:
          </label>
          <input type="password" className={styles.input} />
        </div>

        <Button type="primary">
          iniciar sesión
          <ArrowRight />
        </Button>
      </form>
      <footer className={styles.footer}>
        Accede como dueño o administrador según tus credenciales
      </footer>
    </WelcomeLayout>
  );
};

export default Login;
