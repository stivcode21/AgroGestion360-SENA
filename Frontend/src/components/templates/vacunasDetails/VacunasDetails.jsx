import { useEffect, useState } from "react";
import { Syringe, X } from "lucide-react";
import toast from "react-hot-toast";
import { buildApiUrl } from "@/utils/apiBase";
import { formatDate } from "@/utils/formatDate";
import styles from "./VacunasDetails.module.css";

const VacunasDetails = ({ animalId, animalName, onClose }) => {
  const [vaccinations, setVaccinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!animalId) {
      setVaccinations([]);
      setIsLoading(false);
      return;
    }

    const getVaccinations = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(buildApiUrl(`ganaderia/${animalId}/vacunas`), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(
            data.message || "No se pudieron cargar las vacunaciones.",
          );
          setVaccinations([]);
          return;
        }

        setVaccinations(
          (data.data ?? []).map((vacuna) => ({
            id:
              vacuna.id_vacuna ??
              `${vacuna.tipo_vacuna}-${vacuna.fecha_aplicacion}`,
            tipoVacuna: vacuna.tipo_vacuna ?? "",
            dosis: vacuna.dosis ?? "",
            fecha_aplicacion: formatDate(vacuna.fecha_aplicacion),
            responsable: vacuna.responsable ?? "",
            observaciones2: vacuna.observaciones ?? "",
          })),
        );
      } catch (error) {
        console.error("Error al obtener vacunaciones:", error);
        toast.error("Ha ocurrido un error inesperado.");
        setVaccinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    getVaccinations();
  }, [animalId]);

  return (
    <section className={styles.content}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h3 className={styles.title}>Historial de vacunas</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar historial de vacunas"
          >
            <X size={24} />
          </button>
        </div>
        <p className={styles.description}>
          Revisa el historial de vacunaciones asociado a{" "}
          <span className={styles.animalName}>
            {animalName || "este animal"}
          </span>
          .
        </p>
      </header>

      <div className={styles.list}>
        {isLoading ? (
          <p className={styles.empty}>Cargando vacunaciones...</p>
        ) : vaccinations.length === 0 ? (
          <p className={styles.empty}>
            Este animal aun no tiene vacunaciones registradas.
          </p>
        ) : (
          vaccinations.map((vaccination) => (
            <article key={vaccination.id} className={styles.vaccinationCard}>
              <div className={styles.vaccinationInfo}>
                <h4 className={styles.vaccinationName}>
                  <Syringe className={styles.vaccinationIcon} />
                  {vaccination.tipoVacuna || "Vacunacion sin nombre"} -{" "}
                  <span className={styles.vaccinationDosis}>
                    {vaccination.dosis || "Sin dosis"}
                  </span>
                </h4>
                <p className={styles.vaccinationMeta}>
                  <span className={styles.vaccinationLabel}>Fecha:</span>{" "}
                  {vaccination.fecha_aplicacion || "Sin fecha"}
                </p>
                <p className={styles.vaccinationMeta}>
                  <span className={styles.vaccinationLabel}>Responsable:</span>{" "}
                  {vaccination.responsable || "No especificado"}
                </p>
                {vaccination.observaciones2 ? (
                  <p className={styles.vaccinationObservation}>
                    <span className={styles.vaccinationLabel}>
                      Observaciones:
                    </span>{" "}
                    {vaccination.observaciones2}
                  </p>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default VacunasDetails;
