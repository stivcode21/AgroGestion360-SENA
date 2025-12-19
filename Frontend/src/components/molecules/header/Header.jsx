import styles from "./Header.module.css";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { Bell, Moon, Settings } from "lucide-react";

const Header = () => {
  const { currentSection, isCollapsed, isDesktop } = useSidebarStore();
  const currentPage = sidebarData.find((item) => item.path === currentSection);
  return (
    <header className={`${styles.header} ${isCollapsed && styles.collapsed}`}>
      <section
        className={`${styles.boxTitle} ${!isDesktop && styles.boxTitleSmall}`}
      >
        <h1>{currentPage.title}</h1>
        <span>Lunes, 24 Octubre 2025</span>
      </section>
      <nav className={styles.navbar}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Bell />
          </li>
          <li className={styles.item}>
            <Moon />
          </li>
          <li className={styles.item}>
            <Settings />
          </li>
        </ul>
        <div className={styles.line}></div>
        <section className={styles.containerUser}>
          {isDesktop ? (
            <div className={styles.description}>
              <h3>Juan Eduardo</h3>
              <span>Dueño</span>
            </div>
          ) : (
            ""
          )}
          <img
            src="https://i.pinimg.com/736x/70/32/3f/70323ffbb5122198b97cfa259c313678.jpg"
            className={styles.avatar}
            alt="foto de perfil usuario"
          />
        </section>
      </nav>
    </header>
  );
};

export default Header;
