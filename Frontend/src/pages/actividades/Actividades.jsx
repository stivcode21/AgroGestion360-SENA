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
import FiltersBox from "@/components/molecules/filtersBox/FiltersBox";
import { activityInputFields } from "@/data/activitiesData";

const Actividades = () => {
  const { setIsOpenModal, setSelectActivity } = useModalStore();
  const [state, setState] = useState(false);
  const [activity, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [tableEndpoint, setTableEndpoint] = useState("activity/list");
  const [filterQueryParams, setFilterQueryParams] = useState({});

  const { toggleLoader } = useLoader();

  // Opciones para el filtro de tipo de actividad, obtenidas del archivo de configuración de campos del formulario.
  const activityTypeOptions =
    activityInputFields.find((field) => field.name === "status")?.select
      ?.options ?? [];

  const openDetails = (activity) => {
    setSelectActivity(activity);
    setIsOpenModal(true);
  };

  // Función para formatear valores numéricos como moneda colombiana.
  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  // Efecto para cargar la lista de actividades al montar el componente, haciendo una petición a la API.
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
            <button
              className={styles.filter}
              type="button"
              onClick={() => setState(!state)}
            >
              <Filter />
              Filtros
              <ChevronDown />
            </button>
            {state && (
              <FiltersBox
                endpoint="activity/filter"
                setData={setActivities}
                setPage={setPage}
                setEndpoint={setTableEndpoint}
                setQueryParams={setFilterQueryParams}
                typeOptions={activityTypeOptions}
              />
            )}
          </div>

          <div className={styles.listWrapper}>
            <TableLayout
              headers={["Trabajador", "Actividad", "duracion", "costos", ""]}
              columns="2.2fr 1.4fr 1.4fr 0.8fr 0.2fr"
              compactColumns="2fr 1fr 1fr 1.2fr 0.5fr"
              setPage={setPage}
              setData={setActivities}
              page={page}
              endpoint={tableEndpoint}
              queryParams={filterQueryParams}
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
                    {item.actividad || "Sin actividad"}
                  </span>

                  <span className={styles.activityName}>
                    {item.duracion || ""}
                  </span>

                  <span className={styles.activityCost}>
                    {formatCurrency(Number(item.monto))}
                  </span>

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
