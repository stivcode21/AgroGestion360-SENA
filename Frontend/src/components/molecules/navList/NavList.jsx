import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate } from "react-router-dom";
import styles from "./NavList.module.css";
import { hasRole } from "@/utils/auth";
import { useUserStore } from "@/store/userStore";

const NavList = ({ isMobile = false }) => {
  const { currentSection, setCurrentSection, isCollapsed } = useSidebarStore();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const canView = hasRole(user, 1);

  const handleSection = (path) => {
    setCurrentSection(path);
    navigate(path);
  };

  return (
    <ul className={styles.list}>
      {canView
        ? sidebarData.slice(0, 6).map((item, i) => (
            <li
              key={item.path || i}
              className={`${styles.item} ${
                currentSection === item.path ? styles.active : ""
              } ${isMobile && styles.itemMobile}`}
              onClick={() => handleSection(item.path)}
            >
              {item.icon}
              {isCollapsed ? "" : item.title}
            </li>
          ))
        : sidebarData.slice(0, 5).map((item, i) => (
            <li
              key={item.path || i}
              className={`${styles.item} ${
                currentSection === item.path ? styles.active : ""
              } ${isMobile && styles.itemMobile}`}
              onClick={() => handleSection(item.path)}
            >
              {item.icon}
              {isCollapsed ? "" : item.title}
            </li>
          ))}
    </ul>
  );
};

export default NavList;
