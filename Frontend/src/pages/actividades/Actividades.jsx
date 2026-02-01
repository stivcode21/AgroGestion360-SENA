import MainLayout from "@/components/templates/mainLayout/MainLayout";
import Button from "@/components/templates/button/Button";
import styles from "./Actividades.module.css";
import { Plus, Search, Eye } from "lucide-react";
import { activitiesData } from "@/data/activitiesData";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const Actividades = () => {
  const { setIsOpenModal, setSelectActivity } = useModalStore();

  const openDetails = (id) => {
    setSelectActivity(id);
    setIsOpenModal(true);
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Actividades</h1>
          <Link to="/actividades/registrar">
            <Button type="three">
              <Plus />
              Agregar
            </Button>
          </Link>
        </header>

        <section className={styles.listCard}>
          <div className={styles.actions}>
            <div className={styles.search}>
              <Search className={styles.icon} />
              <input type="text" placeholder="Buscar" />
            </div>
          </div>

          <div className={styles.listWrapper}>
            <TableLayout
              headers={["Trabajador", "Actividad", "Costo", "Detalles", ""]}
              columns="2.2fr 0.8fr 0.9fr 1.9fr 0.2fr"
              compactColumns="2fr 1fr 1fr 1.2fr 0.5fr"
            >
              {activitiesData.map((item) => (
                <li key={item.id} className={tableStyles.row}>
                  <div className={tableStyles.itemInfo}>
                    <figure className={styles.workerThumb}>
                      <img src={item.avatar} alt={item.workerName} />
                    </figure>
                    <div className={styles.workerInfo}>
                      <span
                        className={`${styles.statusTag} ${styles[item.status]}`}
                      >
                        {item.statusLabel}
                      </span>
                      <p className={styles.workerName}>{item.workerName}</p>
                      <span className={styles.workerDoc}>{item.document}</span>
                    </div>
                  </div>
                  <span className={styles.activityName}>{item.activity}</span>
                  <span className={styles.activityCost}>
                    {formatCurrency(item.cost)}
                  </span>
                  <div className={styles.activityDetails}>
                    {item.description ? (
                      <p className={styles.activityDescription}>
                        {item.description}
                      </p>
                    ) : (
                      <span className={styles.noDescription}>
                        No hay descripcion
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={tableStyles.actionButton}
                    aria-label={`Mas opciones para ${item.workerName}`}
                    onClick={() => openDetails(item.id)}
                  >
                    <Eye />
                  </button>
                </li>
              ))}
            </TableLayout>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default Actividades;
