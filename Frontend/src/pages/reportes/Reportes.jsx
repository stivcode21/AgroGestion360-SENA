import styles from "./Reportes.module.css";
import MainLayout from "@/components/templates/mainLayout/MainLayout";
import Button from "@/components/templates/button/Button";
import {
  BarChart3,
  Calendar,
  Download,
  FileText,
  Filter,
  Package,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

const Reportes = () => {
  const summaryCards = [
    {
      label: "Reportes generados",
      value: "28",
      icon: <FileText />,
    },
    {
      label: "Último período",
      value: "30 días",
      icon: <Calendar />,
    },
    {
      label: "Tendencia general",
      value: "+8%",
      icon: <TrendingUp />,
    },
  ];

  const reports = [
    {
      title: "Resumen general",
      tag: "Mensual",
      updated: "Actualizado hace 2 días",
      description: "Producción, costos y estado de las actividades.",
      icon: <BarChart3 />,
    },
    {
      title: "Inventario",
      tag: "Semanal",
      updated: "Actualizado recientemente",
      description: "Entradas, salidas y stock crítico de insumos.",
      icon: <Package />,
    },
    {
      title: "Trabajadores",
      tag: "Quincenal",
      updated: "Actualizado hace 1 semana",
      description: "Horas, pagos y rendimiento por equipo.",
      icon: <Users />,
    },
  ];

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Reportes</h1>
            <p className={styles.subtitle}>
              Visualiza, compara y exporta la información más relevante.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button type="secondary">
              <Download />
              Exportar
            </Button>
            <Button type="three">
              <FileText />
              Nuevo reporte
            </Button>
          </div>
        </header>

        <section className={styles.summary}>
          {summaryCards.map((card) => (
            <article key={card.label} className={styles.summaryCard}>
              <div className={styles.summaryIcon}>{card.icon}</div>
              <div>
                <p className={styles.summaryLabel}>{card.label}</p>
                <p className={styles.summaryValue}>{card.value}</p>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <Search className={styles.icon} />
              <input type="text" placeholder="Buscar reporte" />
            </div>
          </div>

          <div className={styles.reportsGrid}>
            {reports.map((report) => (
              <article key={report.title} className={styles.reportItem}>
                <div className={styles.reportIcon}>{report.icon}</div>
                <div className={styles.reportContent}>
                  <div className={styles.reportHeader}>
                    <span className={styles.reportTag}>{report.tag}</span>
                    <span className={styles.reportDate}>{report.updated}</span>
                  </div>
                  <h3 className={styles.reportTitle}>{report.title}</h3>
                  <p className={styles.reportDescription}>
                    {report.description}
                  </p>
                </div>
                <div className={styles.reportActions}>
                  <button
                    className={styles.iconButton}
                    type="button"
                    aria-label={`Descargar reporte ${report.title}`}
                  >
                    <Download />
                  </button>
                  <button className={styles.linkButton} type="button">
                    Ver detalle
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default Reportes;
