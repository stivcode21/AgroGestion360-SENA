import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./ProductForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";
import {
  productFieldValidations,
  productInputFields,
} from "@/data/productRegisterData";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import { formatDate } from "@/utils/formatDate";

const ProductForm = ({ title }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const { toggleLoader } = useLoader();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    amount: "",
    expiration: "",
    unit: "",
    supplier: "",
    price: "",
    observations: "",
  });

  // obtenemos los detalles del producto si estamos en modo edicion
  useEffect(() => {
    if (!isEditMode) return;

    const getDetails = async () => {
      try {
        toggleLoader(true);
        // Consulta el producto actual para editar con la ultima informacion guardada.
        const res = await fetch(buildApiUrl(`product/getproduct/${id}`), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        const product = data.data;

        setFormData({
          name: product.nombre ?? "",
          type: String(product.id_tipo ?? ""),
          brand: product.marca ?? "",
          amount: String(product.cantidad ?? ""),
          expiration: formatDate(product.fecha_vencimiento),
          unit: product.unidad_medida ?? "",
          supplier: product.proveedor ?? "",
          price: String(product.precio_unitario ?? ""),
          observations: product.observaciones ?? "",
        });

        setPreviewUrl(product.url_img || "");
      } catch (error) {
        console.error("Error en getDetails:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getDetails();
  }, [id, isEditMode]);

  // validamos el campo cuando sale del input
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = String(value ?? "").trim();
    const rule = productFieldValidations[name];

    if (rule?.pattern && !rule.pattern.test(trimmedValue)) {
      setErrors((prev) => ({ ...prev, [name]: rule.message }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //envio final del formulario para crear o editar el producto dependiendo del modo
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};

    // validamos cada campo con su respectiva regla
    Object.entries(productFieldValidations).forEach(([name, rule]) => {
      const value = String(formData[name] ?? "").trim();
      if (rule.pattern && !rule.pattern.test(value)) {
        nextErrors[name] = rule.message;
      }
    });

    if (!formData.type) {
      nextErrors.type = "Selecciona un tipo.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      toggleLoader(true);

      const endpoint = isEditMode ? `product/edit/${id}` : "product/register";
      const method = isEditMode ? "PUT" : "POST";

      // Convierte los valores del formulario al formato que espera la API de inventario.
      const res = await fetch(buildApiUrl(endpoint), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.name.trim(),
          id_tipo: Number(formData.type),
          marca: formData.brand || null,
          cantidad: Number(formData.amount),
          fecha_vencimiento: formData.expiration || null,
          unidad_medida: formData.unit || null,
          proveedor: formData.supplier || null,
          precio_unitario: Number(formData.price),
          observaciones: formData.observations || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      navigate("/inventario");
    } catch (error) {
      console.error("Error en inicio de sesion:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  // manejamos el click en la imagen para abrir el selector de archivos
  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <MainLayout>
      <section className={styles.page}>
        <button className={styles.titleGroup}>
          <Link to="/inventario" className={styles.back}>
            <ArrowLeft />
            <span>Volver</span>
          </Link>
        </button>
        <header>
          <h1 className={styles.title}>{title}</h1>
        </header>
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Informacion</h3>

          <div className={styles.formLayout}>
            <ImagePicker
              handleImageClick={handleImageClick}
              handleImageChange={handleImageChange}
              previewUrl={previewUrl}
              inputRef={inputRef}
            />

            <form className={styles.inputsGrid}>
              {productInputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  validation={productFieldValidations[field.name]}
                  select={field?.select}
                  error={errors[field.name]}
                  onBlur={handleBlur}
                  onChange={handlechange}
                  required={field?.required}
                  type={field?.type}
                  value={formData[field.name] ?? ""}
                />
              ))}
              <FormTextarea
                label="Observaciones"
                name="observations"
                onChange={handlechange}
                placeholder="Agrega una descripcion del producto"
                style={{ gridColumn: "1 / -1" }}
                value={formData.observations}
              />
            </form>
          </div>

          <div className={styles.footerActions}>
            <Button type="three" onClick={handleSubmit}>
              <Save /> Guardar
            </Button>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default ProductForm;
