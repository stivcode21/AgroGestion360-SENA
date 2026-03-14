import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";
import FormInput from "@/components/molecules/formInput/FormInput";
import styles from "./UpdateCrendentials.module.css";

const UpdateCrendentials = ({ isOpen, userId, defaultUsername = "", onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "newPassword") {
      setNewPassword(value);
    }

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const simulateUpdateCredentials = async ({ userId, username, newPassword }) => {
    // Reemplaza esta simulacion por tu fetch PUT cuando conectes la API.
    // Ejemplo: await fetch(buildApiUrl(`auth/editadmin/${userId}`), { method: "PUT", ... })
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log("[SIMULACION PUT] Actualizar credenciales:", {
      userId,
      username,
      newPassword,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const trimmedUsername = defaultUsername.trim();

    if (!newPassword) {
      nextErrors.newPassword = "Campo obligatorio";
    } else if (newPassword.length < 8) {
      nextErrors.newPassword = "Minimo 8 caracteres";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Campo obligatorio";
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Las contrasenas no coinciden";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await simulateUpdateCredentials({
      userId,
      username: trimmedUsername,
      newPassword,
    });

    handleClose();
  };

  return (
    <section className={styles.backdrop} onClick={handleClose}>
      <article
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.iconWrap}>
            <KeyRound size={18} />
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </header>

        <div className={styles.content}>
          <h3 className={styles.title}>Actualizar credenciales de acceso</h3>
          <p className={styles.userMeta}>
            ID usuario: <span className={styles.userId}>{userId}</span>
          </p>
          <p className={styles.userMeta}>
            Nombre de usuario:{" "}
            <span className={styles.userId}>{defaultUsername}</span>
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.passwordField}>
            <FormInput
              label="Nueva contrasena *"
              name="newPassword"
              placeholder="Minimo 8 caracteres"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={handleChange}
              error={errors.newPassword}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowNewPassword((prev) => !prev)}
              aria-label={
                showNewPassword
                  ? "Ocultar nueva contrasena"
                  : "Mostrar nueva contrasena"
              }
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className={styles.passwordField}>
            <FormInput
              label="Confirmar contrasena *"
              name="confirmPassword"
              placeholder="Repite la contrasena"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmacion de contrasena"
                  : "Mostrar confirmacion de contrasena"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <footer className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Guardar cambios
            </button>
          </footer>
        </form>
      </article>
    </section>
  );
};

export default UpdateCrendentials;
