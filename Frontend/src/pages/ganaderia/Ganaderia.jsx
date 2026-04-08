import MainLayout from "@/components/templates/mainLayout/MainLayout";
import Button from "@/components/templates/button/Button";
import styles from "./Ganaderia.module.css";
import { Plus, Search, Eye, Filter, ChevronDown } from "lucide-react";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { useModalStore } from "@/store/modalStore";
import { useDataStore } from "@/store/dataStore";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FiltersBox from "../../components/molecules/filtersBox/FiltersBox";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import previuIMG from "@/assets/img/previuUser.png";

const ganaderiaTypeOptions = [
  { label: "Bovino", value: "bovino" },
  { label: "Porcino", value: "porcino" },
  { label: "Caprino", value: "caprino" },
];

const Ganaderia = () => {
  const { setIsOpenModal, setSelectCattle, selectCattle } = useModalStore();
  const { ganaderia, setGanaderia } = useDataStore();

  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableEndpoint, setTableEndpoint] = useState("ganaderia/list");
  const [filterQueryParams, setFilterQueryParams] = useState({});
  const [search, setSearch] = useState("");

  const { toggleLoader } = useLoader();

  const OpenModal = (ganaderia) => {
    setIsOpenModal(true);
    setSelectCattle(ganaderia);
  };

  const normalizedSearch = search.trim();
  const hasActiveFilters = Object.keys(filterQueryParams).length > 0;
  console.log("Ganaderia data in component:", ganaderia);
  const tableMode = normalizedSearch
    ? "search"
    : hasActiveFilters
      ? "filter"
      : "default";

  useEffect(() => {
    if (tableMode === "filter") return;

    const getGanaderia = async () => {
      try {
        toggleLoader(true);

        const searchParams = new URLSearchParams();

        if (normalizedSearch) {
          searchParams.set("search", normalizedSearch);
        }

        const queryString = searchParams.toString();

        const currentEndpoint = queryString
          ? "ganaderia/filter"
          : "ganaderia/list";

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

        console.log("Ganaderia data:", data);

        setPage(1);
        setTableEndpoint(currentEndpoint);
        setGanaderia(data.data || []);
        setTotalPages(Math.ceil((data.total || 0) / 10));
      } catch (error) {
        console.error("Error en getGanaderia:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getGanaderia();
  }, [normalizedSearch, tableMode]);

  const tableQueryParams =
    tableMode === "search" && normalizedSearch
      ? { search: normalizedSearch }
      : filterQueryParams;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      setFilterQueryParams({});
      setPage(1);
    }
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Ganaderia</h1>
          <Link to="/ganaderia/registrar">
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
                placeholder="Buscar animal"
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <button
              className={styles.filter}
              type="button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter />
              Filtros
              <ChevronDown />
            </button>

            {showFilters && (
              <FiltersBox
                endpoint="ganaderia/filter"
                defaultEndpoint="ganaderia/list"
                setData={setGanaderia}
                setPage={setPage}
                setEndpoint={setTableEndpoint}
                setQueryParams={setFilterQueryParams}
                setTotalPages={setTotalPages}
                typeOptions={ganaderiaTypeOptions}
                setSearch={setSearch}
              />
            )}
          </div>

          <div className={styles.listWrapper}>
            <TableLayout
              headers={[
                "Animal",
                "Raza",
                "Estado",
                "Peso",
                "Origen",
                "Identificacion",
                "Disponibilidad",
                "",
              ]}
              columns="1.2fr 0.9fr 0.9fr 0.8fr 0.9fr 1fr 0.6fr 0.2fr"
              compactColumns="2fr 1fr 1fr 1fr 1fr 1fr 1fr  0.2fr"
              setPage={setPage}
              setData={setGanaderia}
              page={page}
              totalPages={totalPages}
              endpoint={tableEndpoint}
              queryParams={tableQueryParams}
            >
              {ganaderia.length === 0 ? (
                <li className={tableStyles.empty}>
                  No se encontraron animales.
                </li>
              ) : (
                ganaderia.map((item) => (
                  <li key={item.id_animal} className={tableStyles.row}>
                    <div className={tableStyles.itemInfo}>
                      <figure className={styles.animalThumb}>
                        <img
                          src={
                            item.url_img
                              ? item.url_img.startsWith("http")
                                ? item.url_img
                                : buildApiUrl(item.url_img)
                              : previuIMG
                          }
                          alt={item.nombre}
                        />
                      </figure>
                      <div>
                        <p className={styles.animalName}>{item.nombre}</p>
                        <span className={styles.animalTag}>
                          ID: {item.id_animal}
                        </span>
                      </div>
                    </div>

                    <span className={styles.breed}>{item.raza}</span>

                    <span className={styles.breed}>{item.estado_salud}</span>

                    <span className={styles.weight}>
                      {item.peso_inicial} KG
                    </span>

                    <span className={styles.weight}>
                      {item.origen_ciudad || "Desconocida"}
                    </span>

                    <span className={styles.breed}>{item.marcado}</span>

                    <span
                      className={`${styles.statusTag} ${
                        item.vendido
                          ? styles.disabledStatus
                          : styles.activeStatus
                      }`}
                    >
                      {item.vendido ? "Vendido" : "Disponible"}
                    </span>

                    <button
                      type="button"
                      className={tableStyles.actionButton}
                      onClick={() => OpenModal(item)}
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

export default Ganaderia;
