import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Workers.module.css";
import Button from "@/components/templates/button/Button";
import { ChevronDown, Eye, Filter, Plus, Search } from "lucide-react";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FiltersBox from "../../components/molecules/filtersBox/FiltersBox";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import previuIMG from "@/assets/img/previuUser.png";
import { workerInputFields } from "@/data/workerRegisterData";

const Workers = () => {
  const { setIsOpenModal, setSelectWoker } = useModalStore();

  const [state, setState] = useState(false);
  const [workers, setworkers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableEndpoint, setTableEndpoint] = useState("workers/list");
  const [filterQueryParams, setFilterQueryParams] = useState({});
  const [search, setSearch] = useState("");

  const { toggleLoader } = useLoader();

  const workersTypeOptions =
    workerInputFields.find((field) => field.name === "id_tipo_trabajador")
      ?.select?.options ?? [];

  const OpenModal = (workers) => {
    console.log(" trabajador seleccionado:", workers);

    setIsOpenModal(true);

    setSelectWoker(workers);
  };

  const normalizedSearch = search.trim();
  const hasActiveFilters = Object.keys(filterQueryParams).length > 0;

  const tableMode = normalizedSearch
    ? "search"
    : hasActiveFilters
      ? "filter"
      : "default";

  useEffect(() => {
    if (tableMode === "filter") return;

    const getworker = async () => {
      try {
        toggleLoader(true);

        const searchParams = new URLSearchParams();

        if (normalizedSearch) {
          searchParams.set("search", normalizedSearch);
        }

        const queryString = searchParams.toString();
        const currentEndpoint = queryString ? "workers/filter" : "workers/list";
        const requestPath = queryString
          ? `${currentEndpoint}/1?${queryString}`
          : `${currentEndpoint}/1`;

        const res = await fetch(buildApiUrl(requestPath), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        setPage(1);
        setTableEndpoint(currentEndpoint);

        setworkers(data.data);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        console.error("Error en getworker:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getworker();
  }, [normalizedSearch, tableMode]);

  const tableQueryParams =
    tableMode === "search" && normalizedSearch
      ? { search: normalizedSearch }
      : filterQueryParams;

  const handleSearchChange = (e) => {
    const nextValue = e.target.value;

    setSearch(nextValue);

    if (nextValue.trim()) {
      setFilterQueryParams({});
    }
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Trabajadores</h1>
          <Link to={`/trabajadores/registrar`}>
            <Button type="three">
              <Plus />
              Agregar
            </Button>
          </Link>
        </header>

        <section className={styles.card}>
          <div className={styles.actions}>
            <div className={styles.search}>
              <Search className={styles.icon} />
              <input
                type="text"
                placeholder="Buscar por nombre"
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

            {state && (
              <FiltersBox
                endpoint="workers/filter"
                defaultEndpoint="workers/list"
                setData={setworkers}
                setPage={setPage}
                setEndpoint={setTableEndpoint}
                setQueryParams={setFilterQueryParams}
                setTotalPages={setTotalPages}
                typeOptions={workersTypeOptions}
                setSearch={setSearch}
              />
            )}
          </div>

          <div className={styles.tableWrapper}>
            <TableLayout
              headers={["Nombre", "Rol", "Estado", "documento", "Celular", ""]}
              columns="2.3fr 1fr 0.7fr 0.8fr 0.7fr 0.25fr"
              compactColumns="2fr 1fr 1fr 1fr 1fr 0.5fr"
              setPage={setPage}
              setData={setworkers}
              page={page}
              totalPages={totalPages}
              endpoint={tableEndpoint}
              queryParams={tableQueryParams}
            >
              {workers.length === 0 ? (
                <li className={tableStyles.empty}>
                  No se encontraron trabajadores para esta busqueda.
                </li>
              ) : (
                workers.map((item) => (
                  <li key={item.id_trabajador} className={tableStyles.row}>
                    <div className={tableStyles.itemInfo}>
                      <figure className={styles.thumbnail}>
                        <img
                          src={
                            item.url_img?.startsWith("http")
                              ? item.url_img
                              : previuIMG
                          }
                          alt={item.nombre_completo}
                        />
                      </figure>
                      <div>
                        <p className={tableStyles.title}>
                          {item.nombre_completo}
                        </p>
                        <span className={tableStyles.subtitle}>
                          ID: {item.id_trabajador}
                        </span>
                      </div>
                    </div>

                    <span className={tableStyles.value}>
                      {item.tipo_trabajador}
                    </span>

                    <span className={tableStyles.tag}>
                      {item.estado ? "Activo" : "Inactivo"}
                    </span>

                    <span className={tableStyles.emphasis}>
                      N° {item.numero_documento}
                    </span>

                    <span className={tableStyles.value}>{item.celular}</span>

                    <button
                      type="button"
                      className={tableStyles.actionButton}
                      onClick={() => OpenModal(item)}
                      aria-label={`Ver detalles de ${item.nombre_completo}`}
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

export default Workers;
