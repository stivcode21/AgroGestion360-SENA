import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Inventario.module.css";
import Button from "@/components/templates/button/Button";
import { ChevronDown, Eye, Filter, Plus, Search } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { Link } from "react-router-dom";
import { useState } from "react";
import FiltersBox from "../../components/molecules/filtersBox/FiltersBox";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import previuIMG from "@/assets/img/previuProduct.jpg";
import { productInputFields } from "@/data/productRegisterData";
import { useDataStore } from "@/store/dataStore";
import { sidebarData } from "../../data/sidebarData";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const Inventario = () => {
  const { setIsOpenModal, setSelectProduct } = useModalStore();
  const [state, setState] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableEndpoint, setTableEndpoint] = useState("product/list");
  const [filterQueryParams, setFilterQueryParams] = useState({});
  const [search, setSearch] = useState("");
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const { products, setProducts } = useDataStore();

  const { toggleLoader } = useLoader();
  const productTypeEndpoint = productInputFields.find(
    (field) => field.name === "type",
  )?.select?.endpoint;

  const OpenModal = (product) => {
    setIsOpenModal(true);
    setSelectProduct(product);
  };

  const normalizedSearch = search.trim();
  const hasActiveFilters = Object.keys(filterQueryParams).length > 0;
  // La tabla trabaja en un solo modo activo: busqueda, filtros o listado normal.
  const tableMode = normalizedSearch
    ? "search"
    : hasActiveFilters
      ? "filter"
      : "default";

  useEffect(() => {
    if (!productTypeEndpoint) return;

    const getProductTypeOptions = async () => {
      try {
        const res = await fetch(buildApiUrl(productTypeEndpoint), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        setProductTypeOptions(
          (data.data ?? []).map((item) => ({
            value: String(item.id),
            label: item.nombre,
          })),
        );
      } catch (error) {
        console.error("Error al cargar tipos de insumo:", error);
      }
    };

    getProductTypeOptions();
  }, [productTypeEndpoint]);

  useEffect(() => {
    // Cuando los filtros traen la data directamente, evitamos una segunda consulta.
    if (tableMode === "filter") {
      return;
    }

    const getProducts = async () => {
      try {
        toggleLoader(true);

        const searchParams = new URLSearchParams();

        // En modo busqueda solo enviamos el texto escrito por el usuario.
        if (normalizedSearch) {
          searchParams.set("search", normalizedSearch);
        }

        const queryString = searchParams.toString();
        // El endpoint se decide segun si hay texto de busqueda o no
        const currentEndpoint = queryString ? "product/filter" : "product/list";
        const requestPath = queryString
          ? `${currentEndpoint}/1?${queryString}`
          : `${currentEndpoint}/1`;

        // Carga inicial de inventario: la tabla parte siempre desde la primera pagina.
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
        setProducts(data.data);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        console.error("Error en getProducts:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };
    getProducts();
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

  // datos para la descripcion pagina
  const info = sidebarData.find((item) => item.title === "Inventario");

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{info?.title}</h1>
            <p className={styles.description}>{info?.description}</p>
          </div>
          <Link to={`/inventario/registrar`}>
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
                placeholder="Buscar por nombre o marca"
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
                endpoint="product/filter"
                defaultEndpoint="product/list"
                setData={setProducts}
                setPage={setPage}
                setEndpoint={setTableEndpoint}
                setQueryParams={setFilterQueryParams}
                setTotalPages={setTotalPages}
                typeOptions={productTypeOptions}
                setSearch={setSearch}
              />
            )}
          </div>

          <div className={styles.tableWrapper}>
            <TableLayout
              headers={[
                "Nombre",
                "Codigo",
                "Cantidad",
                "Tipo",
                "Precio uni",
                "",
              ]}
              columns="2.3fr 1fr 0.7fr 0.8fr 0.7fr 0.25fr"
              compactColumns="2fr 1fr 1fr 1fr 1fr 0.5fr"
              setPage={setPage}
              setData={setProducts}
              page={page}
              totalPages={totalPages}
              endpoint={tableEndpoint}
              queryParams={tableQueryParams}
            >
              {products.length === 0 ? (
                // Mensaje visible cuando la consulta no devuelve filas.
                <li className={tableStyles.empty}>
                  No se encontraron productos para esta busqueda.
                </li>
              ) : (
                products.map((item) => (
                  <li key={item.id_insumo} className={tableStyles.row}>
                    <div className={tableStyles.itemInfo}>
                      <figure className={tableStyles.thumbnail}>
                        <img
                          src={item?.url_img || previuIMG}
                          alt={item.nombre}
                        />
                      </figure>
                      <div>
                        <p className={tableStyles.title}>{item.nombre}</p>
                        <span className={tableStyles.subtitle}>
                          {item.marca}
                        </span>
                      </div>
                    </div>
                    <span
                      className={tableStyles.value}
                    >{`PRD-${item.id_insumo}`}</span>
                    <span className={tableStyles.value}>{item.cantidad}</span>
                    <span className={tableStyles.tag}>{item.tipo}</span>
                    <span className={tableStyles.emphasis}>
                      {currencyFormatter.format(item.precio_unitario)}
                    </span>
                    <button
                      type="button"
                      className={tableStyles.actionButton}
                      onClick={() => OpenModal(item)}
                      aria-label={`Ver detalles de ${item.nombre}`}
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

export default Inventario;
