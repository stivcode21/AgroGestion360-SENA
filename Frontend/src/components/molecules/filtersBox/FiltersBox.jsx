import { useState } from "react";
import { ArrowDownAZ, CalendarClock, FilterX, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import styles from "./FiltersBox.module.css";

const FiltersBox = ({
  endpoint,
  defaultEndpoint = "product/list",
  setData,
  setPage,
  setEndpoint,
  setQueryParams,
  baseQueryParams = {},
  queryKeys = {
    type: "tipo",
    order: "orden",
  },
  typeOptions = [],
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const { toggleLoader } = useLoader();

  const runFilterRequest = async (filters = {}) => {
    try {
      toggleLoader(true);

      const searchParams = new URLSearchParams();

      Object.entries(baseQueryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, value);
        }
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        }
      });

      const queryString = searchParams.toString();
      const url = queryString
        ? buildApiUrl(`${endpoint}/1?${queryString}`)
        : buildApiUrl(`${defaultEndpoint}/1`);

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || data.error || "No se pudo filtrar.");
        return;
      }

      setData(data.data);
      setPage?.(1);
      setEndpoint?.(queryString ? endpoint : defaultEndpoint);
      setQueryParams?.(queryString ? Object.fromEntries(searchParams) : {});
    } catch (error) {
      console.error("Error al filtrar datos:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  const handleApplyFilters = () => {
    runFilterRequest({
      [queryKeys.type]: selectedType,
      [queryKeys.order]: selectedOrder,
    });
  };

  const handleClearFilters = () => {
    setSelectedType("");
    setSelectedOrder("");
    runFilterRequest();
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <p className={styles.sectionTitle}>Filtros</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="filter-type">
            <Tag />
            Tipo
          </label>
          <select
            id="filter-type"
            className={styles.select}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="filter-order">
            <ArrowDownAZ />
            Orden
          </label>
          <select
            id="filter-order"
            className={styles.select}
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="">Sin orden</option>
            <option value="recientes">Recientes</option>
            <option value="az">Alfabetico A-Z</option>
          </select>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={handleApplyFilters}
          >
            Filtrar
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={handleClearFilters}
          >
            <FilterX />
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBox;
