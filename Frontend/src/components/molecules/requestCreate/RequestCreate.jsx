import { useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import styles from "./RequestCreate.module.css";

const requestTypeOptions = [
  { label: "Insumo", value: "insumo" },
  { label: "Alimento", value: "alimento" },
];

const insumoCategoryOptions = [
  { label: "Fertilizante", value: "fertilizante" },
  { label: "Herramienta", value: "herramienta" },
  { label: "Material de empaque", value: "material-empaque" },
];

const alimentoSpeciesOptions = [
  { label: "Cerdos", value: "cerdos" },
  { label: "Peces", value: "peces" },
  { label: "Ganado", value: "ganado" },
  { label: "Gallinas", value: "gallinas" },
];

const unitOptions = [
  { label: "Kg", value: "kg" },
  { label: "Litros", value: "litros" },
  { label: "Sacos", value: "sacos" },
  { label: "Bultos", value: "bultos" },
];

const alimentoCategoryOptions = [
  { label: "Alimento balanceado", value: "alimento-balanceado" },
  { label: "Suplemento", value: "suplemento" },
];

const baseDynamicFields = [
  { name: "name", label: "Nombre", placeholder: "Ej. Urea granulada" },
  {
    name: "quantity",
    label: "Cantidad",
    placeholder: "Ej. 10",
    type: "number",
  },
];

const alimentoExtraFields = [
  {
    name: "species",
    label: "Especie destino",
    placeholder: "Selecciona una especie",
    select: { options: alimentoSpeciesOptions },
  },
  {
    name: "unit",
    label: "Unidad de medida",
    placeholder: "Selecciona una unidad",
    select: { options: unitOptions },
  },
  {
    name: "provider",
    label: "Proveedor",
    placeholder: "Ej. Agroinsumos del Norte",
  },
];

const requiredByType = {
  insumo: ["name", "quantity", "category"],
  alimento: ["name", "quantity", "species", "unit", "provider", "category"],
};

const alwaysRequiredFields = ["title", "reason", "requestType"];

const initialForm = {
  title: "",
  reason: "",
  requestType: "",
  name: "",
  quantity: "",
  category: "",
  species: "",
  unit: "",
  provider: "",
};

const RequestCreate = ({ onCancel, onSubmitRequest }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Tipo seleccionado por el usuario en el formulario.
  const selectedType = formData.requestType;
  // Solo mostramos campos dinamicos cuando el tipo es insumo o alimento.
  const showDynamicFields =
    selectedType === "insumo" || selectedType === "alimento";
  // Bandera para aplicar logica especifica cuando es alimento.
  const isAlimento = selectedType === "alimento";

  // Campos dinamicos:
  // - alimento: campos base + campos extra
  // - insumo: solo campos base
  // - sin tipo: ningun campo extra
  const dynamicFields = isAlimento
    ? [...baseDynamicFields, ...alimentoExtraFields]
    : showDynamicFields
      ? baseDynamicFields
      : [];

  // Las categorias cambian segun el tipo seleccionado.
  const categoryOptions =
    selectedType === "insumo"
      ? insumoCategoryOptions
      : selectedType === "alimento"
        ? alimentoCategoryOptions
        : [];

  // Actualiza el estado del formulario cada vez que cambia un input.
  // Tambien limpia el error del campo editado si ya tenia uno.
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

  // Maneja el envio:
  // 1) Evita recargar la pagina.
  // 2) Calcula campos obligatorios segun el tipo.
  // 3) Valida campos vacios y muestra errores.
  // 4) Si todo esta correcto, envia la data y reinicia el formulario.
  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = [
      ...alwaysRequiredFields,
      ...(requiredByType[selectedType] || []),
    ];

    const nextErrors = {};
    requiredFields.forEach((field) => {
      const value = String(formData[field] || "").trim();
      if (!value) {
        nextErrors[field] = "Campo obligatorio";
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
          label="Titulo"
          name="title"
          placeholder="Ej. Compra de fertilizante"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
        />

        <FormTextarea
          label="Motivo de la solicitud"
          name="reason"
          placeholder="Describe el motivo de la solicitud"
          value={formData.reason}
          onChange={handleChange}
        />
        {errors.reason ? (
          <small className={styles.error}>{errors.reason}</small>
        ) : null}

        <FormInput
          label="Tipo de insumo"
          name="requestType"
          placeholder="Selecciona un tipo"
          select={{ options: requestTypeOptions }}
          value={formData.requestType}
          onChange={handleChange}
          error={errors.requestType}
        />

        {showDynamicFields ? (
          <section className={styles.dynamicFields}>
            {dynamicFields.map((field) => (
              <FormInput
                key={field.name}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                select={field.select}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                error={errors[field.name]}
              />
            ))}

            <FormInput
              label="Categoria del insumo"
              name="category"
              placeholder="Selecciona una categoria"
              select={{ options: categoryOptions }}
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            />
          </section>
        ) : null}

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
