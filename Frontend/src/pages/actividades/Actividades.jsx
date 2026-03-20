import MainLayout from "@/components/templates/mainLayout/MainLayout";
import Button from "@/components/templates/button/Button";
import styles from "./Actividades.module.css";
import { ChevronDown, Eye, Filter, Plus, Search } from "lucide-react";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import previuIMG from "@/assets/img/previuIMG.webp";
import FiltersBox from "../../components/molecules/filtersBox/FiltersBox";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const Actividades = () => {
  const { setIsOpenModal, setSelectActivity } = useModalStore();
  const [state, setState] = useState(false);
  const [activity, setActivities] = useState([]);
  const [page, setPage] = useState(1);

  const { toggleLoader } = useLoader();

  const openDetails = (activity) => {
    setSelectActivity(activity);
    setIsOpenModal(true);
  };

  useEffect(() => {
    const getactivity = async () => {
      try {
        toggleLoader(true);
        const res = await fetch(buildApiUrl("activity/list/1"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        console.log("Datos de actividades:", data);
        setActivities(data.data);
      } catch (error) {
        console.error("Error en getActivities:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getactivity();
  }, []);

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
              setPage={setPage}
              setActivity={setActivities}
              page={page}
              endpoint="activity/list"
            >
              {activity.map((item) => (
                <li key={item.id_registro} className={tableStyles.row}>
                  <div className={tableStyles.itemInfo}>
                    <figure className={styles.workerThumb}>
                      <img
                        src={item.url_evidencia || previuIMG}
                        alt={item.trabajador}
                      />
                    </figure>

                    <div className={styles.workerInfo}>
                      <span
                        className={`${styles.statusTag} ${styles[item.estado?.toLowerCase()]}`}
                      >
                        {item.estado}
                      </span>
                      <p className={styles.workerName}>{item.trabajador}</p>
                      <span className={styles.workerDoc}>
                        ID: {item.id_registro}
                      </span>
                    </div>
                  </div>

                  <span className={styles.activityName}>
                    {item.duracion || "Sin actividad"}
                  </span>

                  <span className={styles.activityCost}>
                    {formatCurrency(Number(item.monto))}
                  </span>

                  <div className={styles.activityDetails}>
                    {item.observaciones ? (
                      <p className={styles.activityDescription}>
                        {item.observaciones}
                      </p>
                    ) : (
                      <span className={styles.noDescription}>
                        No hay descripción
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={tableStyles.actionButton}
                    aria-label={`Mas opciones para ${item.trabajador}`}
                    onClick={() => openDetails(item)}
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
