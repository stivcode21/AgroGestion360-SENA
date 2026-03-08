import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./AdminForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Eye, EyeClosed, Save } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";
import { adminsData } from "@/data/adminsData";
import {
  adminFieldValidations,
  adminInputFields,
} from "@/data/adminRegisterData";

const AdminForm = ({ title }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const admin = adminsData.find((item) => item.id === id);

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

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    const rule = adminFieldValidations[name];
    if (rule?.pattern && !rule.pattern.test(trimmedValue)) {
      setErrors((prev) => ({ ...prev, [name]: rule.message }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    if (isEditMode && admin?.avatar) {
      setPreviewUrl(admin.avatar);
    }
  }, [isEditMode, admin]);

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
          <Link to="/settings" className={styles.back}>
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
              {adminInputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  select={field?.select}
                  validation={adminFieldValidations[field.name]}
                  error={errors[field.name]}
                  onBlur={handleBlur}
                  type={field?.type}
                  defaultValue={isEditMode ? (admin?.[field.name] ?? "") : ""}
                />
              ))}
            </div>
            <div className={styles.containerInput}>
              <span className={styles.label}>Contraseña:</span>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
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

export default AdminForm;
