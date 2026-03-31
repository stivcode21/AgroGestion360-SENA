import { KeyRound, Save } from "lucide-react";
import { useEffect, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import ImgPicker from "@/components/atoms/imgPicker/ImgPicker";
import Button from "@/components/templates/button/Button";
import {
  settingsProfileFieldValidations,
  settingsProfileInputFields,
} from "@/data/settingsProfileData";
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

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    const rule = settingsProfileFieldValidations[name];

    if (rule?.pattern && !rule.pattern.test(trimmedValue)) {
      setErrors((prev) => ({ ...prev, [name]: rule.message }));
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
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

    const nextErrors = {};

    // validamos cada campo con su respectiva regla
    Object.entries(settingsProfileFieldValidations).forEach(([name, rule]) => {
      const value = String(formData[name] ?? "").trim();
      if (rule.pattern && !rule.pattern.test(value)) {
        nextErrors[name] = rule.message;
      }
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
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
          Gestionar credenciales de acceso
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
                validation={settingsProfileFieldValidations[field.name]}
                error={errors[field.name]}
                onBlur={handleBlur}
                onChange={handleChange}
                type={field?.type}
                value={formData[field.name] ?? ""}
                disabled={field?.name === "role"}
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
