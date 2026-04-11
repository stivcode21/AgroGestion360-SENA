import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./GanaderiaForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Plus, Save, Syringe, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImgPicker from "@/components/atoms/imgPicker/ImgPicker";
import VacunaForm from "@/components/organism/vacunaForm/VacunaForm";
import { cattleInputFields } from "@/data/cattleData";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import { formatDate } from "@/utils/formatDate";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";

const GanaderiaForm = ({ title }) => {
  const [errors, setErrors] = useState({});
  const { toggleLoader } = useLoader();
  const { openActionModal } = useActionModal();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    raza: "",
    fecha_nacimiento: "",
    peso_inicial: "",
    estado_salud: "",
    observaciones: "",
    url_img: "",
    origen_ciudad: "",
    vendido: false,
  });
  const [vaccinations, setVaccinations] = useState([]);
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (!/^[A-Za-z\s]{2,}$/.test(formData.nombre.trim())) {
      newErrors.nombre = "Solo letras y espacios (min 2 caracteres)";
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = "Selecciona un tipo.";
    }

    if (!formData.raza.trim()) {
      newErrors.raza = "La raza es obligatoria.";
    } else if (!/^[A-Za-z\s]{3,}$/.test(formData.raza.trim())) {
      newErrors.raza = "Solo letras y espacios (min 3)";
    }

    if (
      formData.fecha_nacimiento &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.fecha_nacimiento)
    ) {
      newErrors.fecha_nacimiento = "Formato esperado YYYY-MM-DD";
    }

    if (!String(formData.peso_inicial).trim()) {
      newErrors.peso_inicial = "El peso es obligatorio.";
    } else if (!/^\d{1,4}$/.test(String(formData.peso_inicial))) {
      newErrors.peso_inicial = "Ingresa un peso valido";
    }

    if (!formData.estado_salud.trim()) {
      newErrors.estado_salud = "Selecciona un estado.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Obtener datos en edición
  useEffect(() => {
    if (!isEditMode) return;

    const getDetails = async () => {
      try {
        toggleLoader(true);

        const res = await fetch(buildApiUrl(`ganaderia/getganaderia/${id}`), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        const cattle = data.data;
        setFormData({
          nombre: cattle.nombre ?? "",
          tipo: cattle.tipo ?? "",
          raza: cattle.raza ?? "",
          fecha_nacimiento: cattle.fecha_nacimiento ?? "",
          peso_inicial: String(cattle.peso_inicial ?? ""),
          estado_salud: cattle.estado_salud ?? "",
          observaciones: cattle.observaciones ?? "",
          url_img: cattle.url_img ?? "",
          origen_ciudad: cattle.origen_ciudad ?? "",
          vendido: cattle.vendido,
        });
        setVaccinations(
          (data.vacunas ?? []).map((vacuna) => ({
            localId:
              globalThis.crypto?.randomUUID?.() ??
              `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            tipoVacuna: vacuna?.tipo_vacuna ?? "",
            dosis: vacuna?.dosis ?? "",
            fecha_aplicacion: formatDate(vacuna.fecha_aplicacion),
            responsable: vacuna?.responsable ?? "",
            observaciones2: vacuna?.observaciones ?? "",
          })),
        );
      } catch (error) {
        console.error("Error en getDetails:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getDetails();
  }, [id, isEditMode]);

  const handleBlur = (e) => {
    const { name } = e.target;
    validateForm();
    setErrors((prev) => ({ ...prev, [name]: prev[name] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "vendido" ? value === "true" : value,
    }));
  };

  const handleAddVaccination = (vaccination) => {
    setVaccinations((prev) => [...prev, vaccination]);
    setIsVaccinationModalOpen(false);
  };

  const handleRemoveVaccination = (localId) => {
    setVaccinations((prev) =>
      prev.filter((vaccination) => vaccination.localId !== localId),
    );
  };

  const openDeleteVaccinationModal = (vaccination) => {
    openActionModal({
      variant: "delete",
      title: "Quieres eliminar",
      highlight: vaccination?.tipoVacuna || "esta vacunacion",
      description:
        "Esta accion eliminara la vacunacion del formulario. Recuerda guardar para aplicar el cambio definitivamente.",
      onConfirm: () => handleRemoveVaccination(vaccination.localId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      toggleLoader(true);

      const endpoint = isEditMode
        ? `ganaderia/editganaderia/${id}`
        : "ganaderia/createganaderia";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(buildApiUrl(endpoint), {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          tipo: formData.tipo,
          raza: formData.raza.trim(),
          fecha_nacimiento: formData.fecha_nacimiento || null,
          peso_inicial: Number(formData.peso_inicial),
          estado_salud: formData.estado_salud,
          observaciones: formData.observaciones || null,
          url_img: formData.url_img || null,
          origen_ciudad: formData.origen_ciudad || null,
          fecha_ingreso: null,
          vendido: formData.vendido,
          vacunas: vaccinations.map(
            ({ localId, ...vaccination }) => vaccination,
          ),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      navigate("/ganaderia");
    } catch (error) {
      console.error("Error en ganaderia form:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        {isVaccinationModalOpen && (
          <div
            className={styles.innerModalBackdrop}
            onClick={() => setIsVaccinationModalOpen(false)}
          >
            <div
              className={styles.innerModalCard}
              onClick={(event) => event.stopPropagation()}
            >
              <VacunaForm
                onAddVaccination={handleAddVaccination}
                onCancel={() => setIsVaccinationModalOpen(false)}
              />
            </div>
          </div>
        )}

        <button className={styles.titleGroup}>
          <Link to="/ganaderia" className={styles.back}>
            <ArrowLeft />
            <span>Volver</span>
          </Link>
        </button>

        <header>
          <h1 className={styles.title}>{title}</h1>
        </header>

        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Informacion</h3>

          <form className={styles.formLayout} onSubmit={handleSubmit}>
            <ImgPicker
              urlValue={formData.url_img}
              setUrlState={(url) =>
                setFormData((prev) => ({ ...prev, url_img: url }))
              }
              title="Foto del animal"
              description="Sube una imagen en PNG o JPG"
            />

            <div className={styles.inputsGrid}>
              {cattleInputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  select={field?.select}
                  error={errors[field.name]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required={field?.required}
                  type={field?.type}
                  disabled={field.name === "vendido" && isEditMode}
                  value={
                    field.name === "vendido"
                      ? String(formData[field.name])
                      : (formData[field.name] ?? "")
                  }
                />
              ))}

              <FormTextarea
                label="Observaciones"
                name="observaciones"
                onChange={handleChange}
                placeholder="Agrega observaciones del animal"
                style={{ gridColumn: "1 / -1" }}
                value={formData.observaciones}
              />
            </div>

            <section className={styles.vaccinationSection}>
              <header className={styles.vaccinationHeader}>
                <div>
                  <h3 className={styles.vaccinationTitle}>
                    Registro de vacunacion <span>(Opcional)</span>
                  </h3>
                  <p className={styles.vaccinationDescription}>
                    Agrega una o varias vacunaciones para asociarlas al animal
                    al guardar el formulario.
                  </p>
                </div>

                <button
                  type="button"
                  className={styles.addVaccinationButton}
                  onClick={() => setIsVaccinationModalOpen(true)}
                >
                  <Plus />
                  Agregar vacunacion
                </button>
              </header>

              <div className={styles.vaccinationList}>
                {vaccinations.length === 0 ? (
                  <p className={styles.emptyVaccinations}>
                    Aun no has agregado vacunaciones.
                  </p>
                ) : (
                  vaccinations.map((vaccination) => (
                    <article
                      key={vaccination.localId}
                      className={styles.vaccinationCard}
                    >
                      <div className={styles.vaccinationInfo}>
                        <h4 className={styles.vaccinationName}>
                          <Syringe className={styles.vaccinationIcon} />
                          {vaccination.tipoVacuna || "Vacunacion sin nombre"}
                          {" -> "}{" "}
                          <span className={styles.vaccinationDosis}>
                            {vaccination.dosis || "Sin dosis"}
                          </span>
                        </h4>
                        <p className={styles.vaccinationMeta}>
                          <span className={styles.vaccinationLabel}>
                            Fecha:
                          </span>{" "}
                          {vaccination.fecha_aplicacion || "Sin fecha"}
                        </p>
                        <p className={styles.vaccinationMeta}>
                          <span className={styles.vaccinationLabel}>
                            Responsable:
                          </span>{" "}
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

                      <button
                        type="button"
                        className={styles.deleteVaccinationButton}
                        onClick={() => openDeleteVaccinationModal(vaccination)}
                        aria-label={`Eliminar vacunacion ${vaccination.tipoVacuna}`}
                      >
                        <Trash2 />
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>

            <div className={styles.footerActions}>
              <Button type="three" buttonType="submit">
                <Save /> Guardar
              </Button>
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default GanaderiaForm;
