import { useEffect } from "react";
import Sidebar from "@/components/molecules/sidebar/Sidebar";
import styles from "./MainLayout.module.css";
import Header from "../../molecules/header/Header";
import { useSidebarStore } from "@/store/sidebarStore";

const MainLayout = ({ children }) => {
  const { setCollapsed, isCollapsed } = useSidebarStore();

  // Colapsar automáticamente en pantallas pequeñas, expandir en desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  return (
    <section className={styles.container}>
      <Sidebar />
      <main className={`${styles.main} ${isCollapsed && styles.collapsed}`}>
        <Header />
        {children}
      </main>
    </section>
  );
};

export default MainLayout;
