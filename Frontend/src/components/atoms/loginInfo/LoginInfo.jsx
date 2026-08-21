import { Check, Copy, KeyRound, LogIn, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import styles from "./LoginInfo.module.css";

const LoginInfo = ({
  email,
  password,
  onUseCredentials,
  actionLabel = "usar demo",
  className = "",
}) => {
  const [copiedField, setCopiedField] = useState("");

  const copyValue = async (field, value) => {
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1400);
    } catch (error) {
      console.error("No se pudo copiar la credencial demo:", error);
    }
  };

  return (
    <article
      className={`${styles.card} ${className}`}
      aria-label="Credenciales demo"
    >
      <header className={styles.header}>
        <span className={styles.headerIcon}>
          <UserRound />
        </span>
        <h2 className={styles.title}>Acceso demo</h2>
      </header>

      <div className={styles.credentials}>
        <div className={styles.row}>
          <Mail className={styles.icon} />
          <span className={styles.text}>
            <small>Correo</small>
            <strong>{email}</strong>
          </span>
          <button
            type="button"
            className={styles.iconButton}
            title="Copiar correo"
            aria-label="Copiar correo demo"
            onClick={() => copyValue("email", email)}
          >
            {copiedField === "email" ? <Check /> : <Copy />}
          </button>
        </div>

        <div className={styles.row}>
          <KeyRound className={styles.icon} />
          <span className={styles.text}>
            <small>Contraseña</small>
            <strong>{password}</strong>
          </span>
          <button
            type="button"
            className={styles.iconButton}
            title="Copiar contraseña"
            aria-label="Copiar contraseña demo"
            onClick={() => copyValue("password", password)}
          >
            {copiedField === "password" ? <Check /> : <Copy />}
          </button>
        </div>
      </div>

      <button
        type="button"
        className={styles.useButton}
        onClick={onUseCredentials}
      >
        <LogIn />
        {actionLabel}
      </button>
    </article>
  );
};

export default LoginInfo;
