import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Dashboard.module.css";
import Linkcard from "@/components/molecules/linkCard/LinkCard";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate } from "react-router-dom";
import CardStats from "@/components/atoms/cardStats/CardStats";
import { useEffect, useState } from "react";
import { DollarSign, Trophy } from "lucide-react";
import { activitiesData } from "@/data/activitiesData";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const workers = [{}, {}, {}, {}, {}];

const Dashboard = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useSidebarStore();
  const [cardsStats, setCardsStats] = useState({
    "/inventario": 0,
    "/trabajadores": 0,
    "/actividades": 0,
    "/ganaderia": 0,
  });

  const dayLabels = {
    0: "Dom",
    1: "Lun",
    2: "Mar",
    3: "Mie",
    4: "Jue",
    5: "Vie",
    6: "Sab",
  };
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  const indexByDay = new Map(dayOrder.map((day, index) => [day, index]));
  const weeklyPayments = dayOrder.map((day) => ({
    day: dayLabels[day],
    total: 0,
  }));

  activitiesData
    .filter((item) => item.status === "completada")
    .forEach((item) => {
      const parsedDate = new Date(item.date);
      if (Number.isNaN(parsedDate.getTime())) return;
      const dayIndex = indexByDay.get(parsedDate.getDay());
      if (dayIndex == null) return;
      weeklyPayments[dayIndex].total += item.cost;
    });

  const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  const compactFormatter = new Intl.NumberFormat("es-CO", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const totalPaid = weeklyPayments.reduce((acc, item) => acc + item.total, 0);

  const handleSection = (path) => {
    setCurrentSection(path);
    navigate(path);
  };

  useEffect(() => {
    const getDashboardCardsStats = async () => {
      try {
        const res = await fetch(buildApiUrl("statistics/dashboard-cards"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        setCardsStats({
          "/inventario": data.data?.inventario ?? 0,
          "/trabajadores": data.data?.trabajadores ?? 0,
          "/actividades": data.data?.actividades ?? 0,
          "/ganaderia": data.data?.ganaderia ?? 0,
        });
      } catch (error) {
        console.error("Error al obtener estadisticas del dashboard:", error);
        toast.error("No se pudieron cargar las estadisticas.");
      }
    };

    getDashboardCardsStats();
  }, []);

  return (
    <MainLayout>
      <section className={styles.page}>
        <article className={styles.content}>
          {sidebarData.slice(1, 5).map((item, i) => {
            return (
              <Linkcard
                key={i}
                icon={item.icon}
                title={item.title}
                description={item.description}
                stats={cardsStats[item.path] ?? 0}
                onClick={() => handleSection(item.path)}
              />
            );
          })}
        </article>
        <div className={styles.container}>
          <article className={styles.chart}>
            <header className={styles.chartHeader}>
              <div>
                <h3 className={styles.chartTitle}>Pagos por actividades</h3>
                <p className={styles.chartSubtitle}>
                  Solo actividades completadas
                </p>
              </div>
              <span className={styles.chartValue}>
                {currencyFormatter.format(totalPaid)}
              </span>
            </header>
            <div className={styles.chartBody}>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={weeklyPayments} barSize={26}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => compactFormatter.format(value)}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(2, 132, 72, 0.08)" }}
                    formatter={(value) => currencyFormatter.format(value)}
                  />
                  <Bar dataKey="total" radius={[5, 5, 0, 0]} fill="#1f7a3f" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
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
