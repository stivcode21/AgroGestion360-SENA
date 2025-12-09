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

const MainLayout = ({ children }) => {
  const { isCollapsed, isDesktop, setIsDesktop } = useSidebarStore();
  const { isOpenModal } = useModalStore();

  const location = useLocation();
  const isInventoryDetails = location.pathname === "/inventario";

  // Colapsar automaticamente en pantallas peque�as, expandir en desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsDesktop]);

  return (
    <section className={styles.container}>
      {isOpenModal && (
        <DetailsModal>
          {isInventoryDetails ? <ProductDetails /> : <WokerDetails />}
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
