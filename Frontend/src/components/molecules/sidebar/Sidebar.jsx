import { PanelRightOpen } from "lucide-react";
import Logo from "@/components/atoms/logo/Logo";
import styles from "./Sidebar.module.css";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useUserStore } from "@/store/userStore";
import { useLocation, useNavigate } from "react-router-dom";
import cowMarcage from "@/assets/img/cowMarcaAgua.png";
import { useEffect } from "react";
import NavList from "@/components/molecules/navList/NavList";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";

const Sidebar = () => {
  const { currentSection, setCurrentSection, isCollapsed, toggleCollapsed } =
    useSidebarStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { clearUser } = useUserStore();
  const { openActionModal } = useActionModal();
  const { user } = useUserStore();

  const handleLogoutConfirm = async () => {
    try {
      const res = await fetch(buildApiUrl("auth/logout"), {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      clearUser();
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      console.error("Error en logout:", error);
      toast.error("Error", "Ha ocurrido un error inesperado.");
    }
  };

  const exitSecion = () => {
    openActionModal({
      variant: "logout",
      title: "Quieres cerrar sesion",
      titleSuffix: "",
      highlight: user?.nombre_completo,
      description: "Esta accion te llevara a la pagina de inicio.",
      onConfirm: handleLogoutConfirm,
    });
  };

  useEffect(() => {
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
      "/admin/registrar",
      "/admin/editar/",
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
                onClick={exitSecion}
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
