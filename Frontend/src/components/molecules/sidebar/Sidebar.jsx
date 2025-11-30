import { PanelRightOpen } from "lucide-react";
import Logo from "@/components/atoms/logo/Logo";
import styles from "./Sidebar.module.css";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useLocation } from "react-router-dom";
import cowMarcage from "@/assets/img/cowMarcaAgua.png";
import { useEffect } from "react";
import NavList from "@/components/molecules/navList/NavList";

const Sidebar = () => {
  const { currentSection, setCurrentSection, isCollapsed, toggleCollapsed } =
    useSidebarStore();
  const location = useLocation();

  const exitSecion = () => {};

  useEffect(() => {
    // Mantiene la sección activa sincronizada con la ruta actual
    if (location.pathname !== currentSection) {
      setCurrentSection(location.pathname);
    }
  }, [location.pathname, currentSection, setCurrentSection]);

  return (
    <section className={`${styles.sidebar} ${isCollapsed && styles.collapsed}`}>
      <PanelRightOpen
        className={`${styles.iconCollapsed} ${
          isCollapsed && styles.iconCollapsedOpen
        }`}
        onClick={toggleCollapsed}
      />
      <section className={styles.containerSections}>
        <Logo size="small" collapsed={isCollapsed} />

        <h3 className={styles.subtitle}>{isCollapsed ? "" : "Secciones"}</h3>
        <nav className={styles.listContainer}>
          <NavList />
          {sidebarData.slice(7, 8).map((item, i) => (
            <div>
              <button
                className={`${styles.item} ${styles.exit}`}
                key={i}
                onClick={() => exitSecion(item.path)}
              >
                {item.icon}
                {isCollapsed ? "" : item.title}
              </button>
              <footer className={styles.footer}>{item.description}</footer>
            </div>
          ))}
        </nav>
      </section>
      {<img src={cowMarcage} alt="decorative" className={styles.decorative} />}
    </section>
  );
};

export default Sidebar;
