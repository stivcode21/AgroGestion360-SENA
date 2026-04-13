import styles from "./Reportes.module.css";
import MainLayout from "@/components/templates/mainLayout/MainLayout";
import { buildApiUrl } from "@/utils/apiBase";
import { generateReportPdf } from "@/utils/generateReportPdf";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import toast from "react-hot-toast";
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
  const { toggleLoader } = useLoader();

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
      key: "sales",
      title: "Ventas de animales",
      tag: fixedPeriodLabel,
      updated: "Incluye todo el historial reciente",
      description:
        "Resumen de ventas por especie, cantidad vendida y monto total durante los ultimos 6 meses.",
      icon: <PiggyBank />,
    },
    {
      key: "inventory",
      title: "Inventario",
      tag: fixedPeriodLabel,
      updated: "Incluye todo el historial reciente",
      description:
        "Consolidado de entradas, salidas y niveles de stock de insumos en los ultimos 6 meses.",
      icon: <Package />,
    },
    {
      key: "payroll",
      title: "Pago nomina trabajadores",
      tag: fixedPeriodLabel,
      updated: "Incluye todo el historial reciente",
      description:
        "Detalle de pagos de nomina, costos por trabajador y totales del periodo de los ultimos 6 meses.",
      icon: <Users />,
    },
  ];

  const handleGenerateReport = async (reportKey) => {
    const reportEndpoints = {
      sales: "report/cattle-sales",
      inventory: "report/inventory",
      payroll: "report/payroll",
    };

    const endpoint = reportEndpoints[reportKey];

    try {
      toggleLoader(true);

      // Pide al backend el JSON ya preparado con la data real del reporte.
      const res = await fetch(buildApiUrl(endpoint), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "No se pudo generar el reporte.");
        return;
      }

      // Con ese JSON se construye y descarga el PDF en el navegador.
      generateReportPdf(data.data);
      toast.success("Reporte descargado correctamente.");
    } catch (error) {
      console.error("Error al descargar reporte:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

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
              <article
                key={report.title}
                className={styles.reportItem}
                onClick={() => handleGenerateReport(report.key)}
              >
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
                    className={styles.reportActionButton}
                    type="button"
                    aria-label={`Descargar reporte ${report.title}`}
                    onClick={() => handleGenerateReport(report.key)}
                  >
                    <span>Generar</span>
                    <Download />
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
