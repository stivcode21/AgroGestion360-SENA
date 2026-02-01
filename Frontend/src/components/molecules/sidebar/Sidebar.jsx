import { PanelRightOpen } from "lucide-react";
import Logo from "@/components/atoms/logo/Logo";
import styles from "./Sidebar.module.css";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useLocation, useNavigate } from "react-router-dom";
import cowMarcage from "@/assets/img/cowMarcaAgua.png";
import { useEffect, useState } from "react";
import NavList from "@/components/molecules/navList/NavList";
import ActionModal from "@/components/templates/actionModal/ActionModal";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { currentSection, setCurrentSection, isCollapsed, toggleCollapsed } =
    useSidebarStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const exitSecion = () => {
    setIsLogoutOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const res = await fetch(buildApiUrl("auth/logout"), {
        method: "POST", // usamos POST para cerrar sesión
        credentials: "include", // importante para que la cookie httpOnly se envíe
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      navigate("/"); // redirige al inicio o login
    } catch (error) {
      console.error("Error en logout:", error);
      toast.error("Error", "Ha ocurrido un error inesperado.");
    }
  };

  useEffect(() => {
    // Mantiene la seccion activa sincronizada con la ruta actual, salvo en rutas excluidas (formularios)
    const skipPrefixes = [
      "/inventario/registrar",
      "/inventario/editar/",
      "/trabajadores/registrar",
      "/trabajadores/editar/",
      "/actividades/registrar",
      "/actividades/editar/",
      "/ganaderia/registrar",
      "/ganaderia/editar/",
      "/porcicultura/registrar",
      "/porcicultura/editar/",
    ];
    const shouldSkip = skipPrefixes.some((path) =>
      location.pathname.startsWith(path),
    );

    if (!shouldSkip && location.pathname !== currentSection) {
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
            <div key={i}>
              <button
                className={`${styles.item} ${styles.exit}`}
                onClick={() => exitSecion()}
              >
                {item.icon}
                {isCollapsed ? "" : item.title}
              </button>
              <footer className={styles.footer}>{item.description}</footer>
            </div>
          ))}
        </nav>
      </section>
      <ActionModal
        isOpen={isLogoutOpen}
        variant="logout"
        title="Quieres cerrar sesion"
        highlight={sidebarData[7]?.description}
        description="Esta accion te llevara a la pagina de inicio."
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
      {<img src={cowMarcage} alt="decorative" className={styles.decorative} />}
    </section>
  );
};

export default Sidebar;
