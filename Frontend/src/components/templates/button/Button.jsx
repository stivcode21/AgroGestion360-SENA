import styles from "./Button.module.css";

const Button = ({
  children,
  type = "primary",
  buttonType = "button",
  ...props
}) => {
  const variant = ["secondary", "primary", "three"];
  const current = variant.find((item) => item === type);
  const className = `${styles.button} ${styles[current]}`;

  return (
    <button type={buttonType} className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
