import styles from "./FormInput.module.css";

const FormInput = ({ label, placeholder, name }) => {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} name={name} placeholder={placeholder} />
    </label>
  );
};

export default FormInput;
