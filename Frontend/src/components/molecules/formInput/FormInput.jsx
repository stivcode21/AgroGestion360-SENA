import { useEffect, useState } from "react";
import { buildApiUrl } from "@/utils/apiBase";
import styles from "./FormInput.module.css";

const FormInput = ({
  label,
  placeholder,
  name,
  select,
  type = "text",
  validation = {},
  error,
  ...rest
}) => {
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  useEffect(() => {
    const endpoint = select?.endpoint;

    if (!endpoint) {
      setDynamicOptions([]);
      return;
    }

    const getDynamicOptions = async () => {
      try {
        setIsLoadingOptions(true);

        const res = await fetch(buildApiUrl(endpoint), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message || "No se pudieron cargar las opciones.");
          setDynamicOptions([]);
          return;
        }

        const mappedOptions = (data.data ?? []).map((item) => ({
          value: String(item.id),
          label: item.nombre,
        }));

        setDynamicOptions(mappedOptions);
      } catch (fetchError) {
        console.error("Error al cargar opciones del select:", fetchError);
        setDynamicOptions([]);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    getDynamicOptions();
  }, [select?.endpoint]);

  // comprobar si el select es controlado (tiene prop value) o no, para evitar warning de React
  const isControlledSelect =
    select && Object.prototype.hasOwnProperty.call(rest, "value");
  const resolvedOptions = select?.endpoint ? dynamicOptions : select?.options ?? [];
  const isSelectDisabled = Boolean(rest.disabled || isLoadingOptions);
  const inputClassName = error
    ? `${styles.input} ${styles.inputError}`
    : styles.input;

  return (
    <div className={styles.field} htmlFor={name}>
      <label className={styles.label}>{label}</label>
      {select ? (
        <select
          className={inputClassName}
          name={name}
          id={name}
          {...(!isControlledSelect ? { defaultValue: "" } : {})}
          aria-invalid={!!error}
          {...rest}
          disabled={isSelectDisabled}
        >
          <option value="" disabled hidden>
            {isLoadingOptions
              ? "Cargando opciones..."
              : placeholder || "Selecciona una opcion"}
          </option>
          {resolvedOptions.map((option) => {
            const value = option.value;
            const labelText = option.label;

            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          className={inputClassName}
          name={name}
          id={name}
          placeholder={placeholder}
          type={type}
          aria-invalid={!!error}
          {...rest}
        />
      )}
      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
};

export default FormInput;
