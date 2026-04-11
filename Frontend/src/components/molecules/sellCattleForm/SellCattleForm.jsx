import { useState } from "react";
import { X } from "lucide-react";
import { buildApiUrl } from "@/utils/apiBase";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import toast from "react-hot-toast";
import styles from "./SellCattleForm.module.css";

const SellCattleForm = ({ animalId, animalName, onCancel, onSuccess }) => {
  const { toggleLoader } = useLoader();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    salePrice: "",
    buyerName: "",
    observations: "",
  });

  const validateForm = () => {
    const nextErrors = {};

    if (!String(formData.salePrice).trim()) {
      nextErrors.salePrice = "El precio de venta es obligatorio.";
    } else if (!/^\d{1,10}$/.test(String(formData.salePrice).trim())) {
      nextErrors.salePrice = "Ingresa un valor numerico valido.";
    }

    if (!String(formData.buyerName).trim()) {
      nextErrors.buyerName = "El nombre del comprador es obligatorio.";
    } else if (!/^.{3,45}$/.test(String(formData.buyerName).trim())) {
      nextErrors.buyerName = "Minimo 3 y maximo 45 caracteres.";
    }

    if (
      String(formData.observations ?? "").trim() &&
      !/^.{3,255}$/.test(String(formData.observations).trim())
    ) {
      nextErrors.observations = "Minimo 3 y maximo 255 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === "salePrice" ? value.replace(/[^\d]/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      toggleLoader(true);

      const res = await fetch(buildApiUrl(`ganaderia/sell/${animalId}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          comprador: formData.buyerName.trim(),
          monto_total: Number(formData.salePrice),
          observaciones: formData.observations.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "No se pudo registrar la venta.");
        return;
      }

      toast.success(data.message || "Venta registrada correctamente.");
      onSuccess?.(data.data);
    } catch (error) {
      console.error("Error al registrar venta:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <div className={styles.content}>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onCancel}
        aria-label="Cerrar modal de venta"
      >
        <X className={styles.closeIcon} />
      </button>

      <h3 className={styles.title}>Registrar venta</h3>
      <p className={styles.description}>
        Completa los datos de la venta para marcar a{" "}
        {<span className={styles.animalName}>{animalName || "este animal"}</span>} como vendido.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="salePrice">
            Precio de venta
          </label>
          <input
            id="salePrice"
            name="salePrice"
            className={styles.input}
            type="text"
            placeholder="Ej. 2500000"
            value={formData.salePrice}
            onChange={handleChange}
          />
          {errors.salePrice ? (
            <p className={styles.error}>{errors.salePrice}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="buyerName">
            Nombre del comprador
          </label>
          <input
            id="buyerName"
            name="buyerName"
            className={styles.input}
            type="text"
            placeholder="Ej. Juan Perez"
            value={formData.buyerName}
            onChange={handleChange}
          />
          {errors.buyerName ? (
            <p className={styles.error}>{errors.buyerName}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="observations">
            Observaciones
          </label>
          <textarea
            id="observations"
            name="observations"
            className={styles.textarea}
            placeholder="Agrega una observacion de la venta"
            value={formData.observations}
            onChange={handleChange}
          />
          {errors.observations ? (
            <p className={styles.error}>{errors.observations}</p>
          ) : null}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton}>
            Confirmar venta
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellCattleForm;
