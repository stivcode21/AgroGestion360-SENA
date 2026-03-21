import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./ActivityForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";
import { activitiesData, activityInputFields } from "@/data/activitiesData";

const ActivityForm = ({ title }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    idPerson: "",
    duration: "",
    activity: "",
    status: "",
    dateInit: "",
    cost: "",
    description: "",
  });

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const activity = activitiesData.find((item) => item.id === id);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idPerson.trim()) {
      newErrors.idPerson = "El ID del trabajador es obligatorio.";
    } else if (!/^\d{1,6}$/.test(formData.idPerson.trim())) {
      newErrors.idPerson = "Solo numeros (hasta 6 digitos)";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "La duracion es obligatoria.";
    } else if (!/^.{3,40}$/.test(formData.duration.trim())) {
      newErrors.duration = "Minimo 3 caracteres";
    }

    if (!formData.activity.trim()) {
      newErrors.activity = "La actividad es obligatoria.";
    } else if (!/^[A-Za-z\s]{3,}$/.test(formData.activity.trim())) {
      newErrors.activity = "Solo letras y espacios (min 3 caracteres)";
    }

    if (!formData.status.trim()) {
      newErrors.status = "Selecciona un estado.";
    }

    if (
      formData.dateInit.trim() &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.dateInit.trim())
    ) {
      newErrors.dateInit = "Formato esperado YYYY-MM-DD";
    }

    if (!formData.cost.trim()) {
      newErrors.cost = "El costo es obligatorio.";
    } else if (!/^\d{1,9}$/.test(formData.cost.trim())) {
      newErrors.cost = "Solo numeros (hasta 9 digitos)";
    }

    if (
      formData.description.trim() &&
      !/^.{3,500}$/.test(formData.description.trim())
    ) {
      newErrors.description = "Minimo 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  // Función para manejar el cambio de imagen, creando una URL de objeto para mostrar una vista previa y liberando la URL anterior si existía.
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Función para manejar el evento de desenfoque (blur) en los campos del formulario
  const handleBlur = (e) => {
    const { name } = e.target;
    const isValid = validateForm();

    if (isValid) return;

    setErrors((prev) => ({ [name]: prev[name] }));
  };

  // Función para manejar el cambio de cualquier campo del formulario, actualizando el estado formData con el nuevo valor.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Simulacion temporal del envio hasta conectar con la API real.
    console.log("Formulario de actividad listo para enviar:", formData);
  };

  useEffect(() => {
    if (!isEditMode) return;

    console.log("Modo edicion pendiente de implementar", activity);
  }, [isEditMode, activity]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <MainLayout>
      <section className={styles.page}>
        <button className={styles.titleGroup}>
          <Link to="/actividades" className={styles.back}>
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
            <ImagePicker
              handleImageClick={handleImageClick}
              handleImageChange={handleImageChange}
              previewUrl={previewUrl}
              inputRef={inputRef}
            />

            <div className={styles.inputsGrid}>
              {activityInputFields.map((field) => (
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
                label="Descripcion"
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Agrega una descripcion de la actividad"
                style={{ gridColumn: "1 / -1" }}
                value={formData.description}
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

export default ActivityForm;
