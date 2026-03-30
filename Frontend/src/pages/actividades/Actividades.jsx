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
import { useDataStore } from "@/store/dataStore";

const Actividades = () => {
  const { setIsOpenModal, setSelectActivity } = useModalStore();
  const [state, setState] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableEndpoint, setTableEndpoint] = useState("activity/list");
  const [filterQueryParams, setFilterQueryParams] = useState({});
  const [search, setSearch] = useState("");
  const { activities, setActivities } = useDataStore();

  const { toggleLoader } = useLoader();

  const activityTypeOptions =
    activityInputFields.find((field) => field.name === "status")?.select
      ?.options ?? [];

  const openDetails = (activityItem) => {
    setSelectActivity(activityItem);
    setIsOpenModal(true);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const normalizedSearch = search.trim();
  const hasActiveFilters = Object.keys(filterQueryParams).length > 0;

  // La tabla trabaja en un solo modo activo: busqueda, filtros o listado normal.
  const tableMode = normalizedSearch
    ? "search"
    : hasActiveFilters
      ? "filter"
      : "default";

  useEffect(() => {
    // Cuando los filtros traen la data directamente, evitamos una segunda consulta.
    if (tableMode === "filter") {
      return;
    }

    const getActivities = async () => {
      try {
        toggleLoader(true);

        const searchParams = new URLSearchParams();

        // En modo busqueda solo enviamos el texto escrito por el usuario.
        if (normalizedSearch) {
          searchParams.set("search", normalizedSearch);
        }

        const queryString = searchParams.toString();

        // Si hay busqueda, usamos el endpoint filtrado; si no, el listado general.
        const currentEndpoint = queryString
          ? "activity/filter"
          : "activity/list";

        const requestPath = queryString
          ? `${currentEndpoint}/1?${queryString}`
          : `${currentEndpoint}/1`;

        const res = await fetch(buildApiUrl(requestPath), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        setPage(1);
        setTableEndpoint(currentEndpoint);
        setTotalPages(data.totalPages ?? 1);
        setActivities(data.data ?? []);
      } catch (error) {
        console.error("Error en getActivities:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getActivities();
  }, [normalizedSearch, tableMode]);

  // Estos params se reutilizan en la paginacion para no perder el contexto actual.
  const tableQueryParams =
    tableMode === "search" && normalizedSearch
      ? { search: normalizedSearch }
      : filterQueryParams;

  const handleSearchChange = (e) => {
    const nextValue = e.target.value;

    setSearch(nextValue);

    // Si el usuario busca, limpiamos los filtros para no mezclar modos.
    if (nextValue.trim()) {
      setFilterQueryParams({});
    }
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
              <input
                type="text"
                placeholder="Buscar por actividad o trabajador"
                value={search}
                onChange={handleSearchChange}
              />
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

            {/* componente de filtros, se muestra u oculta segun el estado del boton. */}
            {state && (
              <FiltersBox
                endpoint="activity/filter"
                titleType="Estado"
                defaultEndpoint="activity/list"
                setData={setActivities}
                setPage={setPage}
                setTotalPages={setTotalPages}
                setEndpoint={setTableEndpoint}
                setQueryParams={setFilterQueryParams}
                typeOptions={activityTypeOptions}
                setSearch={setSearch}
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
              totalPages={totalPages}
              endpoint={tableEndpoint}
              queryParams={tableQueryParams}
            >
              {activities.length === 0 ? (
                // Mensaje visible cuando la consulta no devuelve filas.
                <li className={tableStyles.empty}>
                  No se encontraron actividades para esta busqueda.
                </li>
              ) : (
                activities.map((item) => (
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
                ))
              )}
            </TableLayout>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default Actividades;
