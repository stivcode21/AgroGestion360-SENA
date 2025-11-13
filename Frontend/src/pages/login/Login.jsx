import WelcomeLayout from "../../components/templates/welcomeLayout/WelcomeLayout";
import Logo from "@/components/atoms/logo/Logo";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <WelcomeLayout>
      <header className={styles.header}>
        <Logo />
      </header>
      <h1 className={styles.title}>INICIAR SESION</h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid enim
        non quidem eos, atque ipsum quis dolor quasi ea beatae aliquam, mollitia
        ab repellat iste neque. A rem expedita ducimus.
      </p>
      <footer className={styles.footer}>
        Accede como dueño o administrador según tus credenciales
      </footer>
    </WelcomeLayout>
  );
};

export default Login;
