import { useEffect } from "react";
import Sidebar from "@/components/molecules/sidebar/Sidebar";
import styles from "./MainLayout.module.css";
import Header from "@/components/molecules/header/Header";
import NavbarMobile from "@/components/molecules/navbarMobile/NavbarMobile";
import { useSidebarStore } from "@/store/sidebarStore";
import DetailsModal from "../detailsModal/DetailsModal";
import ProductDetails from "@/components/organism/productDetails/ProductDetails";

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
      <DetailsModal>
        <ProductDetails />
      </DetailsModal>

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
