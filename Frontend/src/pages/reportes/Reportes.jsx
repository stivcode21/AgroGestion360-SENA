import styles from "./Reportes.module.css";
import MainLayout from "@/components/templates/mainLayout/MainLayout";
import {
  Calendar,
  Download,
  FileText,
  Package,
  PiggyBank,
  Users,
} from "lucide-react";

const Reportes = () => {
  const fixedPeriodLabel = "Ultimos 6 meses";

  const summaryCards = [
    {
      label: "Periodo de analisis",
      value: fixedPeriodLabel,
      icon: <FileText />,
    },
    {
      label: "Tipos de reportes",
      value: "3 disponibles",
      icon: <Calendar />,
    },
    {
      label: "Cobertura",
      value: "Datos consolidados",
      icon: <Package />,
    },
  ];

  const reports = [
    {
      title: "Ventas de animales",
      tag: fixedPeriodLabel,
      updated: "Incluye todo el historial reciente",
      description:
        "Resumen de ventas por especie, cantidad vendida y monto total durante los ultimos 6 meses.",
      icon: <PiggyBank />,
    },
    {
      title: "Inventario",
      tag: fixedPeriodLabel,
      updated: "Incluye todo el historial reciente",
      description:
        "Consolidado de entradas, salidas y niveles de stock de insumos en los ultimos 6 meses.",
      icon: <Package />,
    },
    {
      title: "Pago nomina trabajadores",
      tag: fixedPeriodLabel,
      updated: "Incluye todo el historial reciente",
      description:
        "Detalle de pagos de nomina, costos por trabajador y totales del periodo de los ultimos 6 meses.",
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
              Genera y descarga reportes de los ultimos 6 meses.
            </p>
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
          <div className={styles.periodBanner}>
            <Calendar />
            <p>
              Todos los reportes se generan automaticamente con informacion de
              los <strong>ultimos 6 meses</strong>.
            </p>
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
                    Generar
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
