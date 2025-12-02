import styles from "./Button.module.css";

const Button = ({ children, type = "primary", ...props }) => {
  const variant = ["secondary", "primary", "three"];
  const current = variant.find((item) => item === type);
  const className = `${styles.button} ${styles[current]}`;

  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
