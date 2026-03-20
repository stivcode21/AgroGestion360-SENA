import WelcomeLayout from "@/components/templates/welcomeLayout/WelcomeLayout";
import Logo from "@/components/atoms/logo/Logo";
import styles from "./Login.module.css";
import { ArrowRight, Eye, EyeClosed, Lock, User } from "lucide-react";
import Button from "@/components/templates/button/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toggleLoader } = useLoader();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //validacion para no enviar vacio
    if (!email.trim()) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return false;
    }
    if (!password.trim()) {
      toast.error("Por favor, ingresa tu contraseña.");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("El correo electrónico no cumple con el formato requerido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      toggleLoader(true);
      const res = await fetch(buildApiUrl("auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // importante para que guarde la cookie
        body: JSON.stringify({ email: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en inicio de sesion:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <WelcomeLayout>
      <header className={styles.header}>
        <Logo />
      </header>
      <form action="" className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>INICIAR SESION</h1>
        <div className={styles.containerInput}>
          <label htmlFor="Usuario" className={styles.label}>
            <i className={styles.icon}>
              <User />
            </i>
            Correo electronico:
          </label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.containerInput}>
          <label htmlFor="Usuario" className={styles.label}>
            <i className={styles.icon}>
              <Lock />
            </i>
            Contraseña:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.eyeButton}
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>

        <Button type="primary" onClick={handleSubmit}>
          iniciar sesión
          <ArrowRight />
        </Button>
        <a href="/aaaaa" className={styles.link}>
          ¿olvidaste tu contraseña?
        </a>
      </form>
      <footer className={styles.footer}>
        Accede como dueño o administrador según tus credenciales
      </footer>
    </WelcomeLayout>
  );
};

export default Login;
