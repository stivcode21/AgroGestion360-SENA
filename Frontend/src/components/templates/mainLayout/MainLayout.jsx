import { useEffect } from "react";
import Sidebar from "@/components/molecules/sidebar/Sidebar";
import styles from "./MainLayout.module.css";
import Header from "@/components/molecules/header/Header";
import NavbarMobile from "@/components/molecules/navbarMobile/NavbarMobile";
import { useSidebarStore } from "@/store/sidebarStore";

const MainLayout = ({ children }) => {
  const { isCollapsed, isDesktop, setIsDesktop } = useSidebarStore();

  // Colapsar automáticamente en pantallas pequeñas, expandir en desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsDesktop]);

  return (
    <section className={styles.container}>
      {isDesktop ? <Sidebar /> : <NavbarMobile />}

      <main
        className={`${styles.main} ${
          isDesktop
            ? isCollapsed
              ? styles.collapsed
              : ""
            : styles.NavbarMobile
        }`}
      >
        <Header />
        {children}
      </main>
    </section>
  );
};

export default MainLayout;
