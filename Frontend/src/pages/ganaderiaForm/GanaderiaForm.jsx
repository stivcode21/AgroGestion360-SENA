import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./GanaderiaForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
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

const GanaderiaForm = ({ title }) => {
  const [errors, setErrors] = useState({});
  const { toggleLoader } = useLoader();
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

  const [formDataVacuna, setFormDataVacuna] = useState({
    tipoVacuna: "",
    dosis: "",
    fecha_aplicacion: "",
    responsable: "",
    observaciones2: "",
  });

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
        const vacuna = data.vacuna;

        console.log("Datos vacuna:", vacuna);

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

        setFormDataVacuna({
          tipoVacuna: vacuna?.tipo_vacuna ?? "",
          dosis: vacuna?.dosis ?? "",
          fecha_aplicacion: formatDate(vacuna.fecha_aplicacion),
          responsable: vacuna?.responsable ?? "",
          observaciones2: vacuna?.observaciones ?? "",
        });
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

          tipoVacuna: formDataVacuna.tipoVacuna || null,
          fecha_aplicacion: formDataVacuna.fecha_aplicacion || null,
          dosis: formDataVacuna.dosis || null,
          responsable: formDataVacuna.responsable || null,
          observaciones2: formDataVacuna.observaciones2 || null,
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
                  value={
                    field.name === "vendido"
                      ? String(formData[field.name])
                      : formData[field.name] ?? ""
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

              <VacunaForm
                formDataVacuna={formDataVacuna}
                setFormDataVacuna={setFormDataVacuna}
              />
            </div>

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