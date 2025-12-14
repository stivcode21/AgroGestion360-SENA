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
  const { pattern } = validation;
  const inputClassName = error
    ? `${styles.input} ${styles.inputError}`
    : styles.input;

  return (
    <label className={styles.field} htmlFor={name}>
      <span className={styles.label}>{label}</span>
      {select ? (
        <select
          className={inputClassName}
          name={name}
          id={name}
          defaultValue=""
          aria-invalid={!!error}
          {...rest}
        >
          <option value="" disabled hidden>
            {placeholder || "Selecciona una opcion"}
          </option>
          {select.options?.map((option) => {
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
          pattern={pattern}
          type={type}
          aria-invalid={!!error}
          {...rest}
        />
      )}
      {error && <small className={styles.error}>{error}</small>}
    </label>
  );
};

export default FormInput;
