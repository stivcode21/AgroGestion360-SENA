import { useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import styles from "./VacunaForm.module.css";

const vacunaFields = [
  {
    name: "tipoVacuna", 
    label: "Tipo de vacuna",
    placeholder: "Ej. Brucelosis",
    type: "text",
  },
  {
    name: "dosis",
    label: "Dosis aplicada",
    placeholder: "Ej. 5 ml",
    type: "text",
  },
  {
    name: "fecha_aplicacion",
    label: "Fecha de aplicacion",
    placeholder: "Selecciona una fecha",
    type: "date",
  },
  {
    name: "responsable",
    label: "Responsable de la vacunacion",
    placeholder: "Ej. Juan Perez",
    type: "text",
  },
  {
    name: "observaciones2",
    label: "Observaciones",
    placeholder: "Ej. se debe vacunar nuevamente en 30-01-2028",
    type: "text",
  },
];

const createEmptyVaccination = () => ({
  tipoVacuna: "",
  dosis: "",
  fecha_aplicacion: "",
  responsable: "",
  observaciones2: "",
});

const VacunaForm = ({ onAddVaccination, onCancel }) => {
  const [formDataVacuna, setFormDataVacuna] = useState(createEmptyVaccination());
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const nextErrors = {};

    if (!formDataVacuna.tipoVacuna.trim()) {
      nextErrors.tipoVacuna = "El tipo de vacunacion es obligatorio.";
    } else if (!/^.{3,}$/.test(formDataVacuna.tipoVacuna.trim())) {
      nextErrors.tipoVacuna = "Minimo 3 caracteres.";
    }

    if (!formDataVacuna.dosis.trim()) {
      nextErrors.dosis = "La dosis es obligatoria.";
    } else if (!/^.{1,20}$/.test(formDataVacuna.dosis.trim())) {
      nextErrors.dosis = "Hasta 20 caracteres.";
    }

    if (!formDataVacuna.fecha_aplicacion.trim()) {
      nextErrors.fecha_aplicacion = "La fecha de aplicacion es obligatoria.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formDataVacuna.fecha_aplicacion.trim())) {
      nextErrors.fecha_aplicacion = "Formato esperado YYYY-MM-DD";
    }

    if (!formDataVacuna.responsable.trim()) {
      nextErrors.responsable = "El responsable es obligatorio.";
    } else if (!/^.{3,60}$/.test(formDataVacuna.responsable.trim())) {
      nextErrors.responsable = "Minimo 3 y maximo 60 caracteres.";
    }

    if (
      formDataVacuna.observaciones2.trim() &&
      !/^.{3,250}$/.test(formDataVacuna.observaciones2.trim())
    ) {
      nextErrors.observaciones2 = "Minimo 3 y maximo 250 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormDataVacuna((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Llama a la función pasada como prop para agregar la vacuna
    onAddVaccination?.({
      ...formDataVacuna,
      localId: Date.now().toString(),
    });

    setFormDataVacuna(createEmptyVaccination());
    setErrors({});
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.sectionTitle}>
            Registro de vacuna <span>(Opcional)</span>
          </h3>
          <p className={styles.description}>
            Completa estos datos solo si deseas dejar registrada una vacunacion
            asociada al animal.
          </p>
        </div>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputsGrid}>
          {vacunaFields.map((field) => (
            <FormInput
              key={field.name}
              label={field.label}
              name={field.name}
              error={errors[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              type={field.type}
              value={formDataVacuna[field.name] ?? ""}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton}>
            Agregar vacunacion
          </button>
        </div>
      </form>
    </section>
  );
};

export default VacunaForm;
