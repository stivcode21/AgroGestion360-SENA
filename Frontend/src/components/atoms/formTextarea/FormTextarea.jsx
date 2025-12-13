import styles from "./FormTextarea.module.css";

const FormTextarea = ({ label, placeholder, name, style, ...props }) => {
  return (
    <label className={styles.field} style={style}>
      <span className={styles.label}>{label}</span>
      <textarea
        className={styles.textarea}
        name={name}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
};

export default FormTextarea;
