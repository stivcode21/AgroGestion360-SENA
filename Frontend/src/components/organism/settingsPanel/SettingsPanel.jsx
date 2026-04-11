import { KeyRound, Save } from "lucide-react";
import { useEffect, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import ImgPicker from "@/components/atoms/imgPicker/ImgPicker";
import Button from "@/components/templates/button/Button";
import { settingsProfileInputFields } from "@/data/settingsProfileData";
import { useUserStore } from "@/store/userStore";
import styles from "./SettingsPanel.module.css";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";

const SettingsPanel = ({ onOpenCredentials }) => {
  const [errors, setErrors] = useState({});
  const { user, setUser } = useUserStore();
  const { toggleLoader } = useLoader();
  const [initialFormData, setInitialFormData] = useState(null);

  // Inicializamos el formulario con los datos del usuario
  const [formData, setFormData] = useState({});

  const validateForm = () => {
    const nextErrors = {};

    if (!String(formData.name ?? "").trim()) {
      nextErrors.name = "El nombre es obligatorio.";
    } else if (!/^[A-Za-z\s]{3,}$/.test(String(formData.name).trim())) {
      nextErrors.name = "Solo letras y espacios (min 3 caracteres)";
    }

    if (!String(formData.age ?? "").trim()) {
      nextErrors.age = "La edad es obligatoria.";
    } else if (!/^(?:1[89]|[2-9]\d)$/.test(String(formData.age).trim())) {
      nextErrors.age = "Ingresa una edad valida (18-99)";
    }

    if (!String(formData.document ?? "").trim()) {
      nextErrors.document = "El numero de documento es obligatorio.";
    } else if (!/^\d{6,12}$/.test(String(formData.document).trim())) {
      nextErrors.document = "Entre 6 y 12 numeros";
    }

    if (!String(formData.role ?? "").trim()) {
      nextErrors.role = "El rol es obligatorio.";
    } else if (!/^.{3,}$/.test(String(formData.role).trim())) {
      nextErrors.role = "Ingresa minimo 3 caracteres";
    }

    if (!String(formData.phone ?? "").trim()) {
      nextErrors.phone = "El numero de celular es obligatorio.";
    } else if (!/^\d{10}$/.test(String(formData.phone).trim())) {
      nextErrors.phone = "Ingresa exactamente 10 digitos";
    }

    if (!String(formData.email ?? "").trim()) {
      nextErrors.email = "El correo electronico es obligatorio.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email).trim())
    ) {
      nextErrors.email = "Correo electronico invalido";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const isValid = validateForm();

    if (isValid) return;

    setErrors((prev) => ({ [name]: prev[name] }));
  };

  // Actualizamos el estado cuando cambian los datos del usuario
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Actualizamos cuando cambian los datos del usuario y cuando se monta el componente
  useEffect(() => {
    if (!user) return;

    const userFormData = {
      name: user.nombre_completo || "",
      age: String(user.edad || ""),
      docType: String(user.id_tipo_documento || ""),
      document: user.numero_documento || "",
      role: user.id_rol === 1 ? "Dueño" : "Administrador",
      url_img: user.url_img || "",
      phone: user.celular || "",
      email: user.correo || "",
    };

    setInitialFormData(userFormData);
    setFormData(userFormData);
  }, [user]);

  const hasChanges =
    initialFormData &&
    JSON.stringify(formData) !== JSON.stringify(initialFormData);

  //envio final del formulario para editar el perfil del usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      toast.error("No hay cambios para guardar.");
      return;
    }

    try {
      toggleLoader(true);

      // Guarda solo los campos editables del perfil y deja intacta la sesion actual.
      const res = await fetch(buildApiUrl(`auth/update/${user.id_usuario}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre_completo: formData.name.trim(),
          edad: Number(formData.age),
          id_tipo_documento: formData.docType || null,
          numero_documento: formData.document,
          celular: formData.phone || null,
          url_img: formData.url_img || null,
          correo: formData.email || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      if (data?.data) {
        // Refresca el store global con la respuesta del backend para evitar recargar la pagina.
        const updatedFormData = {
          name: data.data.nombre_completo || "",
          age: String(data.data.edad || ""),
          docType: String(data.data.id_tipo_documento || ""),
          document: data.data.numero_documento || "",
          role: data.data.id_rol === 1 ? "Dueño" : "Administrador",
          url_img: data.data.url_img || "",
          phone: data.data.celular || "",
          email: data.data.correo || "",
        };

        setUser(data.data);
        setInitialFormData(updatedFormData);
        setFormData(updatedFormData);
      }

      toast.success(data.message);
    } catch (error) {
      console.error("Error al editar usuario:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Mi perfil</h2>
          <p className={styles.subtitle}>
            Edita tu informacion personal. Recuerda guardar los cambios antes de
            salir de esta seccion.
          </p>
        </div>
        <button
          type="button"
          className={styles.credentialsButton}
          onClick={() =>
            onOpenCredentials?.(user?.id_usuario, user?.nombre_completo)
          }
        >
          <KeyRound size={16} />
          Cambiar contraseña
        </button>
      </header>

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>Informacion</h3>
        <form className={styles.formLayout} onSubmit={handleSubmit}>
          <ImgPicker
            urlValue={formData.url_img}
            setUrlState={(url) =>
              setFormData((prev) => ({ ...prev, url_img: url }))
            }
          />

          <div className={styles.inputsGrid}>
            {settingsProfileInputFields.map((field) => (
              <FormInput
                key={field.name}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                select={field?.select}
                error={errors[field.name]}
                onBlur={handleBlur}
                onChange={handleChange}
                type={field?.type}
                value={formData[field.name] ?? ""}
                disabled={field?.name === "email" || field?.name === "role"}
              />
            ))}
          </div>
          <div className={styles.footerActions}>
            <Button type="three" buttonType="submit">
              <Save /> Guardar
            </Button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default SettingsPanel;
