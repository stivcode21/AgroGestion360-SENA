import styles from "./Header.module.css";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { getColombiaDate } from "@/utils/getColombiaDate";
import { settingsProfileInitialValues } from "@/data/settingsProfileData";
import { useState } from "react";
import NotificationsModal from "@/components/templates/notificationsModal/NotificationsModal";
import { notificationsData } from "@/data/notificationsData";

const Header = () => {
  const { currentSection, isCollapsed, isDesktop } = useSidebarStore();
  const currentPage = sidebarData.find((item) => item.path === currentSection);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const unreadCount = notifications.filter((item) => !item.read).length;

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    // Marcar todas las notificaciones como leídas
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <header className={`${styles.header} ${isCollapsed && styles.collapsed}`}>
      <section
        className={`${styles.boxTitle} ${!isDesktop && styles.boxTitleSmall}`}
      >
        <h1>{currentPage.title}</h1>
        <span>{getColombiaDate()}</span>
      </section>
      <nav className={styles.navbar}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Abrir notificaciones"
              onClick={toggleNotifications}
            >
              <Bell />
              {unreadCount > 0 ? (
                <span className={styles.badge}>{unreadCount}</span>
              ) : null}
            </button>
          </li>
          <li className={styles.item}>
            <Link to="/settings" className={styles.item}>
              <Settings />
            </Link>
          </li>
        </ul>
        <div className={styles.line}></div>
        <section className={styles.containerUser}>
          {isDesktop ? (
            <div className={styles.description}>
              <h3>{settingsProfileInitialValues.name}</h3>
              <span>{settingsProfileInitialValues.role}</span>
            </div>
          ) : (
            ""
          )}
          <img
            src={settingsProfileInitialValues.avatar}
            className={styles.avatar}
            alt="foto de perfil usuario"
          />
        </section>
      </nav>
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </header>
  );
};

export default Header;
