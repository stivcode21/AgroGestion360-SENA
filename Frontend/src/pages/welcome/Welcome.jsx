import styles from "./Welcome.module.css";
import { InfoIcon, Lock } from "lucide-react";
import Logo from "@/components/atoms/logo/Logo";
import WelcomeLayout from "@/components/templates/welcomeLayout/WelcomeLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/templates/button/Button";
import InfoModal from "@/components/organism/infoModal/InfoModal";

const Welcome = () => {
  const [isWelcome, setIsWelcome] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const navigate = useNavigate();

  const toggleSection = (isWelcome) => {
    setIsWelcome(!isWelcome);
    navigate("/login");
  };

  return (
    <>
      <WelcomeLayout isWelcome={isWelcome}>
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
          <Button onClick={() => toggleSection(isWelcome)}>
            <Lock />
            iniciar sesión
          </Button>
          <Button type="secondary" onClick={() => setIsOpenModal(!isOpenModal)}>
            <InfoIcon />
            info sistema
          </Button>
        </nav>

        <footer className={styles.footer}>
          Accede como dueño o administrador según tus credenciales
        </footer>
      </WelcomeLayout>
      <InfoModal stateCurrent={isOpenModal} setState={setIsOpenModal} />
    </>
  );
};

export default Welcome;
