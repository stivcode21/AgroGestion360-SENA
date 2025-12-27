import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./WorkerForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";
import {
  workerFieldValidations,
  workerInputFields,
} from "@/data/workerRegisterData";
import { workersData } from "@/data/workersData";

const WorkerForm = ({ title }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const worker = workersData.find((item) => item.id === id);

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Validacion de campos al perder el foco
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    const rule = workerFieldValidations[name];
    if (rule?.pattern && !rule.pattern.test(trimmedValue)) {
      setErrors((prev) => ({ ...prev, [name]: rule.message }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Cargar la imagen existente en modo edicion
  useEffect(() => {
    if (isEditMode && worker?.avatar) {
      setPreviewUrl(worker.avatar);
    }
  }, [isEditMode, worker]);

  // Limpieza de URL al desmontar el componente
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

          <form className={styles.formLayout}>
            <ImagePicker
              handleImageClick={handleImageClick}
              handleImageChange={handleImageChange}
              previewUrl={previewUrl}
              inputRef={inputRef}
            />

            <div className={styles.inputsGrid}>
              {workerInputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  select={field?.select}
                  validation={workerFieldValidations[field.name]}
                  error={errors[field.name]}
                  onBlur={handleBlur}
                  type={field?.type}
                  defaultValue={isEditMode ? worker?.[field.name] ?? "" : ""}
                />
              ))}
              <FormTextarea
                label="Observaciones"
                name="observaciones"
                placeholder="Agrega una observacion del trabajador"
                style={{ gridColumn: "1 / -1" }}
                defaultValue={isEditMode ? worker?.notes ?? "" : ""}
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

export default WorkerForm;
