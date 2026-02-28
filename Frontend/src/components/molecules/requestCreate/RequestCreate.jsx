import { useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import {
  requestCreateFieldValidations,
  requestCreateInputFields,
  requestCreateRequiredFields,
} from "@/data/requestCreateData";
import styles from "./RequestCreate.module.css";

const initialForm = {
  title: "",
  reason: "",
  requestType: "",
  quantity: "",
  targetSpecies: "",
  unit: "",
  provider: "",
  expirationDate: "",
};

const RequestCreate = ({ onCancel, onSubmitRequest }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name, rawValue) => {
    const value = String(rawValue || "").trim();
    const isRequired = requestCreateRequiredFields.includes(name);

    if (isRequired && !value) {
      return "Campo obligatorio";
    }

    if (!value) {
      return "";
    }

    const rule = requestCreateFieldValidations[name];
    if (rule?.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    return "";
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    Object.keys(initialForm).forEach((fieldName) => {
      const fieldError = validateField(fieldName, formData[fieldName]);
      if (fieldError) {
        nextErrors[fieldName] = fieldError;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmitRequest?.(formData);
    setFormData(initialForm);
    setErrors({});
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h4 className={styles.title}>Crear solicitud</h4>
        <p className={styles.description}>
          Completa los datos para enviar una solicitud .
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <FormInput
          label="Titulo *"
          name="title"
          placeholder="Ej. Compra de fertilizante"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.title}
          validation={requestCreateFieldValidations.title}
        />

        <FormTextarea
          label="Motivo de la solicitud *"
          name="reason"
          placeholder="Describe el motivo de la solicitud"
          value={formData.reason}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.reason ? (
          <small className={styles.error}>{errors.reason}</small>
        ) : null}

        {requestCreateInputFields.map((field) => (
          <FormInput
            key={field.name}
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            select={field.select}
            type={field.type}
            value={formData[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[field.name]}
            validation={requestCreateFieldValidations[field.name]}
          />
        ))}

        <footer className={styles.footerActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton}>
            Enviar solicitud
          </button>
        </footer>
      </form>
    </section>
  );
};

export default RequestCreate;
