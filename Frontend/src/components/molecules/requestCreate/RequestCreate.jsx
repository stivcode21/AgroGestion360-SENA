import { useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import { requestCreateInputFields } from "@/data/requestCreateData";
import styles from "./RequestCreate.module.css";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";

const initialFormData = {
  title: "",
  reason: "",
  requestType: "",
  quantity: "",
  targetSpecies: "",
  unit: "",
  provider: "",
  expirationDate: "",
};

const RequestCreate = ({ onCancel }) => {
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});
  const { toggleLoader } = useLoader();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El titulo es obligatorio.";
    } else if (!/^.{3,}$/.test(formData.title.trim())) {
      newErrors.title = "Minimo 3 caracteres";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "El motivo es obligatorio.";
    } else if (!/^.{8,}$/.test(formData.reason.trim())) {
      newErrors.reason = "Minimo 8 caracteres";
    }

    if (!formData.requestType.trim()) {
      newErrors.requestType = "Selecciona un tipo.";
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = "La cantidad es obligatoria.";
    } else if (!/^(?:[1-9]\d{0,3})$/.test(formData.quantity.trim())) {
      newErrors.quantity = "Ingresa una cantidad valida";
    }

    if (!formData.targetSpecies.trim()) {
      newErrors.targetSpecies = "Selecciona una especie.";
    } else if (
      !/^(cerdos|peces|ganado|gallinas|ninguna)$/.test(
        formData.targetSpecies.trim(),
      )
    ) {
      newErrors.targetSpecies = "Selecciona una especie valida";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "La unidad de medida es obligatoria.";
    } else if (!/^(kg|litros|sacos|unidad)$/.test(formData.unit.trim())) {
      newErrors.unit = "Selecciona una unidad valida";
    }

    if (!formData.provider.trim()) {
      newErrors.provider = "El proveedor es obligatorio.";
    } else if (!/^.{3,}$/.test(formData.provider.trim())) {
      newErrors.provider = "Minimo 3 caracteres";
    }

    if (
      formData.expirationDate.trim() &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.expirationDate.trim())
    ) {
      newErrors.expirationDate = "Usa el formato AAAA-MM-DD";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleBlur = (event) => {
    const { name } = event.target;
    const isValid = validateForm();

    if (isValid) return;

    setErrors((prev) => ({ [name]: prev[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      toggleLoader(true);

      const payload = {
        titulo: formData.title.trim(),
        motivo: formData.reason.trim(),
        id_tipo_insumo: Number(formData.requestType.trim()),
        cantidad: Number(formData.quantity.trim()),
        especie_destino: formData.targetSpecies.trim() || null,
        unidad_medida: formData.unit.trim() || null,
        proveedor: formData.provider.trim() || null,
        fecha_vencimiento: formData.expirationDate.trim() || null,
      };

      const res = await fetch(buildApiUrl("request/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setFormData(initialFormData);
      setErrors({});
      onCancel?.();
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
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
