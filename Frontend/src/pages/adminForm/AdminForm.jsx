import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./AdminForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Eye, EyeClosed, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";
import {
  adminFieldValidations,
  adminInputFields,
} from "@/data/adminRegisterData";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";

const initialFormData = {
  name: "",
  age: "",
  docType: "",
  document: "",
  phone: "",
  email: "",
  password: "",
};

const AdminForm = ({ title }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { toggleLoader } = useLoader();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const validateField = (name, value) => {
    const trimmedValue = String(value ?? "").trim();
    const rule = adminFieldValidations[name];

    if (name === "docType" && !trimmedValue) {
      return "Selecciona un tipo de documento.";
    }

    if (name === "password") {
      if (!isEditMode && trimmedValue.length < 6) {
        return "La contrasena debe tener minimo 6 caracteres.";
      }
      return "";
    }

    if (rule?.pattern && !rule.pattern.test(trimmedValue)) {
      return rule.message;
    }

    return "";
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // envio de formulario para crear o actualizar un admin dependiendo del modo
  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    [...adminInputFields.map((field) => field.name), "password"].forEach(
      (fieldName) => {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) {
          nextErrors[fieldName] = error;
        }
      },
    );

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      toggleLoader(true);

      const endpoint = isEditMode ? `auth/update/${id}` : "auth/admin";
      const method = isEditMode ? "PUT" : "POST";
      const trimmedPassword = formData.password.trim();

      const payload = {
        nombre_completo: formData.name.trim(),
        edad: Number(formData.age),
        id_tipo_documento: Number(formData.docType),
        numero_documento: formData.document.trim(),
        celular: formData.phone.trim(),
        correo: formData.email.trim(),
        id_rol: 2,
        ...(trimmedPassword ? { contrasena: trimmedPassword } : {}),
      };

      const res = await fetch(buildApiUrl(endpoint), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      navigate("/settings");
    } catch (error) {
      console.error("Error al guardar admin:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    if (!isEditMode) {
      setFormData(initialFormData);
      setErrors({});
      setPreviewUrl("");
      return;
    }

    // funcion para obtener los detalles del admin a editar y cargar la informacion en el formulario
    const getAdminDetails = async () => {
      try {
        toggleLoader(true);
        const res = await fetch(buildApiUrl(`auth/user/${id}`), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        const admin = data.user;

        setFormData({
          name: admin.nombre_completo ?? "",
          age: String(admin.edad ?? ""),
          docType: String(admin.id_tipo_documento ?? ""),
          document: admin.numero_documento ?? "",
          phone: admin.celular ?? "",
          email: admin.correo ?? "",
          password: "",
        });
        setPreviewUrl(admin.url_img || "");
      } catch (error) {
        console.error("Error al obtener admin:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getAdminDetails();
  }, [id, isEditMode]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <MainLayout>
      <section className={styles.page}>
        <button className={styles.titleGroup}>
          <Link to="/settings" className={styles.back}>
            <ArrowLeft />
            <span>Volver</span>
          </Link>
        </button>
        <header>
          <h1 className={styles.title}>{title}</h1>
        </header>

        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Informacion</h3>

          <form className={styles.formLayout} onSubmit={handleSubmit}>
            <ImagePicker
              handleImageClick={handleImageClick}
              handleImageChange={handleImageChange}
              previewUrl={previewUrl}
              inputRef={inputRef}
            />

            <div className={styles.inputsGrid}>
              {adminInputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  select={field?.select}
                  validation={adminFieldValidations[field.name]}
                  error={errors[field.name]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={field?.type}
                  value={formData[field.name] ?? ""}
                />
              ))}
            </div>
            <div className={styles.containerInput}>
              <span className={styles.label}>
                {isEditMode
                  ? "Restablecer contrasena (opcional):"
                  : "Contrasena *:"}
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ""
                }`}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={styles.eyeButton}
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
              {errors.password ? (
                <small className={styles.error}>{errors.password}</small>
              ) : null}
            </div>
            <div className={styles.footerActions}>
              <Button type="three" buttonType="submit">
                <Save /> Guardar
              </Button>
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default AdminForm;
