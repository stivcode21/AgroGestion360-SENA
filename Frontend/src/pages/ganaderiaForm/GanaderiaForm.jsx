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
    name: "",
    tag: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
    status: "",
    milkLiters: "",
    lastCheck: "",
    notes: "",
    url_img: "",
  });
  const [formDataVacuna, setFormDataVacuna] = useState({
    tipoVacuna: "",
    dosisAplicada: "",
    fechaAplicacion: "",
    responsable: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (!/^[A-Za-z\s]{2,}$/.test(formData.name.trim())) {
      newErrors.name = "Solo letras y espacios (min 2 caracteres)";
    }

    if (!formData.tag.trim()) {
      newErrors.tag = "La identificacion es obligatoria.";
    } else if (!/^[A-Za-z0-9-]{2,12}$/.test(formData.tag.trim())) {
      newErrors.tag = "Usa letras, numeros o guion (2-12)";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Selecciona un tipo.";
    }

    if (!formData.breed.trim()) {
      newErrors.breed = "La raza es obligatoria.";
    } else if (!/^[A-Za-z\s]{3,}$/.test(formData.breed.trim())) {
      newErrors.breed = "Solo letras y espacios (min 3)";
    }

    if (formData.age.trim() && !/^.{2,20}$/.test(formData.age.trim())) {
      newErrors.age = "Ingresa una edad valida";
    }

    if (!formData.weight.trim()) {
      newErrors.weight = "El peso es obligatorio.";
    } else if (!/^\d{1,4}$/.test(formData.weight.trim())) {
      newErrors.weight = "Ingresa un peso valido";
    }

    if (!formData.status.trim()) {
      newErrors.status = "Selecciona un estado.";
    }

    if (
      formData.milkLiters.trim() &&
      !/^\d{1,4}$/.test(formData.milkLiters.trim())
    ) {
      newErrors.milkLiters = "Ingresa una produccion valida";
    }

    if (
      formData.lastCheck.trim() &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.lastCheck.trim())
    ) {
      newErrors.lastCheck = "Formato esperado YYYY-MM-DD";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const isValid = validateForm();

    if (isValid) return;

    setErrors((prev) => ({ [name]: prev[name] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!isEditMode) return;

    const getDetails = async () => {
      try {
        toggleLoader(true);

        // Consulta el animal actual para editar con la ultima informacion guardada.
        const res = await fetch(buildApiUrl(`cattle/getcattle/${id}`), {
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
          name: cattle.nombre ?? "",
          tag: cattle.identificacion ?? "",
          type: cattle.tipo ?? "",
          breed: cattle.raza ?? "",
          age: cattle.edad ?? "",
          weight: String(cattle.peso ?? ""),
          status: cattle.estado ?? "",
          milkLiters: String(cattle.produccion_leche ?? ""),
          lastCheck: formatDate(cattle.ultimo_control),
          notes: cattle.observaciones ?? "",
          url_img: cattle.url_img ?? "",
        });

        setFormDataVacuna({
          tipoVacuna: "",
          dosisAplicada: "",
          fechaAplicacion: "",
          responsable: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      toggleLoader(true);

      const endpoint = isEditMode ? `cattle/edit/${id}` : "cattle/register";
      const method = isEditMode ? "PUT" : "POST";

      // Convierte los valores del formulario al formato que espera la API de ganaderia.
      const res = await fetch(buildApiUrl(endpoint), {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre: formData.name.trim(),
          identificacion: formData.tag.trim(),
          tipo: formData.type,
          raza: formData.breed.trim(),
          edad: formData.age || null,
          peso: Number(formData.weight),
          estado: formData.status,
          produccion_leche: formData.milkLiters
            ? Number(formData.milkLiters)
            : null,
          ultimo_control: formData.lastCheck || null,
          observaciones: formData.notes || null,
          url_img: formData.url_img || null,
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
      console.error("Error en inicio de sesion:", error);
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
                  type={field?.type}
                  value={formData[field.name] ?? ""}
                />
              ))}
              <FormTextarea
                label="Observaciones"
                name="notes"
                onChange={handleChange}
                placeholder="Agrega observaciones del animal"
                style={{ gridColumn: "1 / -1" }}
                value={formData.notes}
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
