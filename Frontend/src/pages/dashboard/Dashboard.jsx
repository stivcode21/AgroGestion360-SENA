import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Dashboard.module.css";
import Linkcard from "@/components/molecules/linkCard/LinkCard";
import { sidebarData } from "@/data/sidebarData";
import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate } from "react-router-dom";
import CardStats from "@/components/atoms/cardStats/CardStats";
import { useEffect, useState } from "react";
import { DollarSign, Trophy } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import previuIMG from "@/assets/img/previuUser.png";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const emptyActivitySeries = [
  { day: "Lun", total: 0 },
  { day: "Mar", total: 0 },
  { day: "Mie", total: 0 },
  { day: "Jue", total: 0 },
  { day: "Vie", total: 0 },
  { day: "Sab", total: 0 },
  { day: "Dom", total: 0 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useSidebarStore();
  const [cardsStats, setCardsStats] = useState({
    "/inventario": 0,
    "/trabajadores": 0,
    "/actividades": 0,
    "/ganaderia": 0,
  });
  const [dashboardOverview, setDashboardOverview] = useState({
    activityPayments: {
      total: 0,
      series: emptyActivitySeries,
    },
    totalAssets: { value: 0 },
    topWorkers: [],
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

  const handleSection = (path) => {
    setCurrentSection(path);
    navigate(path);
  };

  useEffect(() => {
    const getDashboardStats = async () => {
      try {
        const [cardsRes, overviewRes] = await Promise.all([
          fetch(buildApiUrl("statistics/dashboard-cards"), {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(buildApiUrl("statistics/dashboard-overview"), {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
        ]);

        const cardsData = await cardsRes.json();
        const overviewData = await overviewRes.json();

        if (!cardsRes.ok) {
          toast.error(cardsData.message);
          return;
        }

        if (!overviewRes.ok) {
          toast.error(overviewData.message);
          return;
        }

        setCardsStats({
          "/inventario": cardsData.data?.inventario ?? 0,
          "/trabajadores": cardsData.data?.trabajadores ?? 0,
          "/actividades": cardsData.data?.actividades ?? 0,
          "/ganaderia": cardsData.data?.ganaderia ?? 0,
        });
        setDashboardOverview({
          activityPayments: {
            total: overviewData.data?.activityPayments?.total ?? 0,
            series:
              overviewData.data?.activityPayments?.series ?? emptyActivitySeries,
          },
          totalAssets: {
            value: overviewData.data?.totalAssets?.value ?? 0,
          },
          topWorkers: overviewData.data?.topWorkers ?? [],
        });
      } catch (error) {
        console.error("Error al obtener estadisticas del dashboard:", error);
        toast.error("No se pudieron cargar las estadisticas.");
      }
    };

    getDashboardStats();
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
                <h3 className={styles.chartTitle}>Actividades completadas</h3>
                <p className={styles.chartSubtitle}>
                  Cantidad agrupada por dia de registro
                </p>
              </div>
              <span className={styles.chartValue}>
                {dashboardOverview.activityPayments.total}
              </span>
            </header>
            <div className={styles.chartBody}>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart
                  data={dashboardOverview.activityPayments.series}
                  barSize={26}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tickFormatter={(value) => compactFormatter.format(value)}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(2, 132, 72, 0.08)" }}
                    formatter={(value) => [`${value} actividades`, "Total"]}
                  />
                  <Bar dataKey="total" radius={[5, 5, 0, 0]} fill="#1f7a3f" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
          <section className={styles.box}>
            <CardStats title="Total activos" icon={<DollarSign />}>
              <p className={styles.number}>
                {currencyFormatter.format(dashboardOverview.totalAssets.value)}
              </p>
            </CardStats>

            <CardStats title="Top trabajadores" icon={<Trophy />}>
              <div className={styles.containerTop}>
                {dashboardOverview.topWorkers.length > 0 ? (
                  dashboardOverview.topWorkers.map((worker, index) => (
                    <article
                      key={worker.id_trabajador}
                      className={styles.userTop}
                    >
                      <span className={styles.top}>{index + 1}</span>
                      <figure>
                        <img
                          src={worker.url_img || previuIMG}
                          alt={worker.nombre_completo}
                          className={styles.img}
                        />
                      </figure>
                      <div>
                        <h4>{worker.nombre_completo}</h4>
                        <p>{worker.total_actividades} actividades</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className={styles.emptyTop}>
                    Aun no hay trabajadores con actividades registradas.
                  </p>
                )}
              </div>
            </CardStats>
          </section>
        </div>
      </section>
    </MainLayout>
  );
};

export default Dashboard;
