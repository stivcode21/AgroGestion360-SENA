import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./WorkerForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImgPicker from "@/components/atoms/imgPicker/ImgPicker";
import { workerInputFields } from "@/data/workerRegisterData";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";

const WorkerForm = ({ title }) => {
  const [errors, setErrors] = useState({});
  const { toggleLoader } = useLoader();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    nombre_completo: "",
    edad: "",
    id_tipo_documento: "",
    numero_documento: "",
    estado: true,
    rol: "",
    celular: "",
    direccion: "",
    observaciones: "",
    url_img: "",
  });

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!String(formData.edad ?? "").trim()) {
      newErrors.edad = "La edad es obligatoria.";
    } else if (!/^(?:1[89]|[2-9]\d)$/.test(String(formData.edad).trim())) {
      newErrors.edad = "Edad debe ser un numero entre 18 y 99";
    }

    if (!formData.id_tipo_documento) {
      newErrors.id_tipo_documento = "Selecciona un tipo de documento.";
    }

    if (!String(formData.numero_documento ?? "").trim()) {
      newErrors.numero_documento = "El numero de documento es obligatorio.";
    } else if (!/^[A-Za-z0-9]{5,}$/.test(String(formData.numero_documento).trim())) {
      newErrors.numero_documento = "Minimo 5 caracteres, solo letras y numeros";
    }

    if (!String(formData.rol ?? "").trim()) {
      newErrors.rol = "El rol es obligatorio.";
    }

    if (!String(formData.celular ?? "").trim()) {
      newErrors.celular = "El numero de telefono es obligatorio.";
    } else if (!/^\d{7,15}$/.test(String(formData.celular).trim())) {
      newErrors.celular = "Ingresa un numero de telefono valido (7-15 digitos)";
    }

    if (!String(formData.direccion ?? "").trim()) {
      newErrors.direccion = "La direccion es obligatoria.";
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
        const res = await fetch(buildApiUrl(`workers/getworker/${id}`), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        const worker = data.data;

        setFormData({
          nombre_completo: worker.nombre_completo ?? "",
          edad: worker.edad ?? "",
          id_tipo_documento: worker.id_tipo_documento ?? "",
          numero_documento: worker.numero_documento ?? "",
          estado: worker.estado ?? true,
          rol: worker.rol ?? "",
          celular: worker.celular ?? "",
          direccion: worker.direccion ?? "",
          observaciones: worker.observaciones ?? "",
          url_img: worker.url_img ?? "",
        });
      } catch (error) {
        toast.error("Error al cargar los detalles del trabajador.");
      } finally {
        toggleLoader(false);
      }
    };

    getDetails();
  }, [id, isEditMode]);

  // Blur para validación individual
  const handleBlur = (e) => {
    const { name } = e.target;
    validateForm();
    setErrors((prev) => ({ ...prev, [name]: prev[name] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "estado") {
      newValue = value === "true";
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      toggleLoader(true);

      const endpoint = isEditMode
        ? `workers/edit/${id}`
        : "workers/register";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(buildApiUrl(endpoint), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo: formData.nombre_completo.trim(),
          edad: Number(formData.edad),
          id_tipo_documento: Number(formData.id_tipo_documento),
          numero_documento: formData.numero_documento.trim(),
          estado: formData.estado,
          rol: formData.rol.trim(),
          celular: formData.celular || null,
          direccion: formData.direccion || null,
          observaciones: formData.observaciones || null,
          url_img: formData.url_img || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      navigate("/trabajadores");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <button className={styles.titleGroup}>
          <Link to="/trabajadores" className={styles.back}>
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
              title="Foto del trabajador"
              description="Sube una imagen en PNG o JPG"
            />

            <div className={styles.inputsGrid}>
              {workerInputFields.map((field) => (
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
                  value={formData[field.name] ?? ""}
                />
              ))}

              <FormTextarea
                label="Observaciones"
                name="observaciones"
                onChange={handleChange}
                placeholder="Agrega una observacion del trabajador"
                style={{ gridColumn: "1 / -1" }}
                value={formData.observaciones ?? ""}
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

export default WorkerForm;
