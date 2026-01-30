import styles from "../productDetails/ProductDetails.module.css";
import { activitiesData } from "@/data/activitiesData";
import { useModalStore } from "@/store/modalStore";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ActivityDetails = () => {
  const { selectActivity, setIsOpenModal } = useModalStore();
  const activity = activitiesData.find((item) => item.id === selectActivity);

  if (!activity) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos de la actividad.</p>
      </div>
    );
  }

  const {
    workerName,
    document,
    statusLabel,
    activity: activityName,
    cost,
    description,
    avatar,
  } = activity;

  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>{activityName}</h2>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles de actividad</h3>

        <div className={styles.actions}>
          <button type="button" className={styles.action}>
            <Trash2 className={styles.icon} />
            <span>Eliminar</span>
          </button>
          <button
            type="button"
            className={styles.action}
            onClick={() => setIsOpenModal(false)}
          >
            <Link to={`/actividades/editar/${selectActivity}`}>
              <Pencil className={styles.icon} />
              <span>Editar</span>
            </Link>
          </button>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.detailCard}>
          <div className={styles.row}>
            <span className={styles.label}>Trabajador</span>
            <span className={styles.value}>{workerName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Documento</span>
            <span className={styles.value}>{document}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Actividad</span>
            <span className={styles.value}>{activityName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Estado</span>
            <span className={styles.value}>{statusLabel}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Costo</span>
            <span className={styles.value}>
              {currencyFormatter.format(cost || 0)}
            </span>
          </div>
          <div className={`${styles.row} ${styles.descriptionRow}`}>
            <span className={styles.label}>Detalle</span>
            <p className={styles.description}>
              {description || "No hay descripcion para esta actividad."}
            </p>
          </div>
          <div className={`${styles.row} ${styles.imageRow}`}>
            <span className={styles.label}>Foto</span>
            <div className={styles.imageWrapper}>
              <div className={styles.imageCard}>
                {avatar ? (
                  <img src={avatar} alt={workerName} loading="lazy" />
                ) : (
                  <span className={styles.imageBadge}>Sin imagen</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivityDetails;
