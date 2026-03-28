import { useState } from "react";
import { ArrowDownAZ, FilterX, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import styles from "./FiltersBox.module.css";

const FiltersBox = ({
  endpoint,
  titleType,
  defaultEndpoint = "list",
  setData,
  setPage,
  setEndpoint,
  setQueryParams,
  setTotalPages,
  typeOptions = [],
  setSearch,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const { toggleLoader } = useLoader();

  // Ejecuta la consulta al backend con los filtros activos o con el estado limpio.
  const runFilterRequest = async (filters = {}) => {
    try {
      toggleLoader(true);

      const searchParams = new URLSearchParams();

      // Solo agrega a la URL los filtros que el usuario realmente selecciono.
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        }
      });

      // Si hay filtros usa el endpoint filtrado; si no, vuelve al listado general.
      const queryString = searchParams.toString();
      const url = queryString
        ? buildApiUrl(`${endpoint}/1?${queryString}`)
        : buildApiUrl(`${defaultEndpoint}/1`);

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || data.error || "No se pudo filtrar.");
        return;
      }

      // Sincroniza la tabla y su estado interno con los filtros que si quedaron aplicados.
      setData(data.data);
      setPage?.(1);
      setTotalPages?.(data.totalPages ?? 1);
      setEndpoint?.(queryString ? endpoint : defaultEndpoint);
      setQueryParams?.(filters);
    } catch (error) {
      console.error("Error al filtrar datos:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  // Toma la seleccion actual del usuario y la convierte en query params.
  const handleApplyFilters = () => {
    const nextFilters = {
      tipo: selectedType,
      orden: selectedOrder,
    };

    setSearch?.("");
    runFilterRequest(nextFilters);
  };

  // Limpia la UI y vuelve a consultar la primera pagina sin filtros.
  const handleClearFilters = () => {
    setSelectedType("");
    setSelectedOrder("");
    setSearch?.("");
    runFilterRequest();
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <p className={styles.sectionTitle}>Filtros</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="filter-type">
            <Tag />
            {titleType || "Tipo"}
          </label>
          <select
            id="filter-type"
            className={styles.select}
            value={selectedType}
            // Guarda el tipo elegido para enviarlo despues al backend.
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
