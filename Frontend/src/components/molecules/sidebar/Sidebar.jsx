import { PanelRightOpen } from "lucide-react";
import Logo from "@/components/atoms/logo/Logo";
import styles from "./Sidebar.module.css";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate, useLocation } from "react-router-dom";
import cowMarcage from "@/assets/img/cowMarcaAgua.png";
import { useEffect } from "react";

const Sidebar = () => {
  const { currentSection, setCurrentSection, isCollapsed, toggleCollapsed } =
    useSidebarStore();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSection = (path) => {
    setCurrentSection(path);
    navigate(path);
  };

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
          <ul className={styles.list}>
            {sidebarData.slice(0, 7).map((item, i) => (
              <li
                className={`${styles.item} ${
                  currentSection === item.path ? styles.active : ""
                }`}
                key={i}
                onClick={() => handleSection(item.path)}
              >
                {item.icon}
                {isCollapsed ? "" : item.title}
              </li>
            ))}
          </ul>
          {sidebarData.slice(7, 8).map((item, i) => (
            <>
              <button
                className={`${styles.item} ${styles.exit}`}
                key={i}
                onClick={() => exitSecion(item.path)}
              >
                {item.icon}
                {isCollapsed ? "" : item.title}
              </button>
              <footer className={styles.footer}>{item.description}</footer>
            </>
          ))}
        </nav>
      </section>
      {<img src={cowMarcage} alt="decorative" className={styles.decorative} />}
    </section>
  );
};

export default Sidebar;
