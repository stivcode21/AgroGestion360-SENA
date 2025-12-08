import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate } from "react-router-dom";
import styles from "./NavList.module.css";

const NavList = ({ isMobile = false }) => {
  const { currentSection, setCurrentSection, isCollapsed } = useSidebarStore();
  const navigate = useNavigate();

  const handleSection = (path) => {
    setCurrentSection(path);
    navigate(path);
  };

  return (
    <ul className={styles.list}>
      {sidebarData.slice(0, 7).map((item, i) => (
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
