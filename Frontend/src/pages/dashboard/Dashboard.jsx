import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Dashboard.module.css";
import Linkcard from "@/components/molecules/linkCard/LinkCard";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useSidebarStore();

  const handleSection = (path) => {
    setCurrentSection(path);
    navigate(path);
  };
  return (
    <MainLayout>
      <section className={styles.page}>
        <article className={styles.content}>
          {sidebarData.slice(1, 7).map((item, i) => {
            return (
              <Linkcard
                key={i}
                icon={item.icon}
                title={item.title}
                description={item.description}
                onClick={() => handleSection(item.path)}
              />
            );
          })}
        </article>
      </section>
    </MainLayout>
  );
};

export default Dashboard;
