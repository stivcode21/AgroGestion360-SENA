import { useEffect } from "react";
import Sidebar from "@/components/molecules/sidebar/Sidebar";
import styles from "./MainLayout.module.css";
import Header from "@/components/molecules/header/Header";
import NavbarMobile from "@/components/molecules/navbarMobile/NavbarMobile";
import { useSidebarStore } from "@/store/sidebarStore";
import DetailsModal from "../detailsModal/DetailsModal";
import ProductDetails from "@/components/organism/productDetails/ProductDetails";
import { useModalStore } from "@/store/modalStore";
import { useLocation } from "react-router-dom";
import WokerDetails from "@/components/organism/wokerDetails/WokerDetails";
import ActivityDetails from "@/components/organism/activityDetails/ActivityDetails";
import GanaderiaDetails from "@/components/organism/ganaderiaDetails/GanaderiaDetails";
import PorciculturaDetails from "@/components/organism/porciculturaDetails/PorciculturaDetails";

const MainLayout = ({ children }) => {
  const { isCollapsed, isDesktop, setIsDesktop } = useSidebarStore();
  const { isOpenModal } = useModalStore();

  const location = useLocation();
  // dependinedo la ruta mapeamos componentes de detalle para mostrar en el modal
  const detailRoutes = [
    { path: "/inventario", component: ProductDetails },
    { path: "/trabajadores", component: WokerDetails },
    { path: "/actividades", component: ActivityDetails },
    { path: "/ganaderia", component: GanaderiaDetails },
    { path: "/porcicultura", component: PorciculturaDetails },
  ];
  const activeDetail = detailRoutes.find(
    (item) => item.path === location.pathname,
  );
  const ActiveDetailComponent = activeDetail?.component;

  // Colapsar automaticamente en pantallas peque�as, expandir en desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsDesktop]);

  return (
    <section className={styles.container}>
      {isOpenModal && ActiveDetailComponent && (
        <DetailsModal>
          <ActiveDetailComponent />
        </DetailsModal>
      )}

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
