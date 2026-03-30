import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./ProductForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImgPicker from "@/components/atoms/imgPicker/ImgPicker";
import { productInputFields } from "@/data/productRegisterData";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import { formatDate } from "@/utils/formatDate";

const ProductForm = ({ title }) => {
  const [errors, setErrors] = useState({});
  const { toggleLoader } = useLoader();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    url_img: "",
    brand: "",
    amount: "",
    expiration: "",
    unit: "",
    supplier: "",
    price: "",
    observations: "",
  });

  //validamos formulario antes de enviar, mostrando errores debajo de cada campo
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (!/^[A-Za-z0-9\s]{3,}$/.test(formData.name.trim())) {
      newErrors.name = "Minimo 3 caracteres";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marca es obligatoria.";
    } else if (!/^[A-Za-z0-9\s]{2,}$/.test(formData.brand.trim())) {
      newErrors.brand = "Minimo 2 caracteres";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Selecciona un tipo.";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "La cantidad es obligatoria.";
    } else if (!/^(?:[1-9]\d{0,3})$/.test(formData.amount.trim())) {
      newErrors.amount = "Ingresa una cantidad valida";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "La unidad de medida es obligatoria.";
    } else if (!/^.{1,10}$/.test(formData.unit.trim())) {
      newErrors.unit = "Hasta 10 caracteres";
    }

    if (!formData.price.trim()) {
      newErrors.price = "El precio unitario es obligatorio.";
    } else if (!/^\d{1,9}$/.test(formData.price.trim())) {
      newErrors.price = "Solo numeros (hasta 9 digitos)";
    }

    if (
      formData.expiration.trim() &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.expiration.trim())
    ) {
      newErrors.expiration = "Formato esperado YYYY-MM-DD";
    }

    if (formData.supplier.trim() && !/^.{3,}$/.test(formData.supplier.trim())) {
      newErrors.supplier = "Minimo 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
          credentials: "include",
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
          url_img: product.url_img ?? "",
          brand: product.marca ?? "",
          amount: String(product.cantidad ?? ""),
          expiration: formatDate(product.fecha_vencimiento),
          unit: product.unidad_medida ?? "",
          supplier: product.proveedor ?? "",
          price: String(product.precio_unitario ?? ""),
          observations: product.observaciones ?? "",
        });
      } catch (error) {
        console.error("Error en getDetails:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getDetails();
  }, [id, isEditMode]);

  // validamos cada campo individualmente al salir de el, mostrando el error debajo del campo
  const handleBlur = (e) => {
    const { name } = e.target;
    const isValid = validateForm();

    if (isValid) return;

    setErrors((prev) => ({ [name]: prev[name] }));
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //envio final del formulario para crear o editar el producto dependiendo del modo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
        credentials: "include",
        body: JSON.stringify({
          nombre: formData.name.trim(),
          id_tipo: Number(formData.type),
          url_img: formData.url_img || null,
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

          <form className={styles.formLayout} onSubmit={handleSubmit}>
            <ImgPicker
              urlValue={formData.url_img}
              setUrlState={(url) =>
                setFormData((prev) => ({ ...prev, url_img: url }))
              }
            />

            <div className={styles.inputsGrid}>
              {productInputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
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

export default ProductForm;
