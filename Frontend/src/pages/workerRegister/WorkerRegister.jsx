import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./WorkerRegister.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/atoms/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";

const inputFields = [
  { name: "name", label: "Nombre completo *", placeholder: "Ej. pepito perez" },
  { name: "age", label: "Edad *", placeholder: "Ej. 20", type: "number" },
  {
    name: "type_dni",
    label: "Tipo de cedula",
    placeholder: "Selecciona un tipo",
    select: {
      options: [
        { label: "cedula de ciudania", value: "cc" },
        { label: "pasaporte", value: "pasaporte " },
      ],
    },
  },
  {
    name: "dni",
    label: "Numero de cedula *",
    placeholder: "Ej. 1023...",
    type: "number",
  },
  {
    name: "phone",
    label: "Numero de celular *",
    placeholder: "Ej. 313821...",
    type: "number",
  },
  {
    name: "address",
    label: "Direccion *",
    placeholder: "Ej. finca tres esquinas",
  },
  {
    name: "phonefamily",
    label: "numero familiar",
    placeholder: "DD-MM-AA",
    type: "number",
  },
];

const fieldValidations = {
  phone: { pattern: /^\d{10}$/, message: "Ingresa exactamente 10 dígitos" },
  dni: { pattern: /^\d{6,12}$/, message: "6 a 12 números" },
};

const WorkerRegister = () => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  // const [formData, setFormData] = useState(initialValues); se le pasa un objeto
  const [errors, setErrors] = useState({});

  const handleImageClick = () => {
    // Relacionamos el input con la imagen
    inputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Limpia URL previa para no dejar referencias colgando
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const rule = fieldValidations[name];
    if (rule?.pattern && !rule.pattern.test(value)) {
      setErrors((prev) => ({ ...prev, [name]: rule.message }));
      console.log(errors);
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    // Limpia al desmontar
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <MainLayout>
      <section className={styles.page}>
        <button className={styles.titleGroup}>
          <Link to="/inventario" className={styles.back}>
            <ArrowLeft />
            <span>Volver</span>
          </Link>
        </button>
        <header>
          <h1 className={styles.title}>Registrar Trabajdor</h1>
        </header>

        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Informacion</h3>

          <form className={styles.formLayout}>
            <ImagePicker
              handleImageClick={handleImageClick}
              handleImageChange={handleImageChange}
              previewUrl={previewUrl}
              inputRef={inputRef}
            />

            <div className={styles.inputsGrid}>
              {inputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  select={field?.select}
                  validation={fieldValidations[field.name]}
                  error={errors[field.name]}
                  onBlur={handleBlur}
                  type={field?.type}
                />
              ))}
              <FormTextarea
                label="Observaciones"
                name="observaciones"
                placeholder="Agrega una observacion del trabajador"
                style={{ gridColumn: "1 / -1" }}
              />
            </div>
            <div className={styles.footerActions}>
              <Button type="three">
                <Save /> Guardar
              </Button>
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default WorkerRegister;
