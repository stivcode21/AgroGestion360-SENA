import { PanelRightOpen } from "lucide-react";
import Logo from "@/components/atoms/logo/Logo";
import styles from "./Sidebar.module.css";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Sidebar = () => {
  const {
    currentSection,
    setCurrentSection,
    isCollapsed,
    toggleCollapsed,
  } = useSidebarStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSection = (path) => {
    setCurrentSection(path);
    navigate(path);
  };

  useEffect(() => {
    // Mantiene la sección activa sincronizada con la ruta actual
    if (location.pathname !== currentSection) {
      setCurrentSection(location.pathname);
    }
  }, [location.pathname, currentSection, setCurrentSection]);

  return (
    <nav className={`${styles.sidebar} ${isCollapsed && styles.collapsed}`}>
      <PanelRightOpen
        className={`${styles.iconCollapsed} ${
          isCollapsed && styles.iconCollapsedOpen
        }`}
        onClick={toggleCollapsed}
      />
      <section className={styles.containerSections}>
        <Logo size="small" collapsed={isCollapsed} />

        <h3 className={styles.subtitle}>{isCollapsed ? "" : "Secciones"}</h3>
        <ul className={styles.list}>
          {sidebarData.map((item, i) => (
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
      </section>
    </nav>
  );
};

export default Sidebar;
