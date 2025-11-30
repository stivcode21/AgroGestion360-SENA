import styles from "./NavbarMobile.module.css";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import NavList from "@/components/molecules/navList/NavList";

const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className={styles.close} /> : <Menu />}
      </button>
      {isOpen && (
        <nav className={styles.navbar}>
          <NavList />
        </nav>
      )}
    </>
  );
};

export default NavbarMobile;
