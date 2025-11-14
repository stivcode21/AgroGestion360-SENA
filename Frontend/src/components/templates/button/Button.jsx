import styles from "./Button.module.css";

const Button = ({ children, type = "primary", ...props }) => {
  const variant = type === "secondary" ? "secondary" : "primary";
  const className = `${styles.button} ${styles[variant]}`;

  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
