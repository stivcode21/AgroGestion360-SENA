import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Dashboard.module.css";
import Linkcard from "@/components/molecules/linkCard/LinkCard";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate } from "react-router-dom";
import CardStats from "@/components/atoms/cardStats/CardStats";
import { DollarSign, Trophy } from "lucide-react";

const workers = [{}, {}, {}, {}, {}];

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
        <div className={styles.container}>
          <article className={styles.chart}>a</article>
          <section className={styles.box}>
            <CardStats title="Total activos" icon={<DollarSign />}>
              <p className={styles.number}>10.000</p>
            </CardStats>

            <CardStats title="Top trabajadores" icon={<Trophy />}>
              <div className={styles.containerTop}>
                {workers.map((_, index) => (
                  <article key={index} className={styles.userTop}>
                    <span className={styles.top}>{index + 1}</span>
                    <figure>
                      <img
                        src="https://i.pinimg.com/736x/70/32/3f/70323ffbb5122198b97cfa259c313678.jpg"
                        alt="logo-trabajado"
                        className={styles.img}
                      />
                    </figure>
                    <div>
                      <h4>Armando banquitos</h4>
                      <p>19 actividades</p>
                    </div>
                  </article>
                ))}
              </div>
            </CardStats>
          </section>
        </div>
      </section>
    </MainLayout>
  );
};

export default Dashboard;
