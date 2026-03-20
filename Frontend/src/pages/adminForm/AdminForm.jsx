import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./AdminForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Eye, EyeClosed, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";
import { adminInputFields } from "@/data/adminRegisterData";
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre completo es obligatorio.";
    } else if (!/^[A-Za-z\s]{3,}$/.test(formData.name.trim())) {
      newErrors.name = "Solo letras y espacios (min 3 caracteres)";
    }

    if (!formData.age.trim()) {
      newErrors.age = "La edad es obligatoria.";
    } else if (!/^(?:1[89]|[2-9]\d)$/.test(formData.age.trim())) {
      newErrors.age = "Ingresa una edad valida (18-99)";
    }

    if (!formData.docType.trim()) {
      newErrors.docType = "Selecciona un tipo de documento.";
    }

    if (!formData.document.trim()) {
      newErrors.document = "El numero de documento es obligatorio.";
    } else if (!/^\d{6,12}$/.test(formData.document.trim())) {
      newErrors.document = "Entre 6 y 12 numeros";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El numero de celular es obligatorio.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Ingresa exactamente 10 digitos";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electronico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Correo electronico invalido";
    }

    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = "La contrasena es obligatoria.";
    } else if (
      formData.password.trim() &&
      formData.password.trim().length < 6
    ) {
      newErrors.password = "La contrasena debe tener minimo 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // validamos cada campo individualmente al salir de el, mostrando el error debajo del campo
  const handleBlur = (event) => {
    const { name } = event.target;
    const isValid = validateForm();

    if (isValid) return;

    setErrors((prev) => ({ [name]: prev[name] }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // envio de formulario para crear o actualizar un admin dependiendo del modo
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      toggleLoader(true);

      const endpoint = isEditMode ? `auth/update/${id}` : "auth/admin";
      const method = isEditMode ? "PUT" : "POST";
      const trimmedPassword = formData.password.trim();

      // Adapta los nombres del formulario al payload que espera el backend.
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

  // se ejecuta solo en el caso de que estemos editando un admin
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
        // Recupera el admin desde la API para precargar el formulario en modo edicion.
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
