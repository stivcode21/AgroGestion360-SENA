import { useEffect, useState } from "react";
import { KeyRound, Mail, X } from "lucide-react";
import FormInput from "@/components/molecules/formInput/FormInput";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import styles from "./PasswordForgot.module.css";

const PasswordForgot = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { toggleLoader } = useLoader();

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose?.();
  };

  const handleChange = (event) => {
    setEmail(event.target.value);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setError("El correo es obligatorio");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setError("Ingresa un correo valido");
      return;
    }

    try {
      toggleLoader(true);

      const res = await fetch(buildApiUrl("auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "No se pudo enviar la nueva contrasena.");
        return;
      }

      toast.success(data.message ?? "Nueva contrasena enviada al correo.");
      handleClose();
    } catch (error) {
      console.error("Error al recuperar contrasena:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <section className={styles.backdrop} onClick={handleClose}>
      <article
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.iconWrap}>
            <KeyRound size={20} />
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </header>

        <div className={styles.content}>
          <h3 className={styles.title}>Recuperar contrasena</h3>
          <p className={styles.description}>
            Ingresa tu correo y te enviaremos una nueva contrasena temporal.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrap}>
            <i className={styles.inputIcon}>
              <Mail size={18} />
            </i>
            <FormInput
              label="Correo electronico *"
              name="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={handleChange}
              error={error}
            />
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
              Enviar
            </button>
          </footer>
        </form>
      </article>
    </section>
  );
};

export default PasswordForgot;
