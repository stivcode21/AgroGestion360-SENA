import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { buildApiUrl } from "@/utils/apiBase";
import previuIMG from "@/assets/img/previuUser.png";
import styles from "./WorkerSearchField.module.css";

const WorkerSearchField = ({
  label,
  placeholder,
  selectedWorker,
  error,
  onSelectWorker,
}) => {
  const selectedLabel = useMemo(() => {
    if (!selectedWorker) return "";

    return `${selectedWorker.numero_documento ?? ""}`;
  }, [selectedWorker]);

  const [searchTerm, setSearchTerm] = useState(selectedLabel);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setSearchTerm(selectedLabel);
  }, [selectedLabel]);

  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch || trimmedSearch === selectedLabel.trim()) {
      setResults([]);
      setShowResults(false);
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({ search: trimmedSearch });
        const res = await fetch(
          buildApiUrl(`workers/filter/1?${params.toString()}`),
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "No se pudieron buscar trabajadores.");
          setResults([]);
          setShowResults(false);
          return;
        }

        setResults(
          (data.data ?? []).filter((worker) => worker.estado === true),
        );
        setShowResults(true);
      } catch (fetchError) {
        console.error("Error al buscar trabajadores:", fetchError);
        toast.error("Ha ocurrido un error inesperado.");
        setResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedLabel]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (selectedWorker) {
      onSelectWorker?.(null);
    }
  };

  const handleSelectWorker = (worker) => {
    onSelectWorker?.(worker);
    setSearchTerm(
      `${worker.nombre_completo ?? ""}${worker.numero_documento ? ` · ${worker.numero_documento}` : ""}`,
    );
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="worker-search">
        {label}
      </label>

      <div
        className={`${styles.searchBox} ${error ? styles.searchBoxError : ""}`}
      >
        <Search className={styles.icon} />
        <input
          id="worker-search"
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      {selectedWorker ? (
        <p className={styles.helper}>
          Seleccionado: <strong>{selectedWorker.nombre_completo}</strong> · ID{" "}
          {selectedWorker.id_trabajador}
        </p>
      ) : null}

      {showResults ? (
        <div className={styles.results}>
          {isLoading ? (
            <p className={styles.empty}>Buscando trabajadores...</p>
          ) : results.length === 0 ? (
            <p className={styles.empty}>No se encontraron trabajadores.</p>
          ) : (
            results.map((worker) => (
              <button
                key={worker.id_trabajador}
                type="button"
                className={styles.resultItem}
                onClick={() => handleSelectWorker(worker)}
              >
                <img
                  className={styles.avatar}
                  src={
                    worker.url_img
                      ? worker.url_img.startsWith("http")
                        ? worker.url_img
                        : buildApiUrl(worker.url_img)
                      : previuIMG
                  }
                  alt={worker.nombre_completo}
                />

                <span className={styles.resultText}>
                  <strong>{worker.nombre_completo}</strong>
                  <small>
                    {worker.numero_documento || "Sin documento"} · ID{" "}
                    {worker.id_trabajador}
                  </small>
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}

      {error ? <small className={styles.error}>{error}</small> : null}
    </div>
  );
};

export default WorkerSearchField;
