import { KeyRound, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";
import Button from "@/components/templates/button/Button";
import {
  settingsProfileFieldValidations,
  settingsProfileInitialValues,
  settingsProfileInputFields,
} from "@/data/settingsProfileData";
import styles from "./SettingsPanel.module.css";

const SettingsPanel = ({ onOpenCredentials }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});

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
    const rule = settingsProfileFieldValidations[name];

    if (rule?.pattern && !rule.pattern.test(trimmedValue)) {
      setErrors((prev) => ({ ...prev, [name]: rule.message }));
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if (settingsProfileInitialValues.avatar) {
      setPreviewUrl(settingsProfileInitialValues.avatar);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Mi perfil</h2>
          <p className={styles.subtitle}>
            Edita tu informacion personal. Recuerda guardar los cambios antes de
            salir de esta seccion.
          </p>
        </div>
        <button
          type="button"
          className={styles.credentialsButton}
          onClick={() =>
            onOpenCredentials?.({
              userId: settingsProfileInitialValues.document,
              defaultUsername: settingsProfileInitialValues.name,
            })
          }
        >
          <KeyRound size={16} />
          Gestionar credenciales de acceso
        </button>
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
            {settingsProfileInputFields.map((field) => (
              <FormInput
                key={field.name}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                select={field?.select}
                validation={settingsProfileFieldValidations[field.name]}
                error={errors[field.name]}
                onBlur={handleBlur}
                type={field?.type}
                defaultValue={settingsProfileInitialValues[field.name] ?? ""}
                disabled={field?.name === "role"}
              />
            ))}
          </div>
          <div className={styles.footerActions}>
            <Button type="three">
              <Save /> Guardar
            </Button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default SettingsPanel;
